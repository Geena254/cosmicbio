import { useState } from "react";
import { Sprout, Leaf, Warehouse, Loader2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AdviceOutput from "@/components/AdviceOutput";
import DownloadReportButton from "@/components/DownloadReportButton";
import { askAdvisor } from "@/lib/advisor";
import { toast } from "sonner";

const KENYA_CROPS = [
  "Maize",
  "Beans",
  "Sorghum",
  "Kale (sukuma wiki)",
  "Tomatoes",
  "Irish potatoes",
  "Green grams",
  "Sweet potatoes",
];

const SETUPS = [
  "Open field, rain-fed",
  "Open field with irrigation",
  "Greenhouse",
  "Shade net",
  "Hydroponics",
  "Kitchen garden / sack garden",
];

const SEASONS = [
  "Long rains (March - May)",
  "Short rains (October - December)",
  "Dry season with irrigation",
  "Not sure yet",
];

const CE_TOPICS = [
  "Low-cost hydroponics",
  "Greenhouse tomato production",
  "Shade nets for leafy greens",
  "Seedling nurseries and transplanting",
  "Water recycling and drip irrigation",
  "Soil-less growing media from local materials",
];

const Agriculture = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const [plantingResult, setPlantingResult] = useState("");
  const [hubResult, setHubResult] = useState("");
  const [ceResult, setCeResult] = useState("");

  const [crop, setCrop] = useState("Maize");
  const [location, setLocation] = useState("");
  const [season, setSeason] = useState(SEASONS[0]);
  const [setup, setSetup] = useState(SETUPS[0]);
  const [area, setArea] = useState("");
  const [notes, setNotes] = useState("");

  const [hubCrop, setHubCrop] = useState("Maize");
  const [ceTopic, setCeTopic] = useState(CE_TOPICS[0]);

  const run = async (
    key: string,
    mode: Parameters<typeof askAdvisor>[0],
    payload: Record<string, unknown>,
    setResult: (value: string) => void
  ) => {
    setLoading(key);
    setResult("");
    try {
      setResult(await askAdvisor(mode, payload));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen py-10">
      <div className="container mx-auto max-w-5xl px-4">
        <header className="mb-8">
          <Badge variant="secondary" className="mb-3">
            <MapPin className="mr-1 h-3 w-3" /> Kenya first, useful worldwide
          </Badge>
          <h1 className="mb-3 text-4xl font-bold">Agriculture Advisor</h1>
          <p className="max-w-3xl text-muted-foreground">
            Space plant-biology research answers the same questions farmers ask: how do roots grow,
            how much light and water is enough, how do crops survive heat, salt and drought. Use the
            tools below to turn that research into planting and growing guidance for your farm.
          </p>
        </header>

        <Tabs defaultValue="advisor" className="space-y-6">
          <TabsList className="glass-card">
            <TabsTrigger value="advisor">
              <Sprout className="mr-2 h-4 w-4" /> Planting Advisor
            </TabsTrigger>
            <TabsTrigger value="hub">
              <Leaf className="mr-2 h-4 w-4" /> Kenya Crop Hub
            </TabsTrigger>
            <TabsTrigger value="ce">
              <Warehouse className="mr-2 h-4 w-4" /> Protected Growing
            </TabsTrigger>
          </TabsList>

          <TabsContent value="advisor" className="space-y-6">
            <Card className="glass-card space-y-4 p-6">
              <h2 className="text-2xl font-semibold">Plan a crop</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Crop</Label>
                  <Select value={crop} onValueChange={setCrop}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {KENYA_CROPS.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">County or area</Label>
                  <Input
                    id="location"
                    placeholder="e.g. Nakuru, Kitui, or Lusaka"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Season</Label>
                  <Select value={season} onValueChange={setSeason}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SEASONS.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Growing setup</Label>
                  <Select value={setup} onValueChange={setSetup}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SETUPS.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="area">Land size</Label>
                  <Input
                    id="area"
                    placeholder="e.g. half an acre"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="notes">Anything else? (soil, water, past problems)</Label>
                  <Textarea
                    id="notes"
                    placeholder="e.g. sandy soil, borehole water, army worms last season"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>
              <Button
                className="cosmic-glow"
                disabled={loading === "advisor" || !location.trim()}
                onClick={() =>
                  run(
                    "advisor",
                    "planting-advisor",
                    { crop, location, season, setup, area: area || "not specified", notes },
                    setPlantingResult
                  )
                }
              >
                {loading === "advisor" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Preparing your plan
                  </>
                ) : (
                  "Get planting plan"
                )}
              </Button>
              {!location.trim() && (
                <p className="text-sm text-muted-foreground">
                  Add your county or area so the advice matches your rains and soils.
                </p>
              )}
            </Card>

            {plantingResult && (
              <Card className="glass-card p-6">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-2xl font-semibold">
                    {crop} in {location}
                  </h2>
                  <DownloadReportButton
                    kicker="Planting advisor report"
                    title={`${crop} planting plan — ${location}`}
                    fileName={`${crop}-${location}-planting-plan`}
                    facts={[
                      { label: "Crop", value: crop },
                      { label: "Area", value: location },
                      { label: "Season", value: season },
                      { label: "Setup", value: setup },
                      { label: "Land size", value: area || "Not specified" },
                    ]}
                    body={plantingResult}
                  />
                </div>
                <AdviceOutput text={plantingResult} />
              </Card>
            )}
          </TabsContent>

          <TabsContent value="hub" className="space-y-6">
            <Card className="glass-card space-y-4 p-6">
              <h2 className="text-2xl font-semibold">Kenya crop guides</h2>
              <p className="text-muted-foreground">
                Pick a crop for a full guide: regions, planting calendar, varieties, soils, pests,
                harvesting and storage.
              </p>
              <div className="flex flex-wrap gap-2">
                {KENYA_CROPS.map((c) => (
                  <Button
                    key={c}
                    variant={hubCrop === c ? "default" : "outline"}
                    size="sm"
                    onClick={() => setHubCrop(c)}
                  >
                    {c}
                  </Button>
                ))}
              </div>
              <Button
                className="cosmic-glow"
                disabled={loading === "hub"}
                onClick={() => run("hub", "crop-hub", { crop: hubCrop }, setHubResult)}
              >
                {loading === "hub" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Building guide
                  </>
                ) : (
                  `Open ${hubCrop} guide`
                )}
              </Button>
            </Card>

            {hubResult && (
              <Card className="glass-card p-6">
                <h2 className="mb-4 text-2xl font-semibold">{hubCrop}</h2>
                <AdviceOutput text={hubResult} />
              </Card>
            )}
          </TabsContent>

          <TabsContent value="ce" className="space-y-6">
            <Card className="glass-card space-y-4 p-6">
              <h2 className="text-2xl font-semibold">Protected and soil-less growing</h2>
              <p className="text-muted-foreground">
                The same techniques that grow food in orbit — controlled light, water recycling,
                soil-less media — work in greenhouses, shade nets and small urban plots.
              </p>
              <div className="flex flex-wrap gap-2">
                {CE_TOPICS.map((t) => (
                  <Button
                    key={t}
                    variant={ceTopic === t ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCeTopic(t)}
                  >
                    {t}
                  </Button>
                ))}
              </div>
              <Button
                className="cosmic-glow"
                disabled={loading === "ce"}
                onClick={() =>
                  run("ce", "controlled-environment", { topic: ceTopic }, setCeResult)
                }
              >
                {loading === "ce" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Preparing guidance
                  </>
                ) : (
                  "Show me how"
                )}
              </Button>
            </Card>

            {ceResult && (
              <Card className="glass-card p-6">
                <h2 className="mb-4 text-2xl font-semibold">{ceTopic}</h2>
                <AdviceOutput text={ceResult} />
              </Card>
            )}
          </TabsContent>
        </Tabs>

        <p className="mt-8 text-sm text-muted-foreground">
          Guidance is generated from research summaries and general agronomy. Confirm dates, varieties
          and treatments with your local agricultural extension officer before spending money.
        </p>
      </div>
    </div>
  );
};

export default Agriculture;
