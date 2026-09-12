import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Rss, Copy, Check, Calendar, ExternalLink, BellRing } from "lucide-react";
import { toast } from "sonner";

const TOPICS = [
  "Flora & Fauna",
  "Plant Growth",
  "Plants",
  "Arabidopsis",
  "Microgravity",
  "Radiation",
  "Bone Loss",
  "Muscle",
  "Immunology",
  "Microbiome",
  "Genomics",
  "Neuroscience",
  "Cardiovascular",
  "Nutrition",
  "Human",
  "Mouse",
  "Bacteria",
  "Cell Biology",
  "Stress Tolerance",
  "AI & Machine Learning",
  "Data Management",
  "Software",
];

const STORAGE_KEY = "nbe:followed-topics";

interface Row {
  id: string;
  title: string;
  abstract: string | null;
  source: string;
  source_url: string | null;
  year: number | null;
  tags: string[];
  first_seen_at: string;
}

const FEED_BASE = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/feed`;

const WhatsNew = () => {
  const [followed, setFollowed] = useState<string[]>([]);
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setFollowed(JSON.parse(saved));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      let query = supabase
        .from("publications")
        .select("id,title,abstract,source,source_url,year,tags,first_seen_at")
        .order("first_seen_at", { ascending: false })
        .limit(60);

      if (followed.length) query = query.overlaps("tags", followed);

      const { data, error } = await query;
      if (cancelled) return;
      if (error) toast.error("Could not load the latest studies.");
      setRows((data as Row[]) ?? []);
      setLoading(false);
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [followed]);

  const toggle = (topic: string) => {
    setFollowed((prev) => {
      const next = prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  const feedUrl = useMemo(() => {
    const site = typeof window !== "undefined" ? window.location.origin : "";
    const params = new URLSearchParams();
    if (followed.length) params.set("topics", followed.join(","));
    if (site) params.set("site", site);
    const qs = params.toString();
    return qs ? `${FEED_BASE}?${qs}` : FEED_BASE;
  }, [followed]);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) => r.title.toLowerCase().includes(q) || (r.abstract ?? "").toLowerCase().includes(q),
    );
  }, [rows, search]);

  const copyFeed = async () => {
    try {
      await navigator.clipboard.writeText(feedUrl);
      setCopied(true);
      toast.success("Feed link copied — paste it into your reader.");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Copy failed — select the link and copy it manually.");
    }
  };

  const filteredTopics = TOPICS;

  return (
    <div className="container mx-auto px-4 py-10">
      <header className="mb-8 max-w-3xl">
        <div className="mb-3 flex items-center gap-2 text-primary">
          <BellRing className="h-5 w-5" />
          <span className="text-sm font-semibold uppercase tracking-wider">What's new</span>
        </div>
        <h1 className="mb-3 text-3xl font-bold md:text-4xl">
          Follow the topics you care about
        </h1>
        <p className="text-muted-foreground">
          Pick a few topics and this page keeps showing the newest studies that match. Nothing to
          sign up for — your choices stay on this device. Want it in your own reader? Grab the feed
          link below.
        </p>
      </header>

      <Card className="glass-card mb-8 p-6">
        <h2 className="mb-4 text-lg font-semibold">Your topics</h2>
        <div className="flex flex-wrap gap-2">
          {filteredTopics.map((topic) => {
            const active = followed.includes(topic);
            return (
              <button
                key={topic}
                type="button"
                onClick={() => toggle(topic)}
                aria-pressed={active}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-sm transition-colors",
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground",
                )}
              >
                {topic}
              </button>
            );
          })}
        </div>
        {followed.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="mt-4"
            onClick={() => {
              setFollowed([]);
              localStorage.removeItem(STORAGE_KEY);
            }}
          >
            Clear all
          </Button>
        )}
      </Card>

      <Card className="glass-card mb-8 flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <Rss className="mt-1 h-5 w-5 text-secondary" />
          <div>
            <h2 className="font-semibold">Subscribe in your reader</h2>
            <p className="text-sm text-muted-foreground">
              Works with Feedly, Inoreader, NetNewsWire and any RSS app.
              {followed.length > 0 && " This link is filtered to your topics."}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={copyFeed}>
            {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
            Copy feed link
          </Button>
          <Button asChild>
            <a href={feedUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              Open feed
            </a>
          </Button>
        </div>
      </Card>

      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h2 className="text-xl font-semibold">
          {followed.length ? "Latest in your topics" : "Latest studies"}
          <span className="ml-2 text-sm font-normal text-muted-foreground">
            {loading ? "" : `${visible.length} shown`}
          </span>
        </h2>
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter these results…"
          className="md:w-72"
        />
      </div>

      {loading ? (
        <div className="grid gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-lg" />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <Card className="glass-card p-10 text-center text-muted-foreground">
          Nothing matches yet. Try fewer topics or a different search.
        </Card>
      ) : (
        <div className="grid gap-4">
          {visible.map((row) => (
            <Card key={row.id} className="glass-card hover-lift p-6">
              <div className="mb-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  Added {new Date(row.first_seen_at).toLocaleDateString()}
                </span>
                <Badge variant="outline">{row.source}</Badge>
                {row.year && <span>{row.year}</span>}
              </div>
              <Link to={`/publication/${row.id}`}>
                <h3 className="mb-2 text-lg font-semibold transition-colors hover:text-primary">
                  {row.title}
                </h3>
              </Link>
              {row.abstract && (
                <p className="mb-3 line-clamp-3 text-sm text-muted-foreground">{row.abstract}</p>
              )}
              <div className="flex flex-wrap gap-2">
                {row.tags.slice(0, 5).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default WhatsNew;
