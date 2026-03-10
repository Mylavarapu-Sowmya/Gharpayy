import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";

export default function Bookings() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div><h1 className="text-2xl font-bold">Bookings</h1><p className="text-muted-foreground text-sm">Track all confirmed bookings</p></div>
      <div className="bg-card rounded-xl border border-border p-12 text-center">
        <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="font-semibold text-lg mb-2">No bookings yet</h3>
        <p className="text-muted-foreground text-sm">Bookings will appear here when leads convert</p>
      </div>
    </motion.div>
  );
}
