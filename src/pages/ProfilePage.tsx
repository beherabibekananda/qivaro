import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { LogOut, User, Camera, Loader2, Shield, ShieldCheck, ExternalLink } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Profile = Tables<"profiles">;

const ProfilePage = () => {
  const { user, profile: contextProfile, signOut, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (contextProfile) {
      setProfile(contextProfile);
      setDisplayName(contextProfile.display_name || "");
      setUsername(contextProfile.username || "");
      setPhone(contextProfile.phone || "");
      if (contextProfile.avatar_url) {
        if (contextProfile.avatar_url.startsWith("http")) {
          setAvatarUrl(contextProfile.avatar_url);
        } else {
          const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(contextProfile.avatar_url);
          setAvatarUrl(publicUrl);
        }
      }
    }
  }, [contextProfile]);

  const handleSave = async () => {
    if (!user) return;
    
    // Fake name validation
    const fakeNames = ["anon", "anonymous", "user", "fake", "test", "none", "unknown", "admin", "null", "undefined"];
    const nameLower = displayName.toLowerCase().trim();
    const userLower = username.toLowerCase().trim();
    
    if (!nameLower || nameLower.length < 2) {
      toast({ title: "Invalid Name", description: "Please enter your real name.", variant: "destructive" });
      return;
    }
    
    if (fakeNames.includes(nameLower)) {
      toast({ title: "No Fake Names", description: "Please use your real identity. Fake names are not allowed.", variant: "destructive" });
      return;
    }

    if (userLower && fakeNames.includes(userLower)) {
      toast({ title: "Invalid Username", description: "This username is not allowed.", variant: "destructive" });
      return;
    }

    setSaving(true);
    const { error } = await supabase.from("profiles").update({
      display_name: displayName.trim(),
      username: username ? username.trim() : null,
      phone: phone.trim() || null,
    }).eq("user_id", user.id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      await refreshProfile();
      toast({ title: "Profile updated!" });
    }
    setSaving(false);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!e.target.files || e.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${user?.id}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);

      // Save to profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: filePath })
        .eq('user_id', user?.id as string);

      if (updateError) {
        throw updateError;
      }

      setAvatarUrl(publicUrl);
      toast({ title: 'Avatar updated successfully!' });

    } catch (error: any) {
      toast({ title: 'Error uploading avatar', description: error.message, variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };



  return (
    <div className="px-4 pt-6 pb-8">
      <h1 className="font-display text-2xl font-bold mb-6 text-foreground">Profile</h1>

      <div className="flex items-center gap-6 mb-8">
        <label className="relative cursor-pointer group w-20 h-20 rounded-full bg-muted flex items-center justify-center overflow-hidden border-2 border-primary/20 hover:border-primary transition-colors">
          {uploading ? (
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          ) : avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <User className="w-8 h-8 text-primary" />
          )}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="w-6 h-6 text-white" />
          </div>
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={handleAvatarUpload} 
            disabled={uploading}
          />
        </label>
        <div>
          <p className="font-display font-semibold text-lg text-foreground">{displayName || "User"}</p>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        <div>
          <Label>Full Name</Label>
          <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} maxLength={50} placeholder="Your legal name" />
          <p className="text-[10px] text-muted-foreground mt-1 ml-1">Use your official name. Fake names are not allowed.</p>
        </div>
        <div>
          <Label>Username</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">@</span>
            <Input className="pl-7" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username" maxLength={30} />
          </div>
          <p className="text-[10px] text-muted-foreground mt-1 ml-1">This is how you appear on the network.</p>
        </div>
        <div>
          <Label>Phone</Label>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Optional" maxLength={20} />
        </div>
        
        <div className="pt-2">
          <Label className="text-muted-foreground opacity-70">LPU Registration Number</Label>
          <div className="h-11 flex items-center px-4 bg-muted/30 border border-border/40 rounded-xl text-foreground/60 font-mono text-sm">
            {(profile as any)?.registration_number || user?.user_metadata?.registration_number || "N/A"}
          </div>
          <p className="text-[10px] text-muted-foreground mt-1.5 ml-1">This is tied to your account for identity verification.</p>
        </div>
        


        <Button onClick={handleSave} disabled={saving} className="w-full mt-6 rounded-xl font-bold h-11">
          {saving ? "Saving..." : "Save Profile Changes"}
        </Button>
      </div>

      <div className="space-y-3">
        <Button 
          variant="outline" 
          className="w-full h-11 rounded-xl text-muted-foreground border-border/60 hover:bg-muted font-medium"
          onClick={() => window.open("/terms", "_blank")}
        >
          Terms & Conditions
        </Button>

        <Button 
          variant="outline" 
          className="w-full h-11 rounded-xl text-muted-foreground border-border/60 hover:bg-muted font-medium"
          onClick={() => toast({ title: "Need Help?", description: "Contact campus helpdesk at help@qivaro.lpu.in" })}
        >
          Help & Support
        </Button>
      
        <Button variant="outline" className="w-full text-destructive h-11 rounded-xl border-destructive/20 hover:bg-destructive/10 hover:text-destructive font-bold" onClick={signOut}>
          <LogOut className="w-4 h-4 mr-2" /> Sign Out
        </Button>
      </div>
    </div>
  );
};

export default ProfilePage;
