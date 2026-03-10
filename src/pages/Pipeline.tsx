import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { useDraggable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import { Phone, MapPin, IndianRupee, MessageSquare, PhoneCall } from "lucide-react";
import LeadSourceBadge from "@/components/LeadSourceBadge";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";

const STAGES = [
  { key: "new", label: "New Lead", color: "bg-info" },
  { key: "contacted", label: "Contacted", color: "bg-warning" },
  { key: "requirement_collected", label: "Requirement Collected", color: "bg-purple-500" },
  { key: "property_suggested", label: "Property Suggested", color: "bg-primary" },
  { key: "visit_scheduled", label: "Visit Scheduled", color: "bg-primary" },
  { key: "visit_completed", label: "Visit Completed", color: "bg-success" },
  { key: "booked", label: "Booked", color: "bg-success" },
  { key: "lost", label: "Lost", color: "bg-destructive" },
];

interface Lead {
  id: string;
  name: string;
  phone: string | null;
  source: string;
  status: string;
  area: string | null;
  budget_min: number | null;
  budget_max: number | null;
  lead_score: number | null;
}

function LeadCard({ lead }: { lead: Lead }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: lead.id, data: lead });
  const style = transform ? { transform: `translate(${transform.x}px, ${transform.y}px)` } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        "bg-card border border-border rounded-xl p-4 cursor-grab active:cursor-grabbing transition-shadow hover:shadow-md",
        isDragging && "opacity-50 shadow-lg"
      )}
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold text-sm">{lead.name}</h4>
        <LeadSourceBadge source={lead.source} />
      </div>
      {lead.phone && (
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
          <Phone className="h-3 w-3" />{lead.phone}
        </p>
      )}
      {lead.area && (
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
          <MapPin className="h-3 w-3" />{lead.area}
        </p>
      )}
      {(lead.budget_min || lead.budget_max) && (
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
          <IndianRupee className="h-3 w-3" />₹{lead.budget_min?.toLocaleString()}-{lead.budget_max?.toLocaleString()}
        </p>
      )}
      {lead.lead_score !== null && (
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
          <div className="flex gap-2">
            <PhoneCall className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground cursor-pointer" />
            <MessageSquare className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground cursor-pointer" />
          </div>
          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-[10px] font-bold text-primary">{lead.lead_score}%</span>
          </div>
        </div>
      )}
    </div>
  );
}

function StageColumn({ stage, leads }: { stage: typeof STAGES[0]; leads: Lead[] }) {
  const { setNodeRef, isOver } = useDroppable({ id: stage.key });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex-shrink-0 w-[280px] flex flex-col",
        isOver && "ring-2 ring-primary/30 rounded-xl"
      )}
    >
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <div className={cn("w-2 h-2 rounded-full", stage.color)} />
          <h3 className="font-semibold text-sm">{stage.label}</h3>
        </div>
        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{leads.length}</span>
      </div>
      <div className="flex-1 space-y-3 min-h-[200px] p-1">
        {leads.map(lead => <LeadCard key={lead.id} lead={lead} />)}
      </div>
    </div>
  );
}

export default function Pipeline() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  useEffect(() => {
    const fetchLeads = async () => {
      const { data } = await supabase.from("leads").select("id, name, phone, source, status, area, budget_min, budget_max, lead_score").order("created_at", { ascending: false });
      setLeads(data || []);
      setLoading(false);
    };
    fetchLeads();
  }, []);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const newStatus = over.id as string;
    const leadId = active.id as string;
    const lead = leads.find(l => l.id === leadId);
    if (!lead || lead.status === newStatus) return;

    // Optimistic update
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));

    const { error } = await supabase.from("leads").update({ status: newStatus }).eq("id", leadId);
    if (error) {
      toast.error("Failed to update lead status");
      setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: lead.status } : l));
    } else {
      toast.success(`Moved to ${STAGES.find(s => s.key === newStatus)?.label}`);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><p className="text-muted-foreground">Loading pipeline...</p></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Pipeline</h1>
          <p className="text-muted-foreground text-sm">Revenue engine — track leads through every stage</p>
        </div>
        <Button onClick={() => window.location.href = "/leads"}>
          <Plus className="h-4 w-4 mr-2" /> Add Lead
        </Button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 lg:-mx-6 lg:px-6">
          {STAGES.map(stage => (
            <StageColumn
              key={stage.key}
              stage={stage}
              leads={leads.filter(l => l.status === stage.key)}
            />
          ))}
        </motion.div>
      </DndContext>
    </div>
  );
}
