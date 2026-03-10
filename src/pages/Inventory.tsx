import { motion } from "framer-motion";
import { Boxes } from "lucide-react";

export default function Inventory() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div><h1 className="text-2xl font-bold">Inventory</h1><p className="text-muted-foreground text-sm">View properties, rooms, and beds</p></div>
      <div className="bg-card rounded-xl border border-border p-12 text-center">
        <Boxes className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="font-semibold text-lg mb-2">No inventory yet</h3>
        <p className="text-muted-foreground text-sm">Add properties and rooms to manage inventory</p>
      </div>
    </motion.div>
  );
}
