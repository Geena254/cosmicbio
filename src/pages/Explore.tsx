import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Filter, Grid3x3, Network } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PublicationCard from "@/components/PublicationCard";
import KnowledgeGraph from "@/components/KnowledgeGraph";

const Explore = () => {
  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<"grid" | "graph">("grid");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");

  useEffect(() => {
    const subjectParam = searchParams.get("subject");
    if (subjectParam) {
      setSelectedSubject(subjectParam);
    }
  }, [searchParams]);

  const [selectedMission, setSelectedMission] = useState<string>("all");
  const [selectedImpact, setSelectedImpact] = useState<string>("all");

  // Mock data for demonstration
  const publications = [
    {
      id: "1",
      title: "Effects of Microgravity on Plant Cell Wall Development",
      summary: "This study investigates how microgravity conditions affect the formation and structure of plant cell walls during early growth stages. Results indicate significant alterations in cellulose synthesis and wall thickness.",
      year: 2023,
      authors: ["Smith, J.", "Johnson, M.", "Williams, K."],
      tags: ["Flora & Fauna", "Microgravity", "Cell Biology"],
      source: "NASA OSDR",
      mission: "ISS",
      impact: "Moon"
    },
    {
      id: "2",
      title: "Machine Learning Models for Predicting Astronaut Health Outcomes",
      summary: "Development of AI models to predict health risks for astronauts during long-duration missions based on biological markers and environmental data from ISS experiments.",
      year: 2024,
      authors: ["Chen, L.", "Rodriguez, A."],
      tags: ["AI & Machine Learning", "Health", "ISS"],
      source: "NASA Task Book",
      mission: "ISS",
      impact: "Mars"
    },
    {
      id: "3",
      title: "Radiation Effects on Caenorhabditis elegans Reproduction",
      summary: "Long-term study examining the impact of space radiation on the reproductive cycle of C. elegans, a model organism. Findings show adaptive responses to radiation stress.",
      year: 2022,
      authors: ["Brown, T.", "Davis, R.", "Martinez, E.", "Lee, S."],
      tags: ["Flora & Fauna", "Radiation", "Genetics"],
      source: "Life Sciences Library",
      mission: "ISS",
      impact: "Mars"
    },
    {
      id: "4",
      title: "Database Architecture for Bioscience Data Integration",
      summary: "Comprehensive framework for integrating diverse bioscience datasets from multiple NASA missions and ground-based experiments into a unified knowledge system.",
      year: 2023,
      authors: ["Anderson, P.", "White, J."],
      tags: ["Data Management", "Software", "Integration"],
      source: "NASA OSDR",
      mission: "Shuttle",
      impact: "Earth"
    },
    {
      id: "5",
      title: "Educational Outreach: Bringing Space Biology to Classrooms",
      summary: "Analysis of educational programs that use NASA space biology research to enhance STEM education in K-12 schools across the United States.",
      year: 2024,
      authors: ["Taylor, M."],
      tags: ["Education", "Outreach"],
      source: "Life Sciences Library",
      mission: "Apollo",
      impact: "Earth"
    },
    {
      id: "6",
      title: "Automated Image Analysis Tools for Cell Culture Studies",
      summary: "Development of computer vision and machine learning tools for automated analysis of cell cultures in microgravity experiments, reducing manual analysis time by 80%.",
      year: 2023,
      authors: ["Zhang, H.", "Kumar, R.", "O'Brien, K."],
      tags: ["AI & Machine Learning", "Software", "Imaging"],
      source: "NASA Task Book",
      mission: "ISS",
      impact: "Moon"
    }
  ];

  // Filter publications based on all criteria
  const filteredPublications = publications.filter(pub => {
    const subjectMatch = selectedSubject === "all" || pub.tags.some(tag => tag.includes(selectedSubject));
    const missionMatch = selectedMission === "all" || pub.mission === selectedMission;
    const impactMatch = selectedImpact === "all" || pub.impact === selectedImpact;
    return subjectMatch && missionMatch && impactMatch;
  });

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Explore Publications</h1>
          <p className="text-muted-foreground">
            Search and filter through 608 NASA bioscience publications with AI-powered insights
          </p>
        </div>

        {/* Search and Filters */}
        <div className="glass-card p-6 mb-8">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-12">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search by title, keywords, or topics..." 
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Subject" />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  <SelectItem value="all">All Subjects</SelectItem>
                  <SelectItem value="AI & Machine Learning">AI & ML</SelectItem>
                  <SelectItem value="Flora & Fauna">Flora & Fauna</SelectItem>
                  <SelectItem value="Data Management">Data Mgmt</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                  <SelectItem value="Software">Software</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedMission} onValueChange={setSelectedMission}>
                <SelectTrigger>
                  <SelectValue placeholder="Mission" />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  <SelectItem value="all">All Missions</SelectItem>
                  <SelectItem value="ISS">ISS</SelectItem>
                  <SelectItem value="Shuttle">Shuttle</SelectItem>
                  <SelectItem value="Apollo">Apollo</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedImpact} onValueChange={setSelectedImpact}>
                <SelectTrigger>
                  <SelectValue placeholder="Impact" />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  <SelectItem value="all">All Impact</SelectItem>
                  <SelectItem value="Moon">Moon Ready</SelectItem>
                  <SelectItem value="Mars">Mars Ready</SelectItem>
                  <SelectItem value="Earth">Earth Benefit</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  <SelectItem value="all">All Years</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                  <SelectItem value="older">Older</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="col-span-2 flex gap-2">
                <Button 
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  className="flex-1"
                >
                  <Grid3x3 className="h-4 w-4" />
                </Button>
                <Button 
                  variant={viewMode === "graph" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("graph")}
                  className="flex-1"
                >
                  <Network className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredPublications.length} of 608 publications
          </p>
          <Select defaultValue="relevance">
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Most Relevant</SelectItem>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="cited">Most Cited</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPublications.map((pub) => (
              <PublicationCard key={pub.id} {...pub} />
            ))}
          </div>
        ) : (
          <div>
            <KnowledgeGraph />
            <div className="mt-6 flex justify-center">
              <Button onClick={() => setViewMode("grid")} variant="outline">
                Return to Grid View
              </Button>
            </div>
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center items-center gap-2 mt-8">
          <Button variant="outline" disabled>Previous</Button>
          <Button variant="default">1</Button>
          <Button variant="outline">2</Button>
          <Button variant="outline">3</Button>
          <Button variant="outline">Next</Button>
        </div>
      </div>
    </div>
  );
};

export default Explore;
