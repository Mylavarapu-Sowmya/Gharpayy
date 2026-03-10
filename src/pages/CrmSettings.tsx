import { motion } from "framer-motion";
import { Settings } from "lucide-react";

export default function CrmSettings() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div><h1 className="text-2xl font-bold">Settings</h1><p className="text-muted-foreground text-sm">Configure your CRM preferences</p></div>
      <div className="bg-card rounded-xl border border-border p-12 text-center">
        <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="font-semibold text-lg mb-2">Settings</h3>
        <p className="text-muted-foreground text-sm">Team management, notifications, and preferences coming soon</p>
      </div>
    </motion.div>
  );
}
