import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Shield, Search as SearchIcon, AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="px-4 pt-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-8">
        <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
          <Shield className="w-4 h-4 text-primary-foreground" />
        </div>
        <h1 className="font-display text-xl font-bold text-foreground">SafeFindr</h1>
      </div>

      <p className="text-muted-foreground font-body text-sm mb-6">
        Welcome back{user?.user_metadata?.display_name ? `, ${user.user_metadata.display_name}` : ""}! Report a lost or found item to get started.
      </p>

      {/* Hero cards */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <button
          onClick={() => navigate("/report/lost")}
          className="bg-card border-2 border-warning/30 rounded-2xl p-5 text-left hover:shadow-md transition-shadow"
        >
          <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center mb-3">
            <AlertTriangle className="w-5 h-5 text-warning" />
          </div>
          <h3 className="font-display font-semibold text-sm text-foreground">Report Lost</h3>
          <p className="text-xs text-muted-foreground mt-1">Lost something? Let us help find it.</p>
        </button>

        <button
          onClick={() => navigate("/report/found")}
          className="bg-card border-2 border-accent/30 rounded-2xl p-5 text-left hover:shadow-md transition-shadow"
        >
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-3">
            <CheckCircle className="w-5 h-5 text-accent" />
          </div>
          <h3 className="font-display font-semibold text-sm text-foreground">Report Found</h3>
          <p className="text-xs text-muted-foreground mt-1">Found something? Help return it.</p>
        </button>
      </div>

      {/* Quick actions */}
      <Button variant="outline" className="w-full justify-start gap-2" onClick={() => navigate("/search")}>
        <SearchIcon className="w-4 h-4" />
        Search all items
      </Button>
    </div>
  );
};

export default HomePage;
