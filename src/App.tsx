import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AppLayout from "@/components/AppLayout";
import ScrollToTop from "@/components/ScrollToTop";
import Auth from "@/pages/Auth";
import Index from "@/pages/Index";
import HomePage from "@/pages/HomePage";
import ReportForm from "@/pages/ReportForm";
import SearchPage from "@/pages/SearchPage";
import MyReports from "@/pages/MyReports";
import ReportDetail from "@/pages/ReportDetail";
import ProfilePage from "@/pages/ProfilePage";
import NotificationsPage from "@/pages/NotificationsPage";
import TermsPage from "@/pages/TermsPage";
import NotFound from "./pages/NotFound";
import CompleteProfile from "@/pages/CompleteProfile";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const [checkingProfile, setCheckingProfile] = useState(true);
  const [hasRegNumber, setHasRegNumber] = useState(false);

  useEffect(() => {
    if (loading || !user) {
      setCheckingProfile(false);
      return;
    }

    const check = async () => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("registration_number")
        .eq("user_id", user.id)
        .single();

      setHasRegNumber(!!profile?.registration_number);
      setCheckingProfile(false);
    };

    check();
  }, [user, loading]);

  if (loading || checkingProfile) {
    return (
      <div className="fixed inset-0 z-[999] bg-background flex items-center justify-center text-muted-foreground">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="font-medium animate-pulse">Initializing Qivaro...</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  // User is logged in but hasn't added registration number yet
  if (!hasRegNumber) return <Navigate to="/complete-profile" replace />;

  return <AppLayout>{children}</AppLayout>;
};

const AuthRoute = () => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="fixed inset-0 z-[999] bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (user) return <Navigate to="/dashboard" replace />;
  return <Auth />;
};

const CompleteProfileRoute = () => {
  const { user, loading } = useAuth();
  const [checking, setChecking] = useState(true);
  const [hasRegNumber, setHasRegNumber] = useState(false);

  useEffect(() => {
    if (loading || !user) {
      setChecking(false);
      return;
    }

    const check = async () => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("registration_number")
        .eq("user_id", user.id)
        .single();

      setHasRegNumber(!!profile?.registration_number);
      setChecking(false);
    };

    check();
  }, [user, loading]);

  if (loading || checking) {
    return (
      <div className="fixed inset-0 z-[999] bg-background flex items-center justify-center text-muted-foreground">
         <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!user) return <Navigate to="/auth" replace />;
  if (hasRegNumber) return <Navigate to="/dashboard" replace />;

  return <CompleteProfile />;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/auth" element={<AuthRoute />} />
        <Route path="/complete-profile" element={<CompleteProfileRoute />} />
        <Route path="/" element={<Index />} />
        <Route path="/dashboard" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/report/:type" element={<ProtectedRoute><ReportForm /></ProtectedRoute>} />
        <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
        <Route path="/my-reports" element={<ProtectedRoute><MyReports /></ProtectedRoute>} />
        <Route path="/report-detail/:id" element={<ProtectedRoute><ReportDetail /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <AuthProvider>
          <AnimatedRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
