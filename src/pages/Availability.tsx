import { motion } from "framer-motion";
import { Grid3X3 } from "lucide-react";

export default function Availability() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div><h1 className="text-2xl font-bold">Availability</h1><p className="text-muted-foreground text-sm">Room and bed availability matrix</p></div>
      <div className="bg-card rounded-xl border border-border p-12 text-center">
        <Grid3X3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="font-semibold text-lg mb-2">Availability board</h3>
        <p className="text-muted-foreground text-sm">Add inventory to see real-time availability</p>
      </div>
    </motion.div>
  );
}
