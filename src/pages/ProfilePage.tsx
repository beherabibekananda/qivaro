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
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isVerified, setIsVerified] = useState(false); // Mock state for verification

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("*").eq("user_id", user.id).single().then(({ data }) => {
      if (data) {
        setProfile(data);
        setDisplayName(data.display_name || "");
        setUsername(data.username || "");
        setPhone(data.phone || "");
        if (data.avatar_url) {
          // Check if it's already a full URL, or just a path
          if (data.avatar_url.startsWith("http")) {
            setAvatarUrl(data.avatar_url);
          } else {
            const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(data.avatar_url);
            setAvatarUrl(publicUrl);
          }
        }
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

  const handleDigiLockerVerification = () => {
    toast({ 
      title: "Redirecting to DigiLocker...", 
      description: "You will be redirected to securely verify your Aadhaar or PAN." 
    });
    
    // Simulate API redirect delay
    setTimeout(() => {
      window.open("https://www.digilocker.gov.in/", "_blank");
      // In a real flow, the user would return with an auth token and we'd set this to true
      // setIsVerified(true);
    }, 1500);
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
        
        {/* Identity Verification Section */}
        <div className="pt-4 pb-2 border-t border-border mt-6">
          <h3 className="text-lg font-display font-semibold mb-4 text-foreground flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Identity Verification
          </h3>
          
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 mb-4">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="font-semibold text-foreground flex items-center gap-2">
                  Document Verification
                  {isVerified ? (
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Verified
                    </span>
                  ) : (
                    <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-full">
                      Pending
                    </span>
                  )}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Verify your identity using Aadhaar or PAN through DigiLocker to build trust within the community.
                </p>
              </div>
            </div>
            
            <Button 
              type="button" 
              variant={isVerified ? "outline" : "default"} 
              className="w-full sm:w-auto flex items-center gap-2"
              onClick={handleDigiLockerVerification}
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/e/e9/DigiLocker_logo.svg" alt="DigiLocker" className="h-4 mr-1 opacity-90" />
              {isVerified ? "Update Verification" : "Verify with DigiLocker"}
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
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
      
        <Button variant="outline" className="w-full text-destructive h-11 rounded-xl border-destructive/20 hover:bg-destructive/10 hover:text-destructive font-bold" onClick={signOut}>
          <LogOut className="w-4 h-4 mr-2" /> Sign Out
        </Button>
      </div>
    </div>
  );
};

export default ProfilePage;
