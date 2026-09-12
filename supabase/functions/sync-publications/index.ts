import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { classify } from "../_shared/classify.ts";

const PMC_LIST_URL =
  "https://raw.githubusercontent.com/jgalazka/SB_publications/main/SB_publication_PMC.csv";
const OSDR_SEARCH = "https://osdr.nasa.gov/osdr/data/search";
const EUROPE_PMC = "https://www.ebi.ac.uk/europepmc/webservices/rest/search";

type Row = Record<string, unknown>;

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  const src = text.replace(/^\uFEFF/, "");
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (quoted) {
      if (c === '"') {
        if (src[i + 1] === '"') {
          field += '"';
          i++;
        } else quoted = false;
      } else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (c !== "\r") field += c;
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((c) => c.trim() !== ""));
}

type PmcMeta = { year: number | null; authors: string[]; abstract: string | null };

async function fetchPmcMeta(ids: string[]) {
  const meta = new Map<string, PmcMeta>();
  for (let i = 0; i < ids.length; i += 25) {
    const batch = ids.slice(i, i + 25);
    const query = batch.map((id) => `PMCID:PMC${id}`).join(" OR ");
    try {
      const res = await fetch(
        `${EUROPE_PMC}?query=${encodeURIComponent(query)}&resultType=core&format=json&pageSize=25`,
      );
      if (!res.ok) continue;
      const json = await res.json();
      for (const r of json?.resultList?.result ?? []) {
        const pmcid = String(r.pmcid ?? "").replace("PMC", "");
        if (!pmcid) continue;
        meta.set(pmcid, {
          year: Number(r.pubYear) || null,
          authors: String(r.authorString ?? "")
            .split(",")
            .map((a: string) => a.trim())
            .filter(Boolean)
            .slice(0, 8),
          abstract: r.abstractText ? String(r.abstractText).slice(0, 6000) : null,
        });
      }
    } catch (_) {
      // Skip this batch; titles still sync without metadata.
    }
    await new Promise((r) => setTimeout(r, 200));
  }
  return meta;
}

async function collectPmc(): Promise<Row[]> {
  const res = await fetch(PMC_LIST_URL);
  if (!res.ok) throw new Error(`Publication list fetch failed [${res.status}]`);
  const rows = parseCsv(await res.text()).slice(1);

  const entries = rows
    .map(([title, link]) => {
      const id = String(link ?? "").match(/PMC(\d+)/)?.[1];
      return id && title ? { id, title: title.trim(), link: String(link).trim() } : null;
    })
    .filter(Boolean) as { id: string; title: string; link: string }[];

  const meta = await fetchPmcMeta(entries.map((e) => e.id));

  return entries.map((e) => {
    const m = meta.get(e.id);
    const c = classify(e.title, m?.abstract ?? "");
    return {
      external_id: `PMC${e.id}`,
      source: "NASA Space Biology (PMC)",
      title: e.title,
      authors: m?.authors ?? [],
      year: m?.year ?? null,
      source_url: e.link,
      abstract: m?.abstract ?? null,
      key_findings: [],
      ...c,
    };
  });
}

async function collectOsdr(): Promise<Row[]> {
  const out: Row[] = [];
  for (let from = 0; from < 900; from += 300) {
    const url = `${OSDR_SEARCH}?term=space&from=${from}&size=300&type=cgene`;
    const res = await fetch(url);
    if (!res.ok) break;
    const json = await res.json();
    const hits = json?.hits?.hits ?? [];
    if (!hits.length) break;
    for (const hit of hits) {
      const s = hit?._source ?? {};
      const accession = String(s["Accession"] ?? s["Study Identifier"] ?? "").trim();
      const title = String(s["Study Title"] ?? "").trim();
      if (!accession || !title) continue;
      const description = String(s["Study Description"] ?? "").slice(0, 4000);
      const c = classify(title, `${description} ${s["Flight Program"] ?? ""}`);
      const release = String(s["Study Public Release Date"] ?? "");
      const year = Number(release.match(/\d{4}/)?.[0]) || null;
      const organism = String(s["organism"] ?? "").trim();
      out.push({
        external_id: accession,
        source: "NASA OSDR",
        title,
        authors: String(s["Study Publication Author List"] ?? "")
          .split(/,|;/)
          .map((a) => a.trim())
          .filter(Boolean)
          .slice(0, 8),
        year,
        source_url: `https://osdr.nasa.gov/bio/repo/data/studies/${accession}`,
        abstract: description || null,
        key_findings: [],
        ...c,
        organism: organism || c.organism,
        mission: String(s["Flight Program"] ?? "").includes("International Space Station")
          ? "ISS"
          : c.mission,
      });
    }
    if (hits.length < 300) break;
  }
  return out;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  // Guard against repeated calls: one real sync every 6 hours is plenty.
  const url = new URL(req.url);
  if (url.searchParams.get("force") !== "1") {
    const { data: recent } = await supabase
      .from("sync_runs")
      .select("created_at")
      .eq("status", "success")
      .gte("created_at", new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString())
      .limit(1);
    if (recent && recent.length) {
      return new Response(JSON.stringify({ skipped: "synced recently" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  }

  const summary: Row[] = [];

  for (const [label, collector] of [
    ["NASA Space Biology (PMC)", collectPmc],
    ["NASA OSDR", collectOsdr],
  ] as const) {
    try {
      const collected = await collector();
      const seen = new Set<string>();
      const records = collected.filter((r) => {
        const key = r.external_id as string;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
      const { data: existing } = await supabase
        .from("publications")
        .select("external_id")
        .eq("source", label);
      const known = new Set((existing ?? []).map((r: Row) => r.external_id as string));
      const fresh = records.filter((r) => !known.has(r.external_id as string));

      for (let i = 0; i < records.length; i += 200) {
        const chunk = records.slice(i, i + 200);
        const { error } = await supabase
          .from("publications")
          .upsert(chunk, { onConflict: "external_id" });
        if (error) throw new Error(error.message);
      }

      await supabase.from("sync_runs").insert({
        source: label,
        status: "success",
        found: records.length,
        inserted: fresh.length,
      });
      summary.push({ source: label, found: records.length, added: fresh.length });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`Sync failed for ${label}: ${message}`);
      await supabase
        .from("sync_runs")
        .insert({ source: label, status: "error", message: message.slice(0, 500) });
      summary.push({ source: label, error: message });
    }
  }

  return new Response(JSON.stringify({ summary }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
