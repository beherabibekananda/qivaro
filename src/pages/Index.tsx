import UserFlowDiagram from "@/components/UserFlowDiagram";
import IADiagram from "@/components/IADiagram";
import { Shield } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <header className="py-16 px-4 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">
            SafeFindr
          </h1>
        </div>
        <p className="text-muted-foreground font-body text-lg max-w-lg mx-auto">
          Campus lost‑and‑found platform — UX Case Study
        </p>
        <div className="flex justify-center gap-3 mt-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-warning/10 text-warning text-xs font-medium font-body">
            <span className="w-2 h-2 rounded-full bg-warning" /> Lost Flow
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium font-body">
            <span className="w-2 h-2 rounded-full bg-accent" /> Found Flow
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium font-body">
            <span className="w-2 h-2 rounded-full bg-primary" /> System
          </span>
        </div>
      </header>

      <UserFlowDiagram />
      <IADiagram />

      {/* Footer */}
      <footer className="py-10 text-center text-xs text-muted-foreground font-body border-t border-border">
        SafeFindr UX Case Study · Designed for campus communities
      </footer>
    </div>
  );
};

export default Index;
