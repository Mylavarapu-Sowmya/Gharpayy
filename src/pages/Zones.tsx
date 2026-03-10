import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function Zones() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Zone Management</h1><p className="text-muted-foreground text-sm">Define geographic zones and agent assignments</p></div>
        <Button><Plus className="h-4 w-4 mr-2" /> Add Zone</Button>
      </div>
      <div className="bg-card rounded-xl border border-border p-12 text-center">
        <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="font-semibold text-lg mb-2">No zones configured</h3>
        <p className="text-muted-foreground text-sm">Create zones to enable automatic lead routing</p>
      </div>
    </motion.div>
  );
}
