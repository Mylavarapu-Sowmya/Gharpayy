import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ProtectedRoute from "@/components/ProtectedRoute";
import CrmLayout from "@/components/CrmLayout";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Leads from "./pages/Leads";
import Pipeline from "./pages/Pipeline";
import Visits from "./pages/Visits";
import Conversations from "./pages/Conversations";
import Bookings from "./pages/Bookings";
import Analytics from "./pages/Analytics";
import Historical from "./pages/Historical";
import Owners from "./pages/Owners";
import Inventory from "./pages/Inventory";
import Availability from "./pages/Availability";
import Effort from "./pages/Effort";
import Matching from "./pages/Matching";
import Zones from "./pages/Zones";
import CrmSettings from "./pages/CrmSettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function CrmPage({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <CrmLayout>{children}</CrmLayout>
    </ProtectedRoute>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<CrmPage><Dashboard /></CrmPage>} />
          <Route path="/dashboard" element={<CrmPage><Dashboard /></CrmPage>} />
          <Route path="/leads" element={<CrmPage><Leads /></CrmPage>} />
          <Route path="/pipeline" element={<CrmPage><Pipeline /></CrmPage>} />
          <Route path="/visits" element={<CrmPage><Visits /></CrmPage>} />
          <Route path="/conversations" element={<CrmPage><Conversations /></CrmPage>} />
          <Route path="/bookings" element={<CrmPage><Bookings /></CrmPage>} />
          <Route path="/analytics" element={<CrmPage><Analytics /></CrmPage>} />
          <Route path="/historical" element={<CrmPage><Historical /></CrmPage>} />
          <Route path="/owners" element={<CrmPage><Owners /></CrmPage>} />
          <Route path="/inventory" element={<CrmPage><Inventory /></CrmPage>} />
          <Route path="/availability" element={<CrmPage><Availability /></CrmPage>} />
          <Route path="/effort" element={<CrmPage><Effort /></CrmPage>} />
          <Route path="/matching" element={<CrmPage><Matching /></CrmPage>} />
          <Route path="/zones" element={<CrmPage><Zones /></CrmPage>} />
          <Route path="/settings" element={<CrmPage><CrmSettings /></CrmPage>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
