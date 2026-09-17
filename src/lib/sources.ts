import type { Publication } from "@/hooks/usePublications";

export type SourceDoc = {
  label: string;
  detail: string;
  url: string;
  kind: "pdf" | "record" | "data" | "search";
};

const pmcNumber = (p: Pick<Publication, "external_id" | "source_url">) =>
  p.external_id?.match(/PMC(\d+)/)?.[1] ?? p.source_url?.match(/PMC(\d+)/)?.[1];

const osdrAccession = (p: Pick<Publication, "external_id" | "source">) =>
  p.source?.toLowerCase().includes("osdr") ? p.external_id : undefined;

/** The best link to the real document behind a record. */
export function primarySourceUrl(p: Pick<Publication, "external_id" | "source" | "source_url">) {
  const pmc = pmcNumber(p);
  if (pmc) return `https://pmc.ncbi.nlm.nih.gov/articles/PMC${pmc}/`;
  const osd = osdrAccession(p);
  if (osd) return `https://osdr.nasa.gov/bio/repo/data/studies/${osd}`;
  return p.source_url ?? undefined;
}

/**
 * Real, published documents for a study — NASA OSDR records, PubMed Central
 * PDFs and the NASA libraries. Nothing here is generated text.
 */
export function officialDocuments(p: Publication): SourceDoc[] {
  const docs: SourceDoc[] = [];
  const pmc = pmcNumber(p);
  const osd = osdrAccession(p);

  if (pmc) {
    docs.push({
      kind: "record",
      label: "Full paper on PubMed Central",
      detail: "The published article from NASA's Space Biology reading list.",
      url: `https://pmc.ncbi.nlm.nih.gov/articles/PMC${pmc}/`,
    });
    docs.push({
      kind: "pdf",
      label: "Official PDF of the paper",
      detail: "The publisher's own PDF, archived by PubMed Central.",
      url: `https://pmc.ncbi.nlm.nih.gov/articles/PMC${pmc}/pdf/`,
    });
  }

  if (osd) {
    docs.push({
      kind: "record",
      label: "NASA OSDR study record",
      detail: `Open Science Data Repository record ${osd}, with protocols and assays.`,
      url: `https://osdr.nasa.gov/bio/repo/data/studies/${osd}`,
    });
    docs.push({
      kind: "data",
      label: "OSDR data files",
      detail: "Raw and processed data files released by NASA for this study.",
      url: `https://osdr.nasa.gov/bio/repo/data/studies/${osd}/download`,
    });
  }

  if (p.source_url && !docs.some((d) => d.url === p.source_url)) {
    docs.push({
      kind: "record",
      label: "Original source record",
      detail: "The record this entry was collected from.",
      url: p.source_url,
    });
  }

  const query = encodeURIComponent(p.title.slice(0, 150));
  docs.push({
    kind: "search",
    label: "NASA Technical Reports Server",
    detail: "NASA's own reports and PDFs matching this study's title.",
    url: `https://ntrs.nasa.gov/search?q=${query}`,
  });
  docs.push({
    kind: "search",
    label: "Space Life Sciences Library",
    detail: "NASA's life sciences library of experiment reports and results.",
    url: "https://extapps.ksc.nasa.gov/slsl/",
  });
  docs.push({
    kind: "search",
    label: "NASA Task Book",
    detail: "The funded research project and its annual progress reports.",
    url: "https://taskbook.nasaprs.com/tbp/index.cfm",
  });

  return docs;
}

/** Plain-text citation for a study. */
export function citationFor(p: Publication) {
  const authors = p.authors?.length ? p.authors.join(", ") : "NASA Space Biology";
  return `${authors} (${p.year ?? "n.d."}). ${p.title}. ${p.source}. ${
    primarySourceUrl(p) ?? ""
  }`.trim();
}
