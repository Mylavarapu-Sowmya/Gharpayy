import { motion } from "framer-motion";
import { Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function Owners() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Owners</h1><p className="text-muted-foreground text-sm">Manage property owners</p></div>
        <Button><Plus className="h-4 w-4 mr-2" /> Add Owner</Button>
      </div>
      <div className="bg-card rounded-xl border border-border p-12 text-center">
        <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="font-semibold text-lg mb-2">No owners added</h3>
        <p className="text-muted-foreground text-sm">Add property owners to manage their inventory</p>
      </div>
    </motion.div>
  );
}
