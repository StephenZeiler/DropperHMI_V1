import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot, Root } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UnsavedChangesProvider } from "@/context/UnsavedChangesContext";
import Logs from "./pages/Logs";
import Controls from "./pages/Controls";
import Assembly from "./pages/Assembly";
import Errors from "./pages/Errors";
import WiFi from "./pages/WiFi";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <UnsavedChangesProvider>
          <Routes>
            <Route path="/" element={<Logs />} />
            <Route path="/controls" element={<Controls />} />
            <Route path="/assembly" element={<Assembly />} />
            <Route path="/errors" element={<Errors />} />
            <Route path="/wifi" element={<WiFi />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </UnsavedChangesProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

const container = document.getElementById("root");
if (container) {
  // Check if root has already been created
  const existingRoot = (container as any)._reactRootContainer;

  if (existingRoot) {
    // HMR update: use existing root
    existingRoot.render(<App />);
  } else {
    // Initial render: create new root
    createRoot(container).render(<App />);
  }
}
