import { Card } from "@/components/ui/card";
import { TrendingUp, Target, Calendar, Database } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const Insights = () => {
  // Mock data for charts
  const publicationTrends = [
    { year: "2018", count: 45 },
    { year: "2019", count: 52 },
    { year: "2020", count: 68 },
    { year: "2021", count: 82 },
    { year: "2022", count: 95 },
    { year: "2023", count: 112 },
    { year: "2024", count: 124 }
  ];

  const subjectDistribution = [
    { subject: "Flora & Fauna", count: 243 },
    { subject: "Data Mgmt", count: 124 },
    { subject: "AI & ML", count: 87 },
    { subject: "Software", count: 68 },
    { subject: "Education", count: 56 },
    { subject: "Comms", count: 30 }
  ];

  const topOrganisms = [
    { name: "Arabidopsis thaliana", studies: 87 },
    { name: "C. elegans", studies: 65 },
    { name: "E. coli", studies: 54 },
    { name: "Mice", studies: 42 },
    { name: "Yeast", studies: 38 }
  ];

  return (
    <div className="min-h-screen pt-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Research Insights</h1>
          <p className="text-muted-foreground">
            Trends, patterns, and knowledge gaps across NASA bioscience research
          </p>
        </div>

        {/* Key Insights Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="glass-card p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold">Growing Field</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Publications increased by 175% over the past 6 years, showing accelerating interest in space biology
            </p>
          </Card>

          <Card className="glass-card p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-accent/10">
                <Target className="h-5 w-5 text-accent" />
              </div>
              <h3 className="font-semibold">Research Gaps</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              23 identified knowledge gaps remain critical for Moon and Mars mission planning
            </p>
          </Card>

          <Card className="glass-card p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-cosmic-glow/10">
                <Database className="h-5 w-5 text-cosmic-glow" />
              </div>
              <h3 className="font-semibold">Data Integration</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Cross-referencing 3 major NASA databases for comprehensive knowledge synthesis
            </p>
          </Card>
        </div>

        {/* Publication Trends */}
        <Card className="glass-card p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-6">Publication Trends Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={publicationTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))", 
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px"
                }}
              />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                dot={{ fill: "hsl(var(--primary))", r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Subject Distribution */}
          <Card className="glass-card p-6">
            <h2 className="text-2xl font-semibold mb-6">Research by Subject Area</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={subjectDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="subject" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px"
                  }}
                />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Top Organisms Studied */}
          <Card className="glass-card p-6">
            <h2 className="text-2xl font-semibold mb-6">Most Studied Organisms</h2>
            <div className="space-y-4">
              {topOrganisms.map((organism, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-primary">{index + 1}</span>
                    <span className="font-medium">{organism.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${(organism.studies / topOrganisms[0].studies) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-16 text-right">
                      {organism.studies} studies
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Knowledge Gaps */}
        <Card className="glass-card p-6 mt-8">
          <h2 className="text-2xl font-semibold mb-6">Identified Knowledge Gaps</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "Long-term effects of reduced gravity on human bone density",
              "Plant pollination mechanisms in microgravity environments",
              "Microbiome changes during extended Mars transit",
              "Radiation shielding effectiveness for biological systems",
              "Closed-loop life support system optimization",
              "Psychological impacts of isolation in deep space missions"
            ].map((gap, index) => (
              <div key={index} className="p-4 bg-accent/10 rounded-lg border border-accent/20">
                <p className="text-sm">{gap}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Insights;
