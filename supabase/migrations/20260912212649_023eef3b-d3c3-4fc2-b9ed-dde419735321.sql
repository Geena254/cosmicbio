CREATE TABLE public.publications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  external_id TEXT NOT NULL UNIQUE,
  source TEXT NOT NULL,
  title TEXT NOT NULL,
  authors TEXT[] NOT NULL DEFAULT '{}',
  year INTEGER,
  source_url TEXT,
  abstract TEXT,
  key_findings TEXT[] NOT NULL DEFAULT '{}',
  tags TEXT[] NOT NULL DEFAULT '{}',
  subject TEXT,
  mission TEXT,
  impact TEXT,
  organism TEXT,
  first_seen_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX publications_first_seen_idx ON public.publications (first_seen_at DESC);
CREATE INDEX publications_year_idx ON public.publications (year);

GRANT SELECT ON public.publications TO anon;
GRANT SELECT ON public.publications TO authenticated;
GRANT ALL ON public.publications TO service_role;

ALTER TABLE public.publications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Publications are publicly readable"
ON public.publications FOR SELECT
USING (true);

CREATE TABLE public.sync_runs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source TEXT NOT NULL,
  status TEXT NOT NULL,
  found INTEGER NOT NULL DEFAULT 0,
  inserted INTEGER NOT NULL DEFAULT 0,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT ON public.sync_runs TO anon;
GRANT SELECT ON public.sync_runs TO authenticated;
GRANT ALL ON public.sync_runs TO service_role;

ALTER TABLE public.sync_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sync runs are publicly readable"
ON public.sync_runs FOR SELECT
USING (true);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_publications_updated_at
BEFORE UPDATE ON public.publications
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();