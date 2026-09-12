import { useState } from "react";
import {
  Brain,
  Leaf,
  Database,
  BookOpen,
  Code,
  MessageSquare,
  FileText,
  Calendar,
  TrendingUp,
  Target,
  Search,
  Sparkles,
  BookOpenCheck,
  RefreshCw,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SubjectCard from "@/components/SubjectCard";
import MetricCard from "@/components/MetricCard";
import { Link, useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-space.jpg";
import { useDailyStudy, useLibraryStats, useSubjectCounts } from "@/hooks/usePublications";

const SUBJECT_META = [
  {
    title: "Flora & Fauna",
    description: "Studies on plants and animals in space environments",
    icon: Leaf,
    color: "bg-accent",
  },
  {
    title: "AI & Machine Learning",
    description: "Explore AI applications in space bioscience research",
    icon: Brain,
    color: "bg-primary",
  },
  {
    title: "Data Management",
    description: "Data systems and infrastructure for bioscience",
    icon: Database,
    color: "bg-cosmic-glow",
  },
  {
    title: "Education",
    description: "Educational resources and outreach programs",
    icon: BookOpen,
    color: "bg-nebula-purple",
  },
  {
    title: "Software",
    description: "Tools and software for space biology research",
    icon: Code,
    color: "bg-primary",
  },
  {
    title: "Writing & Communications",
    description: "Writing and communications in bioscience",
    icon: MessageSquare,
    color: "bg-accent",
  },
];

const Home = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const { data: stats } = useLibraryStats();
  const { data: daily } = useDailyStudy();
  const { data: counts } = useSubjectCounts(SUBJECT_META.map((s) => s.title));

  const total = stats?.total ?? 0;
  const lastSync = stats?.lastSync?.created_at
    ? new Date(stats.lastSync.created_at).toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  const metrics = [
    {
      title: "Publications in library",
      value: total ? total.toLocaleString() : "—",
      icon: FileText,
      trend: "Live from NASA sources",
    },
    { title: "Research timespan", value: "1980–2025", icon: Calendar },
    { title: "Research areas", value: String(SUBJECT_META.length), icon: TrendingUp },
    {
      title: "Last refreshed",
      value: lastSync ?? "—",
      icon: RefreshCw,
      trend: "Checked automatically every day",
    },
  ];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/explore?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="min-h-screen">
      <section
        className="relative flex h-[600px] items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-background/60" />
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
          <h1 className="mb-6 animate-fade-in text-5xl font-bold text-foreground md:text-7xl">
            NASA Bioscience Knowledge Explorer
          </h1>
          <p className="mb-8 animate-fade-in text-xl text-muted-foreground">
            {total ? total.toLocaleString() : "Hundreds of"} publications spanning decades of biology
            experiments in space — searchable, explained in plain language, and updated automatically.
          </p>
          <form
            onSubmit={submit}
            className="mx-auto flex max-w-2xl animate-fade-in items-center justify-center gap-4"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search publications, topics, organisms..."
                className="glass-card h-12 border-white/20 pl-10"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <Button type="submit" size="lg" className="cosmic-glow h-12 px-8">
              Explore
            </Button>
          </form>
          <div className="mt-4 flex animate-fade-in flex-wrap justify-center gap-3">
            <Link to="/ask">
              <Button variant="outline" size="sm">
                <Sparkles className="mr-2 h-4 w-4" /> Ask the research
              </Button>
            </Link>
            <Link to="/story">
              <Button variant="outline" size="sm">
                <BookOpenCheck className="mr-2 h-4 w-4" /> Take the 5-minute tour
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>
      </section>

      {/* Today's study + what's new */}
      <section className="container mx-auto grid grid-cols-1 gap-6 px-4 pb-4 lg:grid-cols-3">
        <Card className="glass-card p-8 lg:col-span-2">
          <Badge variant="secondary" className="mb-3">
            Study of the day
          </Badge>
          {daily ? (
            <>
              <h2 className="mb-3 text-2xl font-bold">{daily.title}</h2>
              <p className="mb-4 line-clamp-4 text-muted-foreground">{daily.abstract}</p>
              <div className="mb-6 flex flex-wrap gap-2">
                {daily.tags?.slice(0, 4).map((t) => (
                  <Badge key={t} variant="outline">
                    {t}
                  </Badge>
                ))}
              </div>
              <Link to={`/publication/${daily.id}`}>
                <Button className="cosmic-glow">
                  Read this study <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </>
          ) : (
            <p className="text-muted-foreground">Loading today's pick...</p>
          )}
        </Card>

        <Card className="glass-card p-8">
          <h2 className="mb-1 text-xl font-bold">Newly added</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Fresh from the NASA sources{lastSync ? ` · ${lastSync}` : ""}
          </p>
          <div className="space-y-3">
            {(stats?.newest ?? []).map((n) => (
              <Link
                key={n.id}
                to={`/publication/${n.id}`}
                className="block rounded-lg bg-secondary/50 p-3 text-sm transition-colors hover:bg-secondary"
              >
                <span className="line-clamp-2">{n.title}</span>
                <span className="text-xs text-muted-foreground">{n.source}</span>
              </Link>
            ))}
          </div>
        </Card>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold">Explore by Subject</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Dive into specialized areas of NASA bioscience research. Each category represents years
            of scientific discovery and innovation.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {SUBJECT_META.map((subject) => (
            <SubjectCard key={subject.title} {...subject} count={counts?.[subject.title] ?? 0} />
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="glass-card cosmic-glow p-12 text-center">
          <h2 className="mb-4 text-3xl font-bold">Ready to Discover?</h2>
          <p className="mx-auto mb-6 max-w-2xl text-muted-foreground">
            Search the full library, ask questions in plain language, or see what space biology means
            for farms on Earth.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/explore">
              <Button size="lg">Start Exploring</Button>
            </Link>
            <Link to="/agriculture">
              <Button size="lg" variant="outline">
                Farming tools
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
