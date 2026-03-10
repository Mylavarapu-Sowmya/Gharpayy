import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";

export default function Analytics() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div><h1 className="text-2xl font-bold">Analytics</h1><p className="text-muted-foreground text-sm">Performance metrics and insights</p></div>
      <div className="bg-card rounded-xl border border-border p-12 text-center">
        <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="font-semibold text-lg mb-2">Add leads to see analytics</h3>
        <p className="text-muted-foreground text-sm">Charts and metrics will populate as data comes in</p>
      </div>
    </motion.div>
  );
}
