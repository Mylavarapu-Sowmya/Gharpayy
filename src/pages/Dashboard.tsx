import { useEffect, useState } from "react";
import { Users, Clock, Calendar, CheckCircle, TrendingUp, Shield, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import StatCard from "@/components/StatCard";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const PIPELINE_STAGES = ["new", "contacted", "requirement_collected", "property_suggested", "visit_scheduled", "visit_completed", "booked", "lost"];
const STAGE_LABELS: Record<string, string> = {
  new: "New", contacted: "Contacted", requirement_collected: "Requirement",
  property_suggested: "Property", visit_scheduled: "Visit", visit_completed: "Visited",
  booked: "Booked", lost: "Lost"
};

const SOURCE_COLORS = ["#f97316", "#3b82f6", "#22c55e", "#ec4899", "#8b5cf6", "#14b8a6"];

export default function Dashboard() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from("leads").select("*");
      setLeads(data || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  const totalLeads = leads.length;
  const bookedLeads = leads.filter(l => l.status === "booked").length;
  const conversionRate = totalLeads > 0 ? ((bookedLeads / totalLeads) * 100).toFixed(1) : "0";
  const newToday = leads.filter(l => {
    const created = new Date(l.created_at);
    const today = new Date();
    return created.toDateString() === today.toDateString();
  }).length;

  const pipelineData = PIPELINE_STAGES.map(stage => ({
    name: STAGE_LABELS[stage] || stage,
    count: leads.filter(l => l.status === stage).length,
  }));

  const sourceMap = leads.reduce((acc: Record<string, number>, lead) => {
    const src = lead.source || "unknown";
    acc[src] = (acc[src] || 0) + 1;
    return acc;
  }, {});
  const sourceData = Object.entries(sourceMap).map(([name, value]) => ({ name, value }));

  const needsAttention = leads.filter(l => l.status === "new" && l.lead_score !== null && l.lead_score < 30).slice(0, 5);
  const hotLeads = leads.filter(l => l.lead_score !== null && l.lead_score >= 70).sort((a, b) => (b.lead_score || 0) - (a.lead_score || 0)).slice(0, 5);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><p className="text-muted-foreground">Loading dashboard...</p></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Real-time overview of your sales pipeline</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Leads" value={totalLeads} icon={Users} change={`+${newToday} today`} changeType="positive" delay={0} />
        <StatCard title="Avg Response Time" value="—" icon={Clock} delay={1} />
        <StatCard title="Visits Scheduled" value={leads.filter(l => l.status === "visit_scheduled").length} icon={Calendar} delay={2} />
        <StatCard title="Bookings Closed" value={bookedLeads} icon={CheckCircle} change={`${conversionRate}%`} changeType="positive" delay={3} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Conversion Rate" value={`${conversionRate}%`} icon={TrendingUp} delay={4} />
        <StatCard title="New Today" value={newToday} icon={Users} delay={5} />
        <StatCard title="Lost Leads" value={leads.filter(l => l.status === "lost").length} icon={AlertTriangle} delay={6} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="lg:col-span-2 bg-card rounded-xl border border-border p-6">
          <h3 className="font-semibold mb-4">Pipeline Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={pipelineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
              <Bar dataKey="count" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="bg-card rounded-xl border border-border p-6">
          <h3 className="font-semibold mb-4">Lead Sources</h3>
          {sourceData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={sourceData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {sourceData.map((_, i) => <Cell key={i} fill={SOURCE_COLORS[i % SOURCE_COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-muted-foreground text-sm text-center py-12">No lead data yet</p>
          )}
        </motion.div>
      </div>

      {/* Bottom panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Needs Attention</h3>
            <span className="text-xs text-muted-foreground">{needsAttention.length}</span>
          </div>
          {needsAttention.length > 0 ? needsAttention.map(lead => (
            <div key={lead.id} className="py-2 border-b border-border last:border-0">
              <p className="font-medium text-sm">{lead.name}</p>
              <p className="text-xs text-muted-foreground">{lead.area || "—"} · ₹{lead.budget_min?.toLocaleString()}-{lead.budget_max?.toLocaleString()}</p>
            </div>
          )) : <p className="text-muted-foreground text-sm">All leads on track!</p>}
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Hot Leads</h3>
            <span className="text-xs text-muted-foreground">Score ≥70</span>
          </div>
          {hotLeads.length > 0 ? hotLeads.map(lead => (
            <div key={lead.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div>
                <p className="font-medium text-sm">{lead.name}</p>
                <p className="text-xs text-muted-foreground">{lead.area || "—"}</p>
              </div>
              <span className="text-sm font-bold text-primary">⭐ {lead.lead_score}</span>
            </div>
          )) : <p className="text-muted-foreground text-sm">No hot leads yet</p>}
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Follow-ups</h3>
            <span className="text-xs text-muted-foreground">0 pending</span>
          </div>
          <p className="text-muted-foreground text-sm">No pending follow-ups</p>
        </motion.div>
      </div>
    </div>
  );
}
