import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";

interface Node {
  id: string;
  label: string;
  type: "study" | "organism" | "mission" | "finding";
}

interface Link {
  source: string;
  target: string;
}

interface KnowledgeGraphProps {
  nodes?: Node[];
  links?: Link[];
}

const KnowledgeGraph = ({ nodes = [], links = [] }: KnowledgeGraphProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Default demo data
  const defaultNodes: Node[] = [
    { id: "1", label: "Plant Cell Walls", type: "study" },
    { id: "2", label: "Arabidopsis", type: "organism" },
    { id: "3", label: "ISS", type: "mission" },
    { id: "4", label: "Microgravity Effects", type: "finding" },
    { id: "5", label: "C. elegans", type: "organism" },
    { id: "6", label: "Radiation Study", type: "study" },
    { id: "7", label: "Mars Mission", type: "mission" },
    { id: "8", label: "Bone Density", type: "finding" },
  ];

  const defaultLinks: Link[] = [
    { source: "1", target: "2" },
    { source: "1", target: "3" },
    { source: "1", target: "4" },
    { source: "5", target: "6" },
    { source: "6", target: "3" },
    { source: "6", target: "4" },
    { source: "7", target: "8" },
    { source: "4", target: "8" },
  ];

  const graphNodes = nodes.length > 0 ? nodes : defaultNodes;
  const graphLinks = links.length > 0 ? links : defaultLinks;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Simple force-directed layout
    const nodePositions = new Map<string, { x: number; y: number }>();
    
    // Initialize positions in a circle
    graphNodes.forEach((node, i) => {
      const angle = (i / graphNodes.length) * 2 * Math.PI;
      const radius = Math.min(width, height) * 0.35;
      nodePositions.set(node.id, {
        x: width / 2 + radius * Math.cos(angle),
        y: height / 2 + radius * Math.sin(angle),
      });
    });

    const getNodeColor = (type: string) => {
      switch (type) {
        case "study": return "#0B3D91"; // NASA Blue
        case "organism": return "#FC3D21"; // NASA Orange
        case "mission": return "#A467E9"; // Purple
        case "finding": return "#00B4D8"; // Cyan
        default: return "#666";
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw links
      ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
      ctx.lineWidth = 2;
      graphLinks.forEach((link) => {
        const source = nodePositions.get(link.source);
        const target = nodePositions.get(link.target);
        if (source && target) {
          ctx.beginPath();
          ctx.moveTo(source.x, source.y);
          ctx.lineTo(target.x, target.y);
          ctx.stroke();
        }
      });

      // Draw nodes
      graphNodes.forEach((node) => {
        const pos = nodePositions.get(node.id);
        if (!pos) return;

        // Node circle
        ctx.fillStyle = getNodeColor(node.type);
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 20, 0, 2 * Math.PI);
        ctx.fill();

        // Node outline
        ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Label
        ctx.fillStyle = "#fff";
        ctx.font = "12px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(node.label, pos.x, pos.y + 35);
      });
    };

    animate();
  }, [graphNodes, graphLinks]);

  return (
    <Card className="glass-card p-6">
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Knowledge Graph</h3>
        <p className="text-sm text-muted-foreground">
          Interactive visualization showing relationships between studies, organisms, missions, and findings
        </p>
      </div>
      <div className="relative rounded-lg overflow-hidden bg-space-dark/50 border border-border">
        <canvas
          ref={canvasRef}
          width={800}
          height={500}
          className="w-full h-auto"
        />
      </div>
      <div className="flex gap-4 mt-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#0B3D91]" />
          <span>Studies</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#FC3D21]" />
          <span>Organisms</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#A467E9]" />
          <span>Missions</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#00B4D8]" />
          <span>Findings</span>
        </div>
      </div>
    </Card>
  );
};

export default KnowledgeGraph;
