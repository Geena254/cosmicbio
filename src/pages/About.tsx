import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Database, BookOpen, FileText, Rocket } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Rocket className="h-12 w-12 text-primary" />
            <h1 className="text-4xl font-bold">About NASA Bioscience Knowledge Explorer</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            A comprehensive platform for exploring NASA's bioscience research data and AI-powered insights
          </p>
        </div>

        {/* Mission Statement */}
        <Card className="glass-card p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Mission</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            The NASA Bioscience Knowledge Explorer was created to enable a new era of human space exploration
            by making NASA's bioscience research easily searchable, understandable, and actionable. Our platform
            aggregates over 680 publications from multiple NASA databases, providing AI-generated summaries and
            insights that help scientists, mission planners, and researchers identify knowledge gaps and opportunities
            for lunar and Mars missions.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            By synthesizing decades of space biology research, we're helping to answer critical questions about
            how living organisms adapt to space environments, informing the design of life support systems, and
            enabling sustainable human presence beyond Earth.
          </p>
        </Card>

        {/* Data Sources */}
        <Card className="glass-card p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-6">Data Sources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-primary">
                <Database className="h-5 w-5" />
                <h3 className="font-semibold">NASA OSDR</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Open Science Data Repository - primary source for space biology experiments and datasets
              </p>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <a href="https://osdr.nasa.gov" target="_blank" rel="noopener noreferrer">
                  Visit OSDR <ExternalLink className="h-3 w-3 ml-2" />
                </a>
              </Button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-primary">
                <BookOpen className="h-5 w-5" />
                <h3 className="font-semibold">Life Sciences Library</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Comprehensive collection of published research papers and technical reports
              </p>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <a href="https://lsda.jsc.nasa.gov" target="_blank" rel="noopener noreferrer">
                  Visit Library <ExternalLink className="h-3 w-3 ml-2" />
                </a>
              </Button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-primary">
                <FileText className="h-5 w-5" />
                <h3 className="font-semibold">NASA Task Book</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Active and completed research projects funded by NASA's Human Research Program
              </p>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <a href="https://taskbook.nasaprs.com" target="_blank" rel="noopener noreferrer">
                  Visit Task Book <ExternalLink className="h-3 w-3 ml-2" />
                </a>
              </Button>
            </div>
          </div>
        </Card>

        {/* Challenge Background */}
        <Card className="glass-card p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4">NASA Challenge Background</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            As NASA prepares for sustained lunar operations through the Artemis program and eventual crewed
            missions to Mars, understanding how biological systems respond to space environments becomes
            increasingly critical. However, the wealth of research data is distributed across multiple
            repositories and formats, making it difficult to:
          </p>
          <ul className="space-y-2 text-muted-foreground mb-4">
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>Identify relevant studies for specific mission scenarios</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>Recognize patterns and consensus across multiple experiments</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>Discover knowledge gaps that require further research</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>Connect findings across different organisms and mission types</span>
            </li>
          </ul>
          <p className="text-muted-foreground leading-relaxed">
            This Knowledge Explorer addresses these challenges by providing intelligent search, automated
            summarization, and visual knowledge graphs that reveal relationships between studies.
          </p>
        </Card>

        {/* Features */}
        <Card className="glass-card p-8">
          <h2 className="text-2xl font-semibold mb-6">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "AI-Powered Summaries",
                description: "Automatically generated summaries highlight key findings and implications for space missions"
              },
              {
                title: "Advanced Filtering",
                description: "Filter by mission type, organism, research subject, and mission readiness impact"
              },
              {
                title: "Knowledge Graphs",
                description: "Visual representations of relationships between studies, organisms, and findings"
              },
              {
                title: "Trend Analysis",
                description: "Identify research patterns, emerging topics, and areas requiring further investigation"
              },
              {
                title: "Impact Metrics",
                description: "Understand which research contributes to Moon, Mars, or Earth-based applications"
              },
              {
                title: "Collaborative Tools",
                description: "Export citations, download summaries, and share findings with your team"
              }
            ].map((feature, index) => (
              <div key={index} className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default About;
