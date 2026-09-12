import { useMemo, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip as ChartTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CloudRain, Droplets, MapPin, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import DownloadReportButton from "@/components/DownloadReportButton";
import {
  COUNTY_RAINFALL,
  MONTHS,
  RAIN_SEASONS,
  ZONE_COLORS,
  type CountyRainfall,
} from "@/data/rainfall";

const radiusFor = (annual: number) => 5 + Math.min(annual, 2000) / 130;

const seasonWindows = (county: CountyRainfall) => {
  const wet = county.monthly
    .map((mm, i) => ({ mm, month: MONTHS[i] }))
    .filter((m) => m.mm >= Math.max(60, county.annual / 14));
  return wet.length ? wet.map((w) => w.month).join(", ") : "No reliably wet month";
};

const plantingNote = (county: CountyRainfall) => {
  const longRains = county.monthly[2] + county.monthly[3] + county.monthly[4];
  const shortRains = county.monthly[9] + county.monthly[10] + county.monthly[11];
  if (longRains > shortRains * 1.3)
    return "Plant with the long rains (March - May). Prepare land in February and sow on the first well-soaked rains.";
  if (shortRains > longRains * 1.2)
    return "The short rains (October - December) are the stronger season here. Plant short-maturity, drought-tolerant varieties.";
  return "Both seasons are usable. Split your planting across March - May and October - December to spread the risk.";
};

const Rainfall = () => {
  const [selected, setSelected] = useState<CountyRainfall>(
    COUNTY_RAINFALL.find((c) => c.name === "Nakuru") ?? COUNTY_RAINFALL[0]
  );
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () =>
      COUNTY_RAINFALL.filter((c) =>
        c.name.toLowerCase().includes(query.trim().toLowerCase())
      ).sort((a, b) => a.name.localeCompare(b.name)),
    [query]
  );

  const chartData = selected.monthly.map((mm, i) => ({ month: MONTHS[i], mm }));
  const peak = Math.max(...selected.monthly);

  const reportBody = [
    `## Rainfall pattern`,
    `Agro-ecological zone: ${selected.zone}`,
    `Approximate mean annual rainfall: ${selected.annual} mm`,
    `Wettest months: ${seasonWindows(selected)}`,
    "",
    `## Monthly calendar (mm, long-term average)`,
    ...selected.monthly.map((mm, i) => `- ${MONTHS[i]}: ${mm} mm`),
    "",
    `## Planting guidance`,
    plantingNote(selected),
    "- Prepare land and buy certified seed at least three weeks before the rains are due.",
    "- Sow after 25-30 mm of rain has fallen over two or three days, not on the first shower.",
    "- In months below 40 mm, plan supplementary irrigation, mulching or water harvesting.",
    "",
    `## Data source`,
    "Figures are generalised from open climate datasets (CHIRPS and WorldClim style agro-ecological averages). They are long-term planning averages, not forecasts, and rainfall varies widely within a county.",
  ].join("\n");

  return (
    <div className="min-h-screen py-10">
      <div className="container mx-auto max-w-6xl px-4">
        <header className="mb-8">
          <Badge variant="secondary" className="mb-3">
            <CloudRain className="mr-1 h-3 w-3" /> Open climate data, all 47 counties
          </Badge>
          <h1 className="mb-3 text-4xl font-bold">Kenya Rainfall Calendars</h1>
          <p className="max-w-3xl text-muted-foreground">
            Click any county on the map to see its rainfall through the year, its agro-ecological
            zone and when to plant. Circle size shows how much rain the county gets in a year and
            colour shows its climate zone.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <Card className="glass-card overflow-hidden p-0">
            <div className="h-[460px] w-full">
              <MapContainer
                center={[0.3, 37.9]}
                zoom={6}
                scrollWheelZoom={false}
                style={{ height: "100%", width: "100%", background: "transparent" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                  url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />
                {COUNTY_RAINFALL.map((county) => (
                  <CircleMarker
                    key={county.name}
                    center={[county.lat, county.lng]}
                    radius={radiusFor(county.annual)}
                    pathOptions={{
                      color: selected.name === county.name ? "#FC3D21" : ZONE_COLORS[county.zone],
                      weight: selected.name === county.name ? 3 : 1.5,
                      fillColor: ZONE_COLORS[county.zone],
                      fillOpacity: 0.55,
                    }}
                    eventHandlers={{ click: () => setSelected(county) }}
                  >
                    <Tooltip direction="top">
                      {county.name} — {county.annual} mm/year
                    </Tooltip>
                  </CircleMarker>
                ))}
              </MapContainer>
            </div>
            <div className="flex flex-wrap gap-3 border-t border-border p-4">
              {Object.entries(ZONE_COLORS).map(([zone, color]) => (
                <span key={zone} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span
                    className="inline-block h-3 w-3 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  {zone}
                </span>
              ))}
            </div>
          </Card>

          <div className="space-y-6">
            <Card className="glass-card p-5">
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder="Search a county"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <div className="flex max-h-44 flex-wrap gap-2 overflow-y-auto">
                {filtered.map((county) => (
                  <button
                    key={county.name}
                    onClick={() => setSelected(county)}
                    className={`rounded-md border px-2.5 py-1 text-xs transition-colors ${
                      selected.name === county.name
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {county.name}
                  </button>
                ))}
              </div>
            </Card>

            <Card className="glass-card space-y-3 p-5">
              <h2 className="flex items-center gap-2 text-2xl font-semibold">
                <MapPin className="h-5 w-5 text-accent" /> {selected.name}
              </h2>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{selected.zone}</Badge>
                <Badge variant="outline">
                  <Droplets className="mr-1 h-3 w-3" /> {selected.annual} mm a year
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{plantingNote(selected)}</p>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Wettest months:</span>{" "}
                {seasonWindows(selected)}
              </p>
              <DownloadReportButton
                label={`Download ${selected.name} calendar (PDF)`}
                kicker="County rainfall calendar"
                title={`${selected.name} County rainfall calendar`}
                fileName={`${selected.name}-rainfall-calendar`}
                facts={[
                  { label: "Zone", value: selected.zone },
                  { label: "Annual", value: `${selected.annual} mm` },
                  { label: "Wettest", value: seasonWindows(selected) },
                  { label: "Peak month", value: `${peak} mm` },
                ]}
                body={reportBody}
              />
            </Card>
          </div>
        </div>

        <Card className="glass-card mt-6 p-6">
          <h2 className="mb-4 text-xl font-semibold">
            {selected.name}: average rainfall by month (mm)
          </h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} unit="mm" width={50} />
                <ChartTooltip
                  cursor={{ fill: "hsl(var(--muted))", opacity: 0.3 }}
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                    color: "hsl(var(--foreground))",
                  }}
                  formatter={(value: number) => [`${value} mm`, "Rainfall"]}
                />
                <Bar dataKey="mm" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry) => (
                    <Cell
                      key={entry.month}
                      fill={entry.mm >= 100 ? "#0B3D91" : entry.mm >= 50 ? "#00B4D8" : "#FC3D21"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Blue bars are planting-capable months, light blue are marginal, orange months need
            irrigation or water harvesting.
          </p>
        </Card>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {RAIN_SEASONS.map((season) => (
            <Card key={season.label} className="glass-card p-5">
              <h3 className="font-semibold">{season.label}</h3>
              <p className="text-sm text-accent">{season.months}</p>
              <p className="mt-2 text-sm text-muted-foreground">{season.note}</p>
            </Card>
          ))}
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          Rainfall figures are long-term averages generalised from open climate datasets (CHIRPS and
          WorldClim style agro-ecological zone data) and from public agro-ecological zone maps. They
          are planning guides, not forecasts. Check the Kenya Meteorological Department seasonal
          forecast and your local extension officer before planting.
        </p>
      </div>
    </div>
  );
};

export default Rainfall;
