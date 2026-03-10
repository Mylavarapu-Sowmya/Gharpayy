import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Visits() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Visits</h1>
          <p className="text-muted-foreground text-sm">Schedule and track property visits</p>
        </div>
        <Button><Calendar className="h-4 w-4 mr-2" /> Schedule Visit</Button>
      </div>
      <div className="bg-card rounded-xl border border-border p-12 text-center">
        <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="font-semibold text-lg mb-2">No visits scheduled</h3>
        <p className="text-muted-foreground text-sm">Schedule visits for your leads to start tracking outcomes</p>
      </div>
    </motion.div>
  );
}
