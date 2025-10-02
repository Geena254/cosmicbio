import { Brain, Leaf, Database, BookOpen, Code, MessageSquare } from "lucide-react";
import { FileText, Calendar, TrendingUp, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SubjectCard from "@/components/SubjectCard";
import MetricCard from "@/components/MetricCard";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-space.jpg";

const Home = () => {
  const subjects = [
    {
      title: "AI & Machine Learning",
      description: "Explore AI applications in space bioscience research",
      icon: Brain,
      count: 87,
      color: "bg-primary"
    },
    {
      title: "Flora & Fauna",
      description: "Studies on plants and animals in space environments",
      icon: Leaf,
      count: 243,
      color: "bg-accent"
    },
    {
      title: "Data Management",
      description: "Data systems and infrastructure for bioscience",
      icon: Database,
      count: 124,
      color: "bg-cosmic-glow"
    },
    {
      title: "Education",
      description: "Educational resources and outreach programs",
      icon: BookOpen,
      count: 56,
      color: "bg-nebula-purple"
    },
    {
      title: "Software",
      description: "Tools and software for space biology research",
      icon: Code,
      count: 68,
      color: "bg-primary"
    },
    {
      title: "Communications",
      description: "Writing and communications in bioscience",
      icon: MessageSquare,
      count: 30,
      color: "bg-accent"
    }
  ];

  const metrics = [
    { title: "Total Publications", value: "608", icon: FileText, trend: "Across 40+ years" },
    { title: "Research Timespan", value: "1980-2025", icon: Calendar },
    { title: "Active Research Areas", value: "6", icon: TrendingUp },
    { title: "Knowledge Gaps Identified", value: "23", icon: Target, trend: "Opportunities for research" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative h-[600px] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/60 to-background" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            <span className="text-gradient">NASA Bioscience</span>
            <br />
            <span className="text-foreground">Knowledge Explorer</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 animate-fade-in">
            Explore 608 publications spanning decades of biology experiments in space.
            Discover insights, connections, and the future of life sciences in exploration.
          </p>
          <div className="flex gap-4 justify-center items-center max-w-2xl mx-auto animate-fade-in">
            <Input 
              placeholder="Search publications, topics, organisms..." 
              className="glass-card border-white/20 h-12"
            />
            <Link to="/explore">
              <Button size="lg" className="cosmic-glow h-12 px-8">
                Explore
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>
      </section>

      {/* Subject Categories */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Explore by Subject</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Dive into specialized areas of NASA bioscience research. Each category represents
            years of scientific discovery and innovation.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject, index) => (
            <SubjectCard key={index} {...subject} />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="glass-card p-12 text-center cosmic-glow">
          <h2 className="text-3xl font-bold mb-4">Ready to Discover?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Start exploring NASA's bioscience research database with AI-powered summaries
            and interactive knowledge graphs.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/explore">
              <Button size="lg" variant="default">
                Start Exploring
              </Button>
            </Link>
            <Link to="/insights">
              <Button size="lg" variant="outline">
                View Insights
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
