import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  ExternalLink,
  Calendar,
  Users,
  Sprout,
  Loader2,
} from "lucide-react";
import AdviceOutput from "@/components/AdviceOutput";
import DownloadReportButton from "@/components/DownloadReportButton";
import { askAdvisor } from "@/lib/advisor";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import KnowledgeGraph from "@/components/KnowledgeGraph";
import { toast } from "sonner";
import { usePublication, usePublications } from "@/hooks/usePublications";

const PublicationDetail = () => {
  const { id } = useParams();
  const [earthLoading, setEarthLoading] = useState(false);
  const [earthText, setEarthText] = useState("");
  const { data: publication, isLoading } = usePublication(id);

  const firstTag = publication?.tags?.[0];
  const { data: relatedData } = usePublications({
    search: firstTag ?? "",
    subject: publication?.subject ?? "all",
    pageSize: 6,
  });
  const related = (relatedData?.rows ?? []).filter((r) => r.id !== id).slice(0, 5);

  useEffect(() => {
    setEarthText("");
  }, [id]);

  const exportCitation = () => {
    if (!publication) return;
    const authors = publication.authors?.join(", ") || "NASA Space Biology";
    const citation = `${authors} (${publication.year ?? "n.d."}). ${publication.title}. ${publication.source}. ${publication.source_url ?? ""}`.trim();
    navigator.clipboard.writeText(citation);
    toast.success("Citation copied to your clipboard");
  };

  const loadEarthApplication = async () => {
    if (!publication) return;
    setEarthLoading(true);
    setEarthText("");
    try {
      const text = await askAdvisor("earth-application", {
        title: publication.title,
        abstract: publication.abstract ?? "",
        findings: publication.key_findings ?? [],
      });
      setEarthText(text);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setEarthLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!publication) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="mb-4 text-3xl font-bold">Study not found</h1>
        <Link to="/explore">
          <Button>Back to Explore</Button>
        </Link>
      </div>
    );
  }

  const findings = publication.key_findings ?? [];

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto max-w-5xl px-4">
        <Link to="/explore">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Explore
          </Button>
        </Link>

        <div className="glass-card mb-6 p-8">
          <div className="mb-4 flex flex-wrap gap-2">
            {publication.tags?.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>

          <h1 className="mb-4 text-4xl font-bold">{publication.title}</h1>

          <div className="mb-6 flex flex-wrap gap-6 text-sm text-muted-foreground">
            {publication.year && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{publication.year}</span>
              </div>
            )}
            {publication.authors?.length > 0 && (
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="line-clamp-1 max-w-xl">
                  {publication.authors.slice(0, 6).join(", ")}
                  {publication.authors.length > 6 ? " et al." : ""}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              <span>{publication.source}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            {publication.source_url && (
              <a href={publication.source_url} target="_blank" rel="noreferrer">
                <Button className="cosmic-glow">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Read the full study
                </Button>
              </a>
            )}
            <Button variant="outline" onClick={exportCitation}>
              <Download className="mr-2 h-4 w-4" />
              Copy citation
            </Button>
            <DownloadReportButton
              label="Download summary PDF"
              kicker={publication.source}
              title={publication.title}
              fileName={`study-${publication.external_id}`}
              facts={[
                { label: "Year", value: String(publication.year ?? "Unknown") },
                { label: "Subject", value: publication.subject ?? "Unclassified" },
                { label: "Mission", value: publication.mission ?? "Not stated" },
              ]}
              body={`${publication.abstract ?? "No abstract available."}\n\n${findings
                .map((f) => `- ${f}`)
                .join("\n")}`}
            />
          </div>
        </div>

        <Tabs defaultValue="summary" className="space-y-6">
          <TabsList className="glass-card">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="impact">Mission Impact</TabsTrigger>
            <TabsTrigger value="related">Related Studies</TabsTrigger>
            <TabsTrigger value="earth">Earth Applications</TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="space-y-6">
            <Card className="glass-card p-6">
              <h2 className="mb-4 text-2xl font-semibold">Abstract</h2>
              <p className="leading-relaxed text-muted-foreground">
                {publication.abstract ??
                  "No abstract is published for this record. Use the link above to read the original study."}
              </p>
            </Card>

            {findings.length > 0 && (
              <Card className="glass-card p-6">
                <h2 className="mb-4 text-2xl font-semibold">Key Points</h2>
                <ul className="space-y-3">
                  {findings.map((finding, index) => (
                    <li key={index} className="flex gap-3">
                      <span className="font-bold text-primary">{index + 1}.</span>
                      <span className="text-muted-foreground">{finding}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="impact" className="space-y-6">
            <Card className="glass-card p-6">
              <h2 className="mb-4 text-2xl font-semibold">Where this matters</h2>
              <div className="mb-6 flex flex-wrap gap-2">
                <Badge>{publication.impact ? `${publication.impact} focus` : "General"}</Badge>
                {publication.mission && <Badge variant="secondary">{publication.mission}</Badge>}
                {publication.organism && <Badge variant="outline">{publication.organism}</Badge>}
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-primary/20 bg-primary/10 p-4">
                  <h3 className="mb-2 font-semibold">Lunar and Mars habitats</h3>
                  <p className="text-sm text-muted-foreground">
                    Findings like these shape how crews will grow food, protect their health and
                    keep habitats alive far from Earth.
                  </p>
                </div>
                <div className="rounded-lg border border-accent/20 bg-accent/10 p-4">
                  <h3 className="mb-2 font-semibold">Back on Earth</h3>
                  <p className="text-sm text-muted-foreground">
                    Open the Earth Applications tab to turn this study into practical farming steps.
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="related" className="space-y-6">
            <KnowledgeGraph />

            <Card className="glass-card p-6">
              <h2 className="mb-4 text-2xl font-semibold">Related Publications</h2>
              <div className="space-y-4">
                {related.length === 0 && (
                  <p className="text-sm text-muted-foreground">No related studies found yet.</p>
                )}
                {related.map((r) => (
                  <Link
                    key={r.id}
                    to={`/publication/${r.id}`}
                    className="flex items-center justify-between rounded-lg bg-secondary/50 p-4 transition-colors hover:bg-secondary"
                  >
                    <div>
                      <h3 className="font-medium">{r.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {r.source} {r.year ? `· ${r.year}` : ""}
                      </p>
                    </div>
                    <span className="text-sm text-primary">View</span>
                  </Link>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="earth" className="space-y-6">
            <Card className="glass-card p-6">
              <h2 className="mb-2 text-2xl font-semibold">What this means for farming on Earth</h2>
              <p className="mb-4 text-muted-foreground">
                Translate this study into practical guidance for farmers, with a focus on Kenya.
              </p>
              <Button className="cosmic-glow" disabled={earthLoading} onClick={loadEarthApplication}>
                {earthLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Working it out
                  </>
                ) : (
                  <>
                    <Sprout className="mr-2 h-4 w-4" /> Show farming applications
                  </>
                )}
              </Button>
              {earthText && (
                <div className="mt-6 space-y-4">
                  <DownloadReportButton
                    kicker="Earth applications report"
                    title={publication.title}
                    fileName={`earth-applications-${publication.external_id}`}
                    facts={[
                      { label: "Source", value: publication.source },
                      { label: "Year", value: String(publication.year ?? "Unknown") },
                    ]}
                    body={earthText}
                  />
                  <AdviceOutput text={earthText} />
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PublicationDetail;
