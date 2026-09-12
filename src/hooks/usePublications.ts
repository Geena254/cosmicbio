import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Publication = {
  id: string;
  external_id: string;
  source: string;
  title: string;
  authors: string[];
  year: number | null;
  source_url: string | null;
  abstract: string | null;
  key_findings: string[];
  tags: string[];
  subject: string | null;
  mission: string | null;
  impact: string | null;
  organism: string | null;
  first_seen_at: string;
};

export type PublicationFilters = {
  search?: string;
  subject?: string;
  mission?: string;
  impact?: string;
  year?: string;
  sort?: "recent" | "oldest" | "title";
  page?: number;
  pageSize?: number;
};

export function usePublications(filters: PublicationFilters) {
  const {
    search = "",
    subject = "all",
    mission = "all",
    impact = "all",
    year = "all",
    sort = "recent",
    page = 1,
    pageSize = 12,
  } = filters;

  return useQuery({
    queryKey: ["publications", filters],
    queryFn: async () => {
      let query = supabase
        .from("publications")
        .select("*", { count: "exact" });

      if (search.trim()) {
        const term = search.trim().replace(/[%,]/g, " ");
        query = query.or(`title.ilike.%${term}%,abstract.ilike.%${term}%`);
      }
      if (subject !== "all") query = query.eq("subject", subject);
      if (mission !== "all") query = query.eq("mission", mission);
      if (impact !== "all") query = query.eq("impact", impact);
      if (year !== "all") {
        if (year === "older") query = query.lt("year", 2015);
        else query = query.eq("year", Number(year));
      }

      if (sort === "recent") query = query.order("year", { ascending: false, nullsFirst: false });
      else if (sort === "oldest") query = query.order("year", { ascending: true, nullsFirst: false });
      else query = query.order("title", { ascending: true });

      const from = (page - 1) * pageSize;
      query = query.range(from, from + pageSize - 1);

      const { data, error, count } = await query;
      if (error) throw error;
      return { rows: (data ?? []) as Publication[], total: count ?? 0 };
    },
  });
}

export function usePublication(id?: string) {
  return useQuery({
    queryKey: ["publication", id],
    enabled: Boolean(id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("publications")
        .select("*")
        .eq("id", id!)
        .maybeSingle();
      if (error) throw error;
      return data as Publication | null;
    },
  });
}

export function useLibraryStats() {
  return useQuery({
    queryKey: ["library-stats"],
    queryFn: async () => {
      const { count } = await supabase
        .from("publications")
        .select("*", { count: "exact", head: true });

      const { data: newest } = await supabase
        .from("publications")
        .select("id,title,year,source,tags,first_seen_at")
        .order("first_seen_at", { ascending: false })
        .limit(5);

      const { data: lastSync } = await supabase
        .from("sync_runs")
        .select("created_at,status,inserted,source")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      return { total: count ?? 0, newest: newest ?? [], lastSync };
    },
  });
}

/** A study of the day: stable for everyone for the whole day. */
export function useDailyStudy() {
  return useQuery({
    queryKey: ["daily-study", new Date().toISOString().slice(0, 10)],
    queryFn: async () => {
      const { count } = await supabase
        .from("publications")
        .select("*", { count: "exact", head: true })
        .not("abstract", "is", null);
      if (!count) return null;

      const day = Math.floor(Date.now() / 86_400_000);
      const offset = day % count;

      const { data } = await supabase
        .from("publications")
        .select("*")
        .not("abstract", "is", null)
        .order("external_id", { ascending: true })
        .range(offset, offset);

      return (data?.[0] as Publication) ?? null;
    },
  });
}
