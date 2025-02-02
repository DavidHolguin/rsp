import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Index from "./pages/Index";

function App() {
  return (
    <Router>
      <Index />
      <Toaster />
    </Router>
  );
}

export default App;