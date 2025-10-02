import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Calendar, Users } from "lucide-react";
import { Link } from "react-router-dom";

interface PublicationCardProps {
  id: string;
  title: string;
  summary: string;
  year: number;
  authors: string[];
  tags: string[];
  source: string;
}

const PublicationCard = ({ id, title, summary, year, authors, tags, source }: PublicationCardProps) => {
  return (
    <Card className="glass-card p-6 hover-lift">
      <div className="flex flex-col gap-4">
        <div>
          <Link to={`/publication/${id}`}>
            <h3 className="text-xl font-semibold mb-2 hover:text-primary transition-colors cursor-pointer">
              {title}
            </h3>
          </Link>
          <p className="text-sm text-muted-foreground line-clamp-3">{summary}</p>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{year}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{authors.length} authors</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <span className="text-xs text-muted-foreground">{source}</span>
          <Button size="sm" variant="outline" className="gap-2">
            View Details
            <ExternalLink className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default PublicationCard;
