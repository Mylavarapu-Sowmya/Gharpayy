import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";

export default function Conversations() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div><h1 className="text-2xl font-bold">Messages</h1><p className="text-muted-foreground text-sm">View and manage lead conversations</p></div>
      <div className="bg-card rounded-xl border border-border p-12 text-center">
        <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="font-semibold text-lg mb-2">No conversations yet</h3>
        <p className="text-muted-foreground text-sm">Start conversations with your leads to see them here</p>
      </div>
    </motion.div>
  );
}
