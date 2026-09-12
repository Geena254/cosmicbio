import { FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { downloadAdviceReport, type ReportOptions } from "@/lib/report";
import { toast } from "sonner";

interface Props extends ReportOptions {
  label?: string;
}

const slug = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);

const DownloadReportButton = ({ label = "Download report (PDF)", ...options }: Props) => (
  <Button
    variant="outline"
    onClick={() => {
      try {
        downloadAdviceReport({ ...options, fileName: slug(options.fileName) || "advice-report" });
        toast.success("Your report is downloading.");
      } catch {
        toast.error("The report could not be created. Please try again.");
      }
    }}
  >
    <FileDown className="mr-2 h-4 w-4" />
    {label}
  </Button>
);

export default DownloadReportButton;
