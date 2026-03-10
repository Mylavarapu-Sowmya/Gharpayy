import { cn } from "@/lib/utils";

const SOURCE_STYLES: Record<string, string> = {
  whatsapp: "bg-success/10 text-success border-success/20",
  website: "bg-info/10 text-info border-info/20",
  instagram: "bg-pink-100 text-pink-600 border-pink-200",
  facebook: "bg-blue-100 text-blue-600 border-blue-200",
  phone: "bg-accent text-accent-foreground border-primary/20",
  landing_page: "bg-success/10 text-success border-success/20",
  phone_call: "bg-accent text-accent-foreground border-primary/20",
};

export default function LeadSourceBadge({ source }: { source: string }) {
  const style = SOURCE_STYLES[source] || "bg-muted text-muted-foreground border-border";
  const label = source.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border", style)}>
      {label}
    </span>
  );
}
