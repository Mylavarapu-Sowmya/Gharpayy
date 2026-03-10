import { motion } from "framer-motion";
import { Zap } from "lucide-react";

export default function Effort() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div><h1 className="text-2xl font-bold">Effort Dashboard</h1><p className="text-muted-foreground text-sm">Per-property lead, visit, and booking metrics</p></div>
      <div className="bg-card rounded-xl border border-border p-12 text-center">
        <Zap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="font-semibold text-lg mb-2">Effort tracking</h3>
        <p className="text-muted-foreground text-sm">Select a property to view effort metrics</p>
      </div>
    </motion.div>
  );
}
