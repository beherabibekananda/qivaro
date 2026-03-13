import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { LogOut, User } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Profile = Tables<"profiles">;

const ProfilePage = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("*").eq("user_id", user.id).single().then(({ data }) => {
      if (data) {
        setProfile(data);
        setDisplayName(data.display_name || "");
        setUsername(data.username || "");
        setPhone(data.phone || "");
      }
    });
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update({
      display_name: displayName,
      username: username || null,
      phone: phone || null,
    }).eq("user_id", user.id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Profile updated!" });
    }
    setSaving(false);
  };

  return (
    <div className="px-4 pt-6 pb-8">
      <h1 className="font-display text-2xl font-bold mb-6 text-foreground">Profile</h1>

      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <User className="w-7 h-7 text-primary" />
        </div>
        <div>
          <p className="font-display font-semibold text-foreground">{displayName || "User"}</p>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        <div>
          <Label>Display name</Label>
          <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} maxLength={50} />
        </div>
        <div>
          <Label>Username</Label>
          <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Optional" maxLength={30} />
        </div>
        <div>
          <Label>Phone</Label>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Optional" maxLength={20} />
        </div>
        <Button onClick={handleSave} disabled={saving} className="w-full">
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <Button variant="outline" className="w-full text-destructive" onClick={signOut}>
        <LogOut className="w-4 h-4 mr-2" /> Sign Out
      </Button>
    </div>
  );
};

export default ProfilePage;
