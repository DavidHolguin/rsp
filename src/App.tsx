import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import TermsAndConditions from "./pages/TermsAndConditions";
import UsagePolicies from "./pages/UsagePolicies";
import CancellationPolicies from "./pages/CancellationPolicies";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="/usage-policies" element={<UsagePolicies />} />
        <Route path="/cancellation-policies" element={<CancellationPolicies />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;