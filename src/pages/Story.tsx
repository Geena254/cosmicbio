import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Rocket,
  Bone,
  Sprout,
  Bug,
  Radiation,
  Globe2,
  ArrowRight,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { usePublications } from "@/hooks/usePublications";

const CHAPTERS = [
  {
    icon: Rocket,
    kicker: "Chapter 1",
    title: "Why grow life in space at all?",
    body: "A trip to Mars takes years. Nobody can pack that much food, air or medicine. So NASA has spent four decades sending living things — cells, seeds, plants, mice, people — into orbit to learn what survives and what breaks.",
    takeaway:
      "Every study in this library is one answer to a single question: what does life do when gravity goes away?",
    query: "spaceflight",
  },
  {
    icon: Bone,
    kicker: "Chapter 2",
    title: "The human body starts to unbuild itself",
    body: "Without gravity pulling on them, bones thin and muscles shrink. Fluid shifts to the head and presses on the eyes. The immune system gets sloppy. These changes show up within weeks.",
    takeaway:
      "Understanding bone and muscle loss in orbit also teaches us about ageing and bed-rest recovery on Earth.",
    query: "bone",
  },
  {
    icon: Sprout,
    kicker: "Chapter 3",
    title: "Plants get lost without 'down'",
    body: "Roots normally follow gravity. In orbit they wander, and the plant rewrites which genes it switches on. Yet plants do grow, flower and set seed in space — crews have eaten lettuce grown on the station.",
    takeaway:
      "Plant stress research in orbit maps directly onto drought, salinity and poor-soil farming back home.",
    query: "plant",
  },
  {
    icon: Bug,
    kicker: "Chapter 4",
    title: "Microbes behave differently up there",
    body: "Some bacteria grow faster and become harder to treat in microgravity. Others are useful: they recycle waste, fix nutrients and keep closed life-support systems running.",
    takeaway: "Controlling microbes is what makes a sealed habitat — or a greenhouse — survivable.",
    query: "microbial",
  },
  {
    icon: Radiation,
    kicker: "Chapter 5",
    title: "Radiation is the frontier risk",
    body: "Beyond Earth's magnetic shield, cosmic radiation damages DNA in ways we cannot fully block with shielding. Much of the current research is about protection, repair and early detection.",
    takeaway: "This is the biggest open gap between where the science is and where a Mars crew needs it to be.",
    query: "radiation",
  },
  {
    icon: Globe2,
    kicker: "Chapter 6",
    title: "It comes back to Earth",
    body: "Closed-loop water, soil-free growing, stress-tolerant crops, tiny sensors, fast diagnostics — all built for space, all useful on a smallholder farm in Kenya or anywhere with hard growing conditions.",
    takeaway: "Use the Agriculture tools to turn any of these studies into a planting plan you can act on.",
    query: "growth",
  },
];

const Story = () => {
  const [index, setIndex] = useState(0);
  const chapter = CHAPTERS[index];
  const Icon = chapter.icon;
  const { data, isLoading } = usePublications({ search: chapter.query, pageSize: 3 });

  return (
    <div className="min-h-screen py-10">
      <div className="container mx-auto max-w-4xl px-4">
        <header className="mb-8 text-center">
          <h1 className="mb-3 text-4xl font-bold">The story of life beyond Earth</h1>
          <p className="text-muted-foreground">
            Six short chapters through 40 years of NASA bioscience — with the real studies behind
            each one.
          </p>
        </header>

        <Progress value={((index + 1) / CHAPTERS.length) * 100} className="mb-8" />

        <Card key={index} className="glass-card animate-fade-in p-8">
          <div className="mb-4 flex items-center gap-3">
            <span className="rounded-lg bg-primary/15 p-3">
              <Icon className="h-6 w-6 text-primary" />
            </span>
            <Badge variant="secondary">{chapter.kicker}</Badge>
          </div>

          <h2 className="mb-4 text-3xl font-bold">{chapter.title}</h2>
          <p className="mb-6 text-lg leading-relaxed text-muted-foreground">{chapter.body}</p>

          <div className="mb-8 rounded-lg border border-accent/30 bg-accent/10 p-4">
            <p className="text-sm font-medium">{chapter.takeaway}</p>
          </div>

          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Studies from this chapter
          </h3>
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          ) : (
            <div className="space-y-2">
              {(data?.rows ?? []).map((p) => (
                <Link
                  key={p.id}
                  to={`/publication/${p.id}`}
                  className="block rounded-lg bg-secondary/50 p-3 text-sm transition-colors hover:bg-secondary"
                >
                  {p.title}
                  {p.year ? (
                    <span className="ml-2 text-muted-foreground">{p.year}</span>
                  ) : null}
                </Link>
              ))}
            </div>
          )}
        </Card>

        <div className="mt-8 flex items-center justify-between">
          <Button
            variant="outline"
            disabled={index === 0}
            onClick={() => setIndex((i) => i - 1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <span className="text-sm text-muted-foreground">
            {index + 1} of {CHAPTERS.length}
          </span>
          {index < CHAPTERS.length - 1 ? (
            <Button className="cosmic-glow" onClick={() => setIndex((i) => i + 1)}>
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Link to="/explore">
              <Button className="cosmic-glow">
                Explore all studies <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Story;
