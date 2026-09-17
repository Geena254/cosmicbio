import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Copy, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { Publication } from "@/hooks/usePublications";
import { citationFor, primarySourceUrl } from "@/lib/sources";

type GraphNode = {
  id: string;
  label: string;
  type: "study" | "focus" | "organism" | "mission" | "subject";
  x: number;
  y: number;
  publication?: Publication;
  members: string[];
};

interface KnowledgeGraphProps {
  studies?: Publication[];
  focus?: Publication | null;
  isLoading?: boolean;
  title?: string;
  description?: string;
}

const COLORS: Record<GraphNode["type"], string> = {
  focus: "#FC3D21",
  study: "#0B3D91",
  organism: "#00B4D8",
  mission: "#A467E9",
  subject: "#F2A65A",
};

const WIDTH = 900;
const HEIGHT = 520;
const CX = WIDTH / 2;
const CY = HEIGHT / 2;

const shorten = (text: string, max = 46) =>
  text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;

const KnowledgeGraph = ({
  studies = [],
  focus = null,
  isLoading = false,
  title = "Knowledge graph",
  description = "Every circle is a real study or a shared theme. Click a circle to see the papers behind it.",
}: KnowledgeGraphProps) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { nodes, links } = useMemo(() => {
    const list = studies.filter((s) => s.id !== focus?.id).slice(0, 14);
    const nodes: GraphNode[] = [];
    const links: { a: string; b: string }[] = [];

    if (focus) {
      nodes.push({
        id: `study-${focus.id}`,
        label: shorten(focus.title, 40),
        type: "focus",
        x: CX,
        y: CY,
        publication: focus,
        members: [],
      });
    }

    // Shared themes: organism, mission and subject actually stored on the records.
    const themes = new Map<string, { label: string; type: GraphNode["type"]; ids: string[] }>();
    const addTheme = (type: GraphNode["type"], value: string | null, pubId: string) => {
      if (!value) return;
      const key = `${type}-${value}`;
      const entry = themes.get(key) ?? { label: value, type, ids: [] };
      entry.ids.push(pubId);
      themes.set(key, entry);
    };

    const pool = focus ? [focus, ...list] : list;
    pool.forEach((p) => {
      addTheme("organism", p.organism, p.id);
      addTheme("mission", p.mission, p.id);
      addTheme("subject", p.subject, p.id);
    });

    const themeEntries = [...themes.entries()]
      .filter(([, t]) => t.ids.length > 1)
      .sort((a, b) => b[1].ids.length - a[1].ids.length)
      .slice(0, 6);

    const innerRadius = 130;
    themeEntries.forEach(([key, theme], i) => {
      const angle = (i / Math.max(1, themeEntries.length)) * 2 * Math.PI - Math.PI / 2;
      nodes.push({
        id: key,
        label: shorten(theme.label, 22),
        type: theme.type,
        x: CX + innerRadius * Math.cos(angle),
        y: CY + innerRadius * Math.sin(angle) * 0.75,
        members: theme.ids,
      });
    });

    const outerRadius = 215;
    list.forEach((p, i) => {
      const angle = (i / Math.max(1, list.length)) * 2 * Math.PI - Math.PI / 2;
      const node: GraphNode = {
        id: `study-${p.id}`,
        label: shorten(p.title, 34),
        type: "study",
        x: CX + outerRadius * Math.cos(angle),
        y: CY + (outerRadius * 0.82) * Math.sin(angle),
        publication: p,
        members: [],
      };
      nodes.push(node);
      if (focus) links.push({ a: `study-${focus.id}`, b: node.id });
    });

    themeEntries.forEach(([key, theme]) => {
      theme.ids.forEach((pubId) => links.push({ a: key, b: `study-${pubId}` }));
    });

    return { nodes, links };
  }, [studies, focus]);

  const byId = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);
  const selected = selectedId ? byId.get(selectedId) ?? null : null;

  const neighbours = useMemo(() => {
    if (!selected) return new Set<string>();
    const set = new Set<string>();
    links.forEach((l) => {
      if (l.a === selected.id) set.add(l.b);
      if (l.b === selected.id) set.add(l.a);
    });
    return set;
  }, [selected, links]);

  const memberPublications = useMemo(() => {
    if (!selected || selected.publication) return [];
    const all = focus ? [focus, ...studies] : studies;
    return selected.members
      .map((id) => all.find((p) => p.id === id))
      .filter((p): p is Publication => Boolean(p));
  }, [selected, studies, focus]);

  const copyCitation = (p: Publication) => {
    navigator.clipboard.writeText(citationFor(p));
    toast.success("Citation copied to your clipboard");
  };

  return (
    <Card className="glass-card p-6">
      <div className="mb-4">
        <h3 className="mb-2 text-xl font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      <div className="relative overflow-hidden rounded-lg border border-border bg-space-dark/50">
        {isLoading ? (
          <div className="flex h-[360px] items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : nodes.length === 0 ? (
          <div className="flex h-[360px] items-center justify-center px-6 text-center text-sm text-muted-foreground">
            No studies to map yet. Search or change the filters to build a graph.
          </div>
        ) : (
          <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="h-auto w-full" role="img">
            {links.map((l, i) => {
              const a = byId.get(l.a);
              const b = byId.get(l.b);
              if (!a || !b) return null;
              const active =
                selected && (l.a === selected.id || l.b === selected.id);
              return (
                <line
                  key={i}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke={active ? "#FC3D21" : "rgba(255,255,255,0.18)"}
                  strokeWidth={active ? 2.2 : 1.2}
                />
              );
            })}

            {nodes.map((n) => {
              const isSelected = selected?.id === n.id;
              const dim = Boolean(selected) && !isSelected && !neighbours.has(n.id);
              const radius = n.type === "focus" ? 24 : n.type === "study" ? 15 : 19;
              return (
                <g
                  key={n.id}
                  transform={`translate(${n.x} ${n.y})`}
                  opacity={dim ? 0.3 : 1}
                  className="cursor-pointer"
                  onClick={() => setSelectedId(isSelected ? null : n.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") setSelectedId(isSelected ? null : n.id);
                  }}
                >
                  <title>{n.publication?.title ?? n.label}</title>
                  <circle
                    r={radius}
                    fill={COLORS[n.type]}
                    stroke={isSelected ? "#fff" : "rgba(255,255,255,0.45)"}
                    strokeWidth={isSelected ? 3 : 1.5}
                  />
                  <text
                    y={radius + 15}
                    textAnchor="middle"
                    fill="rgba(255,255,255,0.85)"
                    fontSize={11}
                  >
                    {n.label}
                  </text>
                </g>
              );
            })}
          </svg>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-4 text-xs">
        {focus && (
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full" style={{ background: COLORS.focus }} /> This study
          </span>
        )}
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full" style={{ background: COLORS.study }} /> Studies
        </span>
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full" style={{ background: COLORS.organism }} /> Organisms
        </span>
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full" style={{ background: COLORS.mission }} /> Missions
        </span>
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full" style={{ background: COLORS.subject }} /> Subjects
        </span>
      </div>

      {selected && (
        <div className="mt-6 rounded-lg border border-border bg-secondary/40 p-5">
          {selected.publication ? (
            <>
              <Badge variant="secondary" className="mb-2">
                {selected.publication.source}
                {selected.publication.year ? ` · ${selected.publication.year}` : ""}
              </Badge>
              <h4 className="mb-2 font-semibold">{selected.publication.title}</h4>
              {selected.publication.authors?.length > 0 && (
                <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
                  {selected.publication.authors.slice(0, 6).join(", ")}
                  {selected.publication.authors.length > 6 ? " et al." : ""}
                </p>
              )}
              <div className="flex flex-wrap gap-2">
                <Link to={`/publication/${selected.publication.id}`}>
                  <Button size="sm">Open this study</Button>
                </Link>
                {primarySourceUrl(selected.publication) && (
                  <a
                    href={primarySourceUrl(selected.publication)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button size="sm" variant="outline">
                      <ExternalLink className="mr-2 h-3.5 w-3.5" /> Read at the source
                    </Button>
                  </a>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyCitation(selected.publication!)}
                >
                  <Copy className="mr-2 h-3.5 w-3.5" /> Copy citation
                </Button>
              </div>
            </>
          ) : (
            <>
              <h4 className="mb-3 font-semibold">
                {selected.label} · {memberPublications.length} connected studies
              </h4>
              <ul className="space-y-2">
                {memberPublications.map((p) => (
                  <li key={p.id}>
                    <Link
                      to={`/publication/${p.id}`}
                      className="text-sm text-primary hover:underline"
                    >
                      {p.title}
                    </Link>
                    <span className="ml-2 text-xs text-muted-foreground">
                      {p.source}
                      {p.year ? ` · ${p.year}` : ""}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </Card>
  );
};

export default KnowledgeGraph;
