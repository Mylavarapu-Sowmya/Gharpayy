import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  new: "bg-info/10 text-info",
  contacted: "bg-warning/10 text-warning",
  requirement_collected: "bg-purple-100 text-purple-600",
  property_suggested: "bg-accent text-accent-foreground",
  visit_scheduled: "bg-primary/10 text-primary",
  visit_completed: "bg-success/10 text-success",
  booked: "bg-success text-success-foreground",
  lost: "bg-destructive/10 text-destructive",
};

const STATUS_LABELS: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  requirement_collected: "Req. Collected",
  property_suggested: "Property Suggested",
  visit_scheduled: "Visit Scheduled",
  visit_completed: "Visit Completed",
  booked: "Booked",
  lost: "Lost",
};

export default function LeadStatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLES[status] || "bg-muted text-muted-foreground";
  return (
    <span className={cn("inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold", style)}>
      {STATUS_LABELS[status] || status}
    </span>
  );
}
