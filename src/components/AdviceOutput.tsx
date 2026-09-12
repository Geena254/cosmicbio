import { cn } from "@/lib/utils";

interface AdviceOutputProps {
  text: string;
  className?: string;
}

/** Lightweight renderer for the markdown-ish text the advisor returns. */
const AdviceOutput = ({ text, className }: AdviceOutputProps) => {
  const lines = text.split("\n");

  const renderInline = (value: string) => {
    const parts = value.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) =>
      part.startsWith("**") && part.endsWith("**") ? (
        <strong key={i} className="text-foreground">
          {part.slice(2, -2)}
        </strong>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };

  return (
    <div className={cn("space-y-2 text-muted-foreground leading-relaxed", className)}>
      {lines.map((raw, index) => {
        const line = raw.trimEnd();
        if (!line.trim()) return <div key={index} className="h-2" />;

        if (/^#{1,6}\s/.test(line)) {
          const level = line.match(/^#+/)![0].length;
          const content = line.replace(/^#+\s*/, "");
          return (
            <h3
              key={index}
              className={cn(
                "font-semibold text-foreground",
                level <= 2 ? "text-xl mt-4" : "text-lg mt-3"
              )}
            >
              {renderInline(content)}
            </h3>
          );
        }

        if (/^\s*[-*•]\s+/.test(line)) {
          return (
            <div key={index} className="flex gap-3 pl-1">
              <span className="text-accent">•</span>
              <span>{renderInline(line.replace(/^\s*[-*•]\s+/, ""))}</span>
            </div>
          );
        }

        if (/^\s*\d+[.)]\s+/.test(line)) {
          const marker = line.match(/^\s*(\d+)[.)]/)![1];
          return (
            <div key={index} className="flex gap-3 pl-1">
              <span className="text-primary font-semibold">{marker}.</span>
              <span>{renderInline(line.replace(/^\s*\d+[.)]\s+/, ""))}</span>
            </div>
          );
        }

        return <p key={index}>{renderInline(line)}</p>;
      })}
    </div>
  );
};

export default AdviceOutput;
