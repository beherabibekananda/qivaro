import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";

const CompleteProfile = () => {
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, signOut } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    const { error } = await supabase
      .from("profiles")
      .update({ registration_number: registrationNumber })
      .eq("user_id", user.id);

    if (error) {
      if (error.code === "23505") {
        toast({
          title: "Already taken",
          description:
            "This registration number is already linked to another account.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    } else {
      toast({ title: "Welcome to Qivaro! 🎉" });
      navigate("/dashboard");
    }
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="min-h-screen bg-background flex items-center justify-center px-4"
    >
      <div className="w-full max-w-sm">
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.25 }}
          className="flex flex-col items-center justify-center gap-3 mb-8"
        >
          <img
            src="/qivaro-logo.webp"
            alt="Qivaro"
            className="w-20 h-20 rounded-3xl shadow-md border border-border"
          />
          <h1 className="font-display text-3xl font-black text-foreground tracking-tight">
            Almost there! ✨
          </h1>
          <p className="text-muted-foreground text-center text-sm px-4">
            Link your LPU Registration Number to complete your campus identity
            and unlock full access.
          </p>
        </motion.div>

        <motion.div
          layout
          className="bg-card rounded-3xl border border-border/60 p-8 shadow-xl shadow-primary/5"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="completeRegNumber">
                LPU Registration Number
              </Label>
              <Input
                id="completeRegNumber"
                type="text"
                value={registrationNumber}
                onChange={(e) => setRegistrationNumber(e.target.value)}
                placeholder="e.g. 12012345"
                className="h-11 rounded-xl font-mono"
                required
              />
              <p className="text-[10px] text-muted-foreground ml-1">
                This will be your unique login credential going forward.
              </p>
            </div>
            <Button
              type="submit"
              className="w-full h-11 rounded-xl font-bold mt-2"
              disabled={loading}
            >
              {loading ? "Saving..." : "Complete Setup"}
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-border/40">
            <button
              onClick={signOut}
              className="w-full text-center text-sm text-muted-foreground hover:text-destructive transition-colors"
            >
              Sign out and use a different account
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CompleteProfile;
