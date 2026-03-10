import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Phone, MapPin, IndianRupee, MoreHorizontal, Trash2, Edit } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import LeadSourceBadge from "@/components/LeadSourceBadge";
import LeadStatusBadge from "@/components/LeadStatusBadge";
import { toast } from "sonner";
import { motion } from "framer-motion";

const SOURCES = ["whatsapp", "website", "instagram", "facebook", "phone", "landing_page"] as const;
const STATUSES = ["new", "contacted", "requirement_collected", "property_suggested", "visit_scheduled", "visit_completed", "booked", "lost"] as const;

interface Lead {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  source: string;
  status: string;
  area: string | null;
  city: string | null;
  budget_min: number | null;
  budget_max: number | null;
  lead_score: number | null;
  assigned_agent_id: string | null;
  created_at: string;
  gender_preference: string | null;
  sharing_type: string | null;
  notes: string | null;
}

export default function Leads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterSource, setFilterSource] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);

  // Form state
  const [form, setForm] = useState({
    name: "", phone: "", email: "", source: "website" as string,
    status: "new" as string, area: "", city: "Bangalore",
    budget_min: "", budget_max: "", gender_preference: "any",
    sharing_type: "any", notes: ""
  });

  const fetchLeads = async () => {
    const { data, error } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
    if (error) { toast.error("Failed to load leads"); return; }
    setLeads(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchLeads(); }, []);

  const resetForm = () => {
    setForm({ name: "", phone: "", email: "", source: "website", status: "new", area: "", city: "Bangalore", budget_min: "", budget_max: "", gender_preference: "any", sharing_type: "any", notes: "" });
    setEditingLead(null);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error("Name is required"); return; }
    
    const payload = {
      name: form.name.trim(),
      phone: form.phone || null,
      email: form.email || null,
      source: form.source,
      status: form.status,
      area: form.area || null,
      city: form.city || null,
      budget_min: form.budget_min ? Number(form.budget_min) : null,
      budget_max: form.budget_max ? Number(form.budget_max) : null,
      gender_preference: form.gender_preference || null,
      sharing_type: form.sharing_type || null,
      notes: form.notes || null,
    };

    if (editingLead) {
      const { error } = await supabase.from("leads").update(payload).eq("id", editingLead.id);
      if (error) { toast.error("Failed to update lead"); return; }
      toast.success("Lead updated");
    } else {
      const { error } = await supabase.from("leads").insert(payload);
      if (error) { toast.error("Failed to create lead: " + error.message); return; }
      toast.success("Lead created");
    }
    
    setDialogOpen(false);
    resetForm();
    fetchLeads();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("leads").delete().eq("id", id);
    if (error) { toast.error("Failed to delete"); return; }
    toast.success("Lead deleted");
    fetchLeads();
  };

  const handleEdit = (lead: Lead) => {
    setEditingLead(lead);
    setForm({
      name: lead.name, phone: lead.phone || "", email: lead.email || "",
      source: lead.source, status: lead.status, area: lead.area || "",
      city: lead.city || "Bangalore", budget_min: lead.budget_min?.toString() || "",
      budget_max: lead.budget_max?.toString() || "", gender_preference: lead.gender_preference || "any",
      sharing_type: lead.sharing_type || "any", notes: lead.notes || ""
    });
    setDialogOpen(true);
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = !search || lead.name.toLowerCase().includes(search.toLowerCase()) || lead.phone?.includes(search) || lead.email?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "all" || lead.status === filterStatus;
    const matchesSource = filterSource === "all" || lead.source === filterSource;
    return matchesSearch && matchesStatus && matchesSource;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">All Leads</h1>
          <p className="text-muted-foreground text-sm">{filteredLeads.length} leads total</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" /> Add Lead</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingLead ? "Edit Lead" : "Add New Lead"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Name *</Label><Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Lead name" className="mt-1.5" /></div>
                <div><Label>Phone</Label><Input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="+91 98765 43210" className="mt-1.5" /></div>
              </div>
              <div><Label>Email</Label><Input value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="lead@email.com" className="mt-1.5" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Source</Label>
                  <Select value={form.source} onValueChange={v => setForm({...form, source: v})}>
                    <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                    <SelectContent>{SOURCES.map(s => <SelectItem key={s} value={s}>{s.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Status</Label>
                  <Select value={form.status} onValueChange={v => setForm({...form, status: v})}>
                    <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                    <SelectContent>{STATUSES.map(s => <SelectItem key={s} value={s}>{s.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>City</Label><Input value={form.city} onChange={e => setForm({...form, city: e.target.value})} className="mt-1.5" /></div>
                <div><Label>Area</Label><Input value={form.area} onChange={e => setForm({...form, area: e.target.value})} placeholder="e.g. HSR Layout" className="mt-1.5" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Budget Min (₹)</Label><Input type="number" value={form.budget_min} onChange={e => setForm({...form, budget_min: e.target.value})} className="mt-1.5" /></div>
                <div><Label>Budget Max (₹)</Label><Input type="number" value={form.budget_max} onChange={e => setForm({...form, budget_max: e.target.value})} className="mt-1.5" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Gender Preference</Label>
                  <Select value={form.gender_preference} onValueChange={v => setForm({...form, gender_preference: v})}>
                    <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Sharing Type</Label>
                  <Select value={form.sharing_type} onValueChange={v => setForm({...form, sharing_type: v})}>
                    <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="single">Single</SelectItem>
                      <SelectItem value="double">Double</SelectItem>
                      <SelectItem value="triple">Triple</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div><Label>Notes</Label><Input value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} placeholder="Any additional info..." className="mt-1.5" /></div>
              <Button onClick={handleSave} className="w-full">{editingLead ? "Update Lead" : "Create Lead"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search leads by name, phone, email..." className="pl-10" />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {STATUSES.map(s => <SelectItem key={s} value={s}>{s.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterSource} onValueChange={setFilterSource}>
          <SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="Source" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sources</SelectItem>
            {SOURCES.map(s => <SelectItem key={s} value={s}>{s.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card rounded-xl border border-border overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-muted-foreground">Loading leads...</div>
        ) : filteredLeads.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-muted-foreground">No leads found</p>
            <Button className="mt-4" onClick={() => setDialogOpen(true)}><Plus className="h-4 w-4 mr-2" /> Add your first lead</Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map(lead => (
                  <TableRow key={lead.id} className="cursor-pointer" onClick={() => handleEdit(lead)}>
                    <TableCell className="font-medium">{lead.name}</TableCell>
                    <TableCell>
                      <div className="text-sm">{lead.phone && <span className="flex items-center gap-1 text-muted-foreground"><Phone className="h-3 w-3" />{lead.phone}</span>}</div>
                    </TableCell>
                    <TableCell>
                      {(lead.area || lead.city) && <span className="flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="h-3 w-3" />{[lead.area, lead.city].filter(Boolean).join(", ")}</span>}
                    </TableCell>
                    <TableCell>
                      {(lead.budget_min || lead.budget_max) && <span className="flex items-center gap-1 text-sm text-muted-foreground"><IndianRupee className="h-3 w-3" />{lead.budget_min?.toLocaleString()}-{lead.budget_max?.toLocaleString()}</span>}
                    </TableCell>
                    <TableCell><LeadSourceBadge source={lead.source} /></TableCell>
                    <TableCell><LeadStatusBadge status={lead.status} /></TableCell>
                    <TableCell>{lead.lead_score !== null && <span className="text-sm font-semibold text-primary">{lead.lead_score}</span>}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
                          <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEdit(lead); }}><Edit className="h-4 w-4 mr-2" />Edit</DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleDelete(lead.id); }} className="text-destructive"><Trash2 className="h-4 w-4 mr-2" />Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </motion.div>
    </div>
  );
}
