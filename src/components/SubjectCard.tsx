import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface SubjectCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  count: number;
  color: string;
}

const SubjectCard = ({ title, description, icon: Icon, count, color }: SubjectCardProps) => {
  return (
    <Link to={`/explore?subject=${encodeURIComponent(title)}`}>
      <Card className="glass-card hover-lift cursor-pointer group overflow-hidden">
        <div className="p-6 relative">
          <div className={`absolute top-0 right-0 w-32 h-32 ${color} opacity-10 blur-3xl group-hover:opacity-20 transition-opacity`} />
          <div className="relative z-10">
            <div className={`inline-flex p-3 rounded-lg ${color} bg-opacity-10 mb-4`}>
              <Icon className="h-6 w-6" style={{ color: `hsl(var(${color.replace('bg-', '--')}))` }} />
            </div>
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground mb-4">{description}</p>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-primary">{count}</span>
              <span className="text-sm text-muted-foreground">studies</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default SubjectCard;
