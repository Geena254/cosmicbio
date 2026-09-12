import { ReactNode, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Loader2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AdviceOutput from "@/components/AdviceOutput";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Source = { n: number; id: string; title: string; year: number | null; url: string | null };

const EXAMPLES = [
  "How does microgravity affect plant roots?",
  "What happens to bone density in space?",
  "Which crops have been grown on the space station?",
  "What do space studies say about drought stress in plants?",
  "How does radiation change gene expression?",
];

type Props = { children: ReactNode; initialQuestion?: string };

const AskDialog = ({ children, initialQuestion }: Props) => {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState<Source[]>([]);

  useEffect(() => {
    if (open && initialQuestion) setQuestion(initialQuestion);
  }, [open, initialQuestion]);

  const ask = async (text?: string) => {
    const q = (text ?? question).trim();
    if (q.length < 4) return;
    setQuestion(q);
    setLoading(true);
    setAnswer("");
    setSources([]);
    try {
      const { data, error } = await supabase.functions.invoke("ask-research", {
        body: { question: q },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setAnswer(data.answer);
      setSources(data.sources ?? []);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "The research assistant could not answer right now.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[85vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <Badge variant="secondary" className="mb-2 w-fit">
            <Sparkles className="mr-1 h-3 w-3" /> Answers with citations
          </Badge>
          <DialogTitle className="text-3xl">Ask the research</DialogTitle>
          <DialogDescription>
            Ask a question in plain language. The answer is built only from the NASA studies in this
            library, and every claim points back to the studies it came from.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <form
            className="flex flex-col gap-3 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              ask();
            }}
          >
            <Input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="What does space research say about..."
              className="h-12"
            />
            <Button type="submit" className="cosmic-glow h-12 px-6" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Ask"}
            </Button>
          </form>

          <div className="flex flex-wrap gap-2">
            {EXAMPLES.map((e) => (
              <Button key={e} variant="outline" size="sm" onClick={() => ask(e)} disabled={loading}>
                {e}
              </Button>
            ))}
          </div>

          {loading && (
            <p className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Reading the studies...
            </p>
          )}

          {answer && (
            <Card className="glass-card p-6">
              <AdviceOutput text={answer} />
            </Card>
          )}

          {sources.length > 0 && (
            <Card className="glass-card p-6">
              <h2 className="mb-4 text-xl font-semibold">Studies used</h2>
              <ol className="space-y-3">
                {sources.map((s) => (
                  <li key={s.id} className="flex gap-3 text-sm">
                    <span className="font-bold text-primary">[{s.n}]</span>
                    <span className="flex-1">
                      <Link
                        to={`/publication/${s.id}`}
                        onClick={() => setOpen(false)}
                        className="hover:text-primary"
                      >
                        {s.title}
                      </Link>{" "}
                      <span className="text-muted-foreground">{s.year ?? ""}</span>
                      {s.url && (
                        <a
                          href={s.url}
                          target="_blank"
                          rel="noreferrer"
                          className="ml-2 inline-flex items-center text-muted-foreground hover:text-primary"
                          aria-label="Open the original study"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </span>
                  </li>
                ))}
              </ol>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AskDialog;
