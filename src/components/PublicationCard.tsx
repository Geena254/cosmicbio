import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Calendar, Users, FileText } from "lucide-react";
import { Link } from "react-router-dom";

interface PublicationCardProps {
  id: string;
  title: string;
  summary: string;
  year: number;
  authors: string[];
  tags: string[];
  source: string;
  sourceUrl?: string | null;
  pdfUrl?: string | null;
}

const PublicationCard = ({
  id,
  title,
  summary,
  year,
  authors,
  tags,
  source,
  sourceUrl,
  pdfUrl,
}: PublicationCardProps) => {
  return (
    <Card className="glass-card p-6 hover-lift">
      <div className="flex flex-col gap-4">
        <div>
          <Link to={`/publication/${id}`}>
            <h3 className="mb-2 cursor-pointer text-xl font-semibold transition-colors hover:text-primary">
              {title}
            </h3>
          </Link>
          <p className="line-clamp-3 text-sm text-muted-foreground">{summary}</p>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {year > 0 && (
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{year}</span>
            </div>
          )}
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

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-2">
          <span className="text-xs text-muted-foreground">{source}</span>
          <div className="flex flex-wrap gap-2">
            {pdfUrl && (
              <a href={pdfUrl} target="_blank" rel="noreferrer">
                <Button size="sm" variant="ghost" className="gap-2">
                  <FileText className="h-3 w-3" />
                  PDF
                </Button>
              </a>
            )}
            {sourceUrl && (
              <a href={sourceUrl} target="_blank" rel="noreferrer">
                <Button size="sm" variant="outline" className="gap-2">
                  Source page
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </a>
            )}
            <Link to={`/publication/${id}`}>
              <Button size="sm" className="gap-2">
                View details
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PublicationCard;
