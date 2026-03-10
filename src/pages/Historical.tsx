import { motion } from "framer-motion";
import { Clock } from "lucide-react";

export default function Historical() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div><h1 className="text-2xl font-bold">Historical</h1><p className="text-muted-foreground text-sm">Time-series data and trends</p></div>
      <div className="bg-card rounded-xl border border-border p-12 text-center">
        <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="font-semibold text-lg mb-2">Historical data will appear here</h3>
        <p className="text-muted-foreground text-sm">Track trends over time as your data grows</p>
      </div>
    </motion.div>
  );
}
