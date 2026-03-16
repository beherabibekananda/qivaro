import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [loginRegNumber, setLoginRegNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Look up email using registration number via RPC
      const { data: foundEmail, error: rpcError } = await supabase.rpc(
        "get_email_by_registration_number",
        { reg_number: loginRegNumber }
      );

      if (rpcError || !foundEmail) {
        toast({
          title: "Login failed",
          description: "No account found with this registration number.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: foundEmail,
        password,
      });

      if (error) {
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        navigate("/dashboard");
      }
    } catch (err: any) {
      toast({
        title: "Login failed",
        description: err.message,
        variant: "destructive",
      });
    }

    setLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
          registration_number: registrationNumber,
        },
        emailRedirectTo: "https://qivarolpu.vercel.app/",
      },
    });

    if (error) {
      toast({
        title: "Signup failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Check your email ✉️",
        description:
          "We sent you a confirmation link. After confirming, log in with your registration number.",
      });
      setIsLogin(true);
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin + "/dashboard",
        },
      });
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Google sign in failed",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
    }
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
            Qivaro
          </h1>
          <p className="text-muted-foreground text-center text-sm px-4">
            Join the exclusive network for Lovely Professional University to
            track, report, and recover your lost items securely.
          </p>
        </motion.div>

        <motion.div
          layout
          className="bg-card rounded-3xl border border-border/60 p-8 shadow-xl shadow-primary/5"
        >
          <AnimatePresence mode="wait">
            <motion.h2
              key={isLogin ? "login-title" : "signup-title"}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="font-display text-2xl font-bold text-center mb-6"
            >
              {isLogin ? "Welcome back" : "Create account"}
            </motion.h2>
          </AnimatePresence>

          {/* ─── LOGIN FORM ─── */}
          {isLogin && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="loginRegNumber">Registration Number</Label>
                <Input
                  id="loginRegNumber"
                  type="text"
                  value={loginRegNumber}
                  onChange={(e) => setLoginRegNumber(e.target.value)}
                  placeholder="e.g. 12012345"
                  required
                  className="h-11 rounded-xl font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="loginPassword">Password</Label>
                <Input
                  id="loginPassword"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="h-11 rounded-xl"
                />
              </div>
              <Button
                type="submit"
                className="w-full h-11 rounded-xl font-bold mt-2"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          )}

          {/* ─── SIGNUP FORM ─── */}
          {!isLogin && (
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Display name</Label>
                <Input
                  id="name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your name"
                  required
                  className="h-11 rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@lpu.co.in or personal email"
                  required
                  className="h-11 rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="h-11 rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="h-11 rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="regNumber">LPU Registration Number</Label>
                <Input
                  id="regNumber"
                  type="text"
                  value={registrationNumber}
                  onChange={(e) => setRegistrationNumber(e.target.value)}
                  placeholder="e.g. 12012345"
                  className="h-11 rounded-xl font-mono"
                  required
                />
                <p className="text-[10px] text-muted-foreground ml-1">
                  This will be your login credential after sign-up.
                </p>
              </div>
              <Button
                type="submit"
                className="w-full h-11 rounded-xl font-bold mt-2"
                disabled={loading}
              >
                {loading ? "Creating account..." : "Sign up"}
              </Button>
              <p className="text-[10px] text-center text-muted-foreground mt-3 leading-relaxed">
                By signing up, you agree to our{" "}
                <a
                  href="/terms"
                  target="_blank"
                  className="font-bold text-primary hover:underline"
                >
                  Terms & Conditions
                </a>{" "}
                and confirm you understand our acceptable use policy.
              </p>
            </form>
          )}

          {/* ─── DIVIDER ─── */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          {/* ─── GOOGLE SIGN-IN ─── */}
          <Button
            variant="outline"
            type="button"
            disabled={loading}
            onClick={handleGoogleSignIn}
            className="w-full h-11 rounded-xl font-bold bg-white text-black hover:bg-gray-100 hover:text-black border-gray-200"
          >
            <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
              <path d="M1 1h22v22H1z" fill="none" />
            </svg>
            Continue with Google
          </Button>

          {isLogin && (
            <p className="text-[10px] text-center text-muted-foreground mt-4 leading-relaxed">
              Google sign-in requires a registration number to be linked on
              first use.
            </p>
          )}

          {/* ─── TOGGLE LOGIN/SIGNUP ─── */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            {isLogin
              ? "Don't have an account?"
              : "Already have an account?"}{" "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary font-bold hover:underline transition-all"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Auth;
