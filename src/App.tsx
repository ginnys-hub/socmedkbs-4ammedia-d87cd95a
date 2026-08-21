import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import Layout from "./components/Layout";
import Index from "./pages/Index.tsx";
import Scorecards from "./pages/Scorecards.tsx";
import HourlyTracker from "./pages/HourlyTracker.tsx";
import Schedule from "./pages/Schedule.tsx";
import Macros from "./pages/Macros.tsx";
import ZendeskMacros from "./pages/ZendeskMacros.tsx";
import Resources from "./pages/Resources.tsx";
import Handbook from "./pages/Handbook.tsx";
import Translator from "./pages/Translator.tsx";
import AdminLogin from "./pages/AdminLogin.tsx";
import Admin from "./pages/Admin.tsx";
import NotFound from "./pages/NotFound.tsx";
import { isTransientBackendError } from "@/lib/backendRetry";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => isTransientBackendError(error) && failureCount < 4,
      retryDelay: (attemptIndex) => 700 * (attemptIndex + 1),
      refetchOnWindowFocus: true,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Index />} />
              <Route path="/scorecards" element={<Scorecards />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/hourly-tracker" element={<HourlyTracker />} />
              <Route path="/macros" element={<Macros />} />
              <Route path="/zendesk-macros" element={<ZendeskMacros />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/handbook" element={<Handbook />} />
              <Route path="/translator" element={<Translator />} />
            </Route>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
