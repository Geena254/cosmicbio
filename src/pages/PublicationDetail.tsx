import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Download, ExternalLink, Calendar, Users, FileDown, Sprout, Loader2 } from "lucide-react";
import AdviceOutput from "@/components/AdviceOutput";
import { askAdvisor } from "@/lib/advisor";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import KnowledgeGraph from "@/components/KnowledgeGraph";
import { toast } from "sonner";

const PublicationDetail = () => {
  const { id } = useParams();
  const [earthLoading, setEarthLoading] = useState(false);
  const [earthText, setEarthText] = useState("");

  const handleDownloadPDF = () => {
    toast.success("PDF download started");
    // In real implementation, would trigger actual PDF download
  };

  // Mock data - would come from API in real implementation
  const publication = {
    id: id,
    title: "Effects of Microgravity on Plant Cell Wall Development",
    authors: ["Smith, J.", "Johnson, M.", "Williams, K."],
    year: 2023,
    source: "NASA OSDR",
    tags: ["Flora & Fauna", "Microgravity", "Cell Biology"],
    abstract: "This comprehensive study investigates how microgravity conditions affect the formation and structure of plant cell walls during early growth stages. We conducted experiments aboard the International Space Station over a 90-day period, comparing Arabidopsis thaliana specimens grown in microgravity with ground control samples.",
    keyFindings: [
      "Cellulose synthesis rates decreased by 32% in microgravity conditions",
      "Cell wall thickness showed significant variations (mean difference of 15%)",
      "Gene expression patterns related to wall formation were altered",
      "Recovery mechanisms were observed when plants adapted to microgravity"
    ],
    impact: "This research provides crucial insights for developing sustainable plant growth systems for long-duration space missions. Understanding cell wall development in microgravity is essential for food production on Moon and Mars bases."
  };

  const loadEarthApplication = async () => {
    setEarthLoading(true);
    setEarthText("");
    try {
      const text = await askAdvisor("earth-application", {
        title: publication.title,
        abstract: publication.abstract,
        findings: publication.keyFindings,
      });
      setEarthText(text);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setEarthLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Back button */}
        <Link to="/explore">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Explore
          </Button>
        </Link>

        {/* Header */}
        <div className="glass-card p-8 mb-6">
          <div className="flex flex-wrap gap-2 mb-4">
            {publication.tags.map((tag, index) => (
              <Badge key={index} variant="secondary">{tag}</Badge>
            ))}
          </div>
          
          <h1 className="text-4xl font-bold mb-4">{publication.title}</h1>
          
          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{publication.year}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>{publication.authors.join(", ")}</span>
            </div>
            <div className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              <span>{publication.source}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <Button className="cosmic-glow">
              <ExternalLink className="h-4 w-4 mr-2" />
              View on NASA OSDR
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Citation
            </Button>
            <Button variant="outline" onClick={handleDownloadPDF}>
              <FileDown className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>

        {/* Tabbed Content */}
        <Tabs defaultValue="summary" className="space-y-6">
          <TabsList className="glass-card">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="impact">Mission Impact</TabsTrigger>
            <TabsTrigger value="related">Related Studies</TabsTrigger>
            <TabsTrigger value="earth">Earth Applications</TabsTrigger>
          </TabsList>

          <TabsContent value="earth" className="space-y-6">
            <Card className="glass-card p-6">
              <h2 className="text-2xl font-semibold mb-2">What this means for farming on Earth</h2>
              <p className="text-muted-foreground mb-4">
                Translate this study into practical guidance for farmers, with a focus on Kenya.
              </p>
              <Button
                className="cosmic-glow"
                disabled={earthLoading}
                onClick={loadEarthApplication}
              >
                {earthLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Working it out
                  </>
                ) : (
                  <>
                    <Sprout className="h-4 w-4 mr-2" /> Show farming applications
                  </>
                )}
              </Button>
              {earthText && (
                <div className="mt-6">
                  <AdviceOutput text={earthText} />
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="summary" className="space-y-6">
            <Card className="glass-card p-6">
              <h2 className="text-2xl font-semibold mb-4">Abstract</h2>
              <p className="text-muted-foreground leading-relaxed">
                {publication.abstract}
              </p>
            </Card>

            <Card className="glass-card p-6">
              <h2 className="text-2xl font-semibold mb-4">Key Findings</h2>
              <ul className="space-y-3">
                {publication.keyFindings.map((finding, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="text-primary font-bold">{index + 1}.</span>
                    <span className="text-muted-foreground">{finding}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </TabsContent>

          <TabsContent value="impact" className="space-y-6">
            <Card className="glass-card p-6">
              <h2 className="text-2xl font-semibold mb-4">Impact on Human Spaceflight</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {publication.impact}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <h3 className="font-semibold mb-2">🌙 Lunar Applications</h3>
                  <p className="text-sm text-muted-foreground">
                    Essential for developing plant growth systems in lunar habitats
                  </p>
                </div>
                <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
                  <h3 className="font-semibold mb-2">🔴 Mars Missions</h3>
                  <p className="text-sm text-muted-foreground">
                    Critical insights for sustainable food production on Mars
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="related" className="space-y-6">
            <KnowledgeGraph />
            
            <Card className="glass-card p-6">
              <h2 className="text-2xl font-semibold mb-4">Related Publications</h2>
              <div className="space-y-4">
                {[
                  { title: "Microgravity Effects on Arabidopsis Gene Expression", similarity: 87 },
                  { title: "Plant Growth Systems for Lunar Habitats", similarity: 74 },
                  { title: "Cell Wall Adaptation in Space Environments", similarity: 69 },
                ].map((related, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                    <div>
                      <h3 className="font-medium">{related.title}</h3>
                      <p className="text-sm text-muted-foreground">Similarity: {related.similarity}%</p>
                    </div>
                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PublicationDetail;
