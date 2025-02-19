import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import TermsAndConditions from "./pages/TermsAndConditions";
import UsagePolicies from "./pages/UsagePolicies";
import CancellationPolicies from "./pages/CancellationPolicies";
import EmbedGenerator from "./pages/EmbedGenerator";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route } from "react-router-dom";
import { StrictMode } from "react";

function App() {
  return (
    <StrictMode>
      <Router>
        <TooltipProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
            <Route path="/usage-policies" element={<UsagePolicies />} />
            <Route path="/cancellation-policies" element={<CancellationPolicies />} />
            <Route path="/embed-generator" element={<EmbedGenerator />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </TooltipProvider>
      </Router>
    </StrictMode>
  );
}

export default App;