import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Camera, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import type { Database } from "@/integrations/supabase/types";

type ItemCategory = Database["public"]["Enums"]["item_category"];

const categories: { value: ItemCategory; label: string }[] = [
  { value: "electronics", label: "Electronics" },
  { value: "clothing", label: "Clothing" },
  { value: "accessories", label: "Accessories" },
  { value: "books", label: "Books" },
  { value: "keys", label: "Keys" },
  { value: "wallet", label: "Wallet" },
  { value: "bag", label: "Bag" },
  { value: "id_card", label: "ID Card" },
  { value: "sports", label: "Sports Equipment" },
  { value: "other", label: "Other" },
];

const campusLocations = [
  "Library", "Student Center", "Cafeteria", "Gym", "Science Building", 
  "Arts Building", "Engineering Building", "Parking Lot A", "Parking Lot B", 
  "Sports Field", "Dorm - North", "Dorm - South", "Main Quad", "Admin Building", "Other"
];

const ReportForm = () => {
  const { type } = useParams<{ type: "lost" | "found" }>();
  const reportType = type === "found" ? "found" : "lost";
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<ItemCategory>("other");
  const [brand, setBrand] = useState("");
  const [color, setColor] = useState("");
  const [location, setLocation] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    let photoUrl: string | null = null;
    if (photo) {
      const ext = photo.name.split(".").pop();
      const path = `${user.id}/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from("item-photos").upload(path, photo);
      if (uploadError) {
        toast({ title: "Photo upload failed", description: uploadError.message, variant: "destructive" });
        setLoading(false);
        return;
      }
      const { data: urlData } = supabase.storage.from("item-photos").getPublicUrl(path);
      photoUrl = urlData.publicUrl;
    }

    const { data: report, error } = await supabase.from("reports").insert({
      user_id: user.id, type: reportType, title, description, category,
      brand: brand || null, color: color || null, location, photo_url: photoUrl,
    }).select().single();

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }
    if (report) await supabase.rpc("find_matches_for_report", { report_id: report.id });
    toast({ title: "Report submitted!", description: "We'll notify you if there's a match." });
    navigate("/my-reports");
    setLoading(false);
  };

  const isLost = reportType === "lost";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="px-4 pt-6"
    >
      <motion.button 
        variants={itemVariants}
        onClick={() => navigate(-1)} 
        className="flex items-center gap-1 text-muted-foreground text-sm mb-4 hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </motion.button>

      <motion.h1 variants={itemVariants} className="font-display text-2xl font-bold mb-1 text-foreground">
        Report {isLost ? "Lost" : "Found"} Item
      </motion.h1>
      <motion.p variants={itemVariants} className="text-sm text-muted-foreground mb-6">
        {isLost ? "Describe what you lost so we can match it." : "Help return this item to its owner."}
      </motion.p>

      <motion.form variants={itemVariants} onSubmit={handleSubmit} className="space-y-4 pb-8">
        <motion.div variants={itemVariants}>
          <Label>Photo</Label>
          <label className="mt-1 flex flex-col items-center justify-center w-full h-44 rounded-2xl border-2 border-dashed border-border bg-muted/30 cursor-pointer hover:border-primary/50 transition-all overflow-hidden relative">
            {photoPreview ? (
              <motion.img 
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                src={photoPreview} 
                alt="Preview" 
                className="w-full h-full object-cover" 
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-1">
                    <Camera className="w-6 h-6 text-primary" />
                </div>
                <span className="text-xs font-medium">Upload a clear photo</span>
              </div>
            )}
            <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
          </label>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Label htmlFor="title">Item name</Label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Blue AirPods case" required maxLength={100} className="rounded-xl h-11" />
        </motion.div>

        <motion.div variants={itemVariants}>
          <Label htmlFor="category">Category</Label>
          <Select value={category} onValueChange={(v) => setCategory(v as ItemCategory)}>
            <SelectTrigger className="rounded-xl h-11"><SelectValue /></SelectTrigger>
            <SelectContent className="rounded-xl">
              {categories.map((c) => (
                <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Any unique marks, serial numbers, etc." maxLength={500} rows={3} className="rounded-xl resize-none" />
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="brand">Brand</Label>
            <Input id="brand" value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="e.g. Apple" maxLength={50} className="rounded-xl h-11" />
          </div>
          <div>
            <Label htmlFor="color">Color</Label>
            <Input id="color" value={color} onChange={(e) => setColor(e.target.value)} placeholder="e.g. Space Gray" maxLength={30} className="rounded-xl h-11" />
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Label htmlFor="location">{isLost ? "Last seen location" : "Found location"}</Label>
          <Select value={location} onValueChange={setLocation} required>
            <SelectTrigger className="rounded-xl h-11"><SelectValue placeholder="Select location" /></SelectTrigger>
            <SelectContent className="rounded-xl">
              {campusLocations.map((loc) => (
                <SelectItem key={loc} value={loc}>{loc}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        <motion.div variants={itemVariants} className="pt-2">
          <Button type="submit" className="w-full h-12 rounded-xl font-bold shadow-lg shadow-primary/20" disabled={loading || !location}>
            {loading ? "Submitting..." : `Submit ${isLost ? 'Lost' : 'Found'} Report`}
          </Button>
        </motion.div>
      </motion.form>
    </motion.div>
  );
};

export default ReportForm;
