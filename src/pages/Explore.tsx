import { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, Grid3x3, Network, Loader2, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PublicationCard from "@/components/PublicationCard";
import KnowledgeGraph from "@/components/KnowledgeGraph";
import AskDialog from "@/components/AskDialog";
import { usePublications } from "@/hooks/usePublications";

const SUBJECTS = [
  "Flora & Fauna",
  "AI & Machine Learning",
  "Data Management",
  "Education",
  "Software",
  "Writing & Communications",
];
const MISSIONS = ["ISS", "Shuttle", "Apollo", "Ground / Analog", "Other"];
const IMPACTS = ["Moon", "Mars", "Earth"];
const PAGE_SIZE = 12;

const Explore = () => {
  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<"grid" | "graph">("grid");
  const [subject, setSubject] = useState("all");
  const [mission, setMission] = useState("all");
  const [impact, setImpact] = useState("all");
  const [year, setYear] = useState("all");
  const [sort, setSort] = useState<"recent" | "oldest" | "title">("recent");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const subjectParam = searchParams.get("subject");
    if (subjectParam) setSubject(subjectParam);
    const q = searchParams.get("q");
    if (q) {
      setSearchInput(q);
      setSearch(q);
    }
  }, [searchParams]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => setPage(1), [subject, mission, impact, year, sort]);

  const { data, isLoading, isError } = usePublications({
    search,
    subject,
    mission,
    impact,
    year,
    sort,
    page,
    pageSize: PAGE_SIZE,
  });

  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const years = useMemo(() => {
    const now = new Date().getFullYear();
    return Array.from({ length: 12 }, (_, i) => String(now - i));
  }, []);

  const activeFilters = [subject, mission, impact, year].filter((v) => v !== "all");

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="mb-3 text-4xl font-bold">Explore Publications</h1>
          <p className="text-muted-foreground">
            Live from NASA's Space Biology publication list and the Open Science Data Repository —
            refreshed automatically every day.
          </p>
        </div>

        <div className="glass-card mb-8 p-6">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search titles and abstracts: bone loss, Arabidopsis, radiation..."
                className="pl-10"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-6">
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Subject" />
                </SelectTrigger>
                <SelectContent className="z-50 bg-popover">
                  <SelectItem value="all">All Subjects</SelectItem>
                  {SUBJECTS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={mission} onValueChange={setMission}>
                <SelectTrigger>
                  <SelectValue placeholder="Mission" />
                </SelectTrigger>
                <SelectContent className="z-50 bg-popover">
                  <SelectItem value="all">All Missions</SelectItem>
                  {MISSIONS.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={impact} onValueChange={setImpact}>
                <SelectTrigger>
                  <SelectValue placeholder="Impact" />
                </SelectTrigger>
                <SelectContent className="z-50 bg-popover">
                  <SelectItem value="all">All Impact</SelectItem>
                  {IMPACTS.map((i) => (
                    <SelectItem key={i} value={i}>
                      {i} focus
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={year} onValueChange={setYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent className="z-50 max-h-72 bg-popover">
                  <SelectItem value="all">All Years</SelectItem>
                  {years.map((y) => (
                    <SelectItem key={y} value={y}>
                      {y}
                    </SelectItem>
                  ))}
                  <SelectItem value="older">Before 2015</SelectItem>
                </SelectContent>
              </Select>

              <div className="col-span-2 flex gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  className="flex-1"
                  aria-label="Grid view"
                >
                  <Grid3x3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "graph" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("graph")}
                  className="flex-1"
                  aria-label="Graph view"
                >
                  <Network className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {activeFilters.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                {activeFilters.map((f) => (
                  <Badge key={f} variant="secondary">
                    {f}
                  </Badge>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSubject("all");
                    setMission("all");
                    setImpact("all");
                    setYear("all");
                  }}
                >
                  Clear filters
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            {isLoading ? "Searching..." : `${total.toLocaleString()} publications found`}
          </p>
          <div className="flex items-center gap-2">
            <AskDialog initialQuestion={search}>
              <Button variant="outline" size="sm">
                <Sparkles className="mr-2 h-4 w-4" /> Ask the research
              </Button>
            </AskDialog>
            <Select value={sort} onValueChange={(v) => setSort(v as typeof sort)}>
              <SelectTrigger className="w-[170px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="z-50 bg-popover">
                <SelectItem value="recent">Newest first</SelectItem>
                <SelectItem value="oldest">Oldest first</SelectItem>
                <SelectItem value="title">Title A–Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {viewMode === "graph" ? (
          <div>
            <KnowledgeGraph />
            <div className="mt-6 flex justify-center">
              <Button onClick={() => setViewMode("grid")} variant="outline">
                Return to grid view
              </Button>
            </div>
          </div>
        ) : isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : isError ? (
          <p className="py-20 text-center text-muted-foreground">
            The publication library could not be loaded. Please refresh the page.
          </p>
        ) : total === 0 ? (
          <p className="py-20 text-center text-muted-foreground">
            No publications matched that search. Try a broader term.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {data!.rows.map((pub) => (
              <PublicationCard
                key={pub.id}
                id={pub.id}
                title={pub.title}
                summary={pub.abstract ?? "Abstract not available for this record."}
                year={pub.year ?? 0}
                authors={pub.authors}
                tags={pub.tags}
                source={pub.source}
              />
            ))}
          </div>
        )}

        {viewMode === "grid" && totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <Button variant="outline" disabled={page === 1} onClick={() => setPage(page - 1)}>
              Previous
            </Button>
            <span className="px-3 text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;
