import { motion } from "framer-motion";
import { Puzzle } from "lucide-react";

export default function Matching() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div><h1 className="text-2xl font-bold">Matching Engine</h1><p className="text-muted-foreground text-sm">Find best beds for lead requirements</p></div>
      <div className="bg-card rounded-xl border border-border p-12 text-center">
        <Puzzle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="font-semibold text-lg mb-2">Smart matching</h3>
        <p className="text-muted-foreground text-sm">Enter criteria to find matching properties</p>
      </div>
    </motion.div>
  );
}
