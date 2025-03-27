
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// Layout
import Layout from "@/components/Layout";

// Pages
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import ApiKeys from "./pages/ApiKeys";
import Trades from "./pages/Trades";
import Signals from "./pages/Signals";
import Settings from "./pages/Settings";
import Subscription from "./pages/Subscription";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="api-keys" element={<ApiKeys />} />
              <Route path="trades" element={<Trades />} />
              <Route path="signals" element={<Signals />} />
              <Route path="settings" element={<Settings />} />
              <Route path="subscription" element={<Subscription />} />
            </Route>
            {/* Standalone welcome page */}
            <Route path="/welcome" element={<Index />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
