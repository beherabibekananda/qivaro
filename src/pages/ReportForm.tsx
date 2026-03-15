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
  const [serialNumber, setSerialNumber] = useState("");
  const [contactInfo, setContactInfo] = useState("");
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
      serial_number: serialNumber || null, contact_info: contactInfo || null,
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
    <div className="min-h-screen bg-background pb-20">
      {/* Sticky Header */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="px-4 py-4 sticky top-0 bg-background/80 backdrop-blur-md z-40 border-b border-border/40 flex items-center gap-3"
      >
        <button 
          onClick={() => navigate(-1)} 
          className="w-10 h-10 rounded-full border border-border/50 bg-card flex items-center justify-center hover:bg-muted transition-colors shrink-0"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">
            Report {isLost ? "Lost" : "Found"} Item
          </h1>
          <p className="text-xs text-muted-foreground">
            {isLost ? "Help us match your lost item." : "Help return this to its owner."}
          </p>
        </div>
      </motion.div>

      <motion.form 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        onSubmit={handleSubmit} 
        className="px-4 pt-6 space-y-6 max-w-2xl mx-auto"
      >
        {/* CARD 1: Basic Identity */}
        <motion.div variants={itemVariants} className="bg-card border border-border/40 rounded-[2rem] p-6 shadow-sm relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[40px] pointer-events-none" />
           <h2 className="text-lg font-bold font-display tracking-tight text-foreground mb-4 flex items-center gap-2">
             <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs">1</span>
             What is it?
           </h2>
           
           <div className="space-y-4 relative z-10">
             <div>
               <Label className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Photo</Label>
               <label className="mt-1.5 flex flex-col items-center justify-center w-full h-44 rounded-2xl border-2 border-dashed border-border/60 bg-muted/20 cursor-pointer hover:border-primary/50 hover:bg-muted/40 transition-all overflow-hidden relative group/photo">
                 {photoPreview ? (
                   <>
                     <motion.img 
                       initial={{ scale: 0.9 }}
                       animate={{ scale: 1 }}
                       src={photoPreview} 
                       alt="Preview" 
                       className="w-full h-full object-cover" 
                     />
                     <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                       <span className="text-white text-xs font-bold font-display px-3 py-1.5 bg-black/50 rounded-full">Change Photo</span>
                     </div>
                   </>
                 ) : (
                   <div className="flex flex-col items-center gap-2 text-muted-foreground">
                     <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-1 group-hover/photo:scale-110 transition-transform">
                         <Camera className="w-6 h-6 text-primary" />
                     </div>
                     <span className="text-xs font-medium">Upload a clear photo</span>
                   </div>
                 )}
                 <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
               </label>
             </div>

             <div>
               <Label htmlFor="title" className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Item Name</Label>
               <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Blue AirPods case" required maxLength={100} className="rounded-xl h-11 mt-1.5 bg-background shadow-xs" />
             </div>

             <div>
               <Label htmlFor="category" className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Category</Label>
               <div className="mt-1.5">
                 <Select value={category} onValueChange={(v) => setCategory(v as ItemCategory)}>
                   <SelectTrigger className="rounded-xl h-11 bg-background shadow-xs"><SelectValue /></SelectTrigger>
                   <SelectContent className="rounded-xl">
                     {categories.map((c) => (
                       <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                     ))}
                   </SelectContent>
                 </Select>
               </div>
             </div>
           </div>
        </motion.div>

        {/* CARD 2: Features */}
        <motion.div variants={itemVariants} className="bg-card border border-border/40 rounded-[2rem] p-6 shadow-sm relative overflow-hidden group">
           <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/5 rounded-full blur-[40px] pointer-events-none" />
           <h2 className="text-lg font-bold font-display tracking-tight text-foreground mb-4 flex items-center gap-2">
             <span className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs">2</span>
             Distinctive Features
           </h2>

           <div className="space-y-4 relative z-10">
             <div className="grid grid-cols-2 gap-4">
               <div>
                 <Label htmlFor="brand" className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Brand</Label>
                 <Input id="brand" value={brand} onChange={(e) => setBrand(e.target.value)} placeholder={category === "electronics" ? "e.g. Apple, Samsung" : "e.g. Nike"} maxLength={50} className="rounded-xl h-11 mt-1.5 bg-background shadow-xs" />
               </div>
               <div>
                 <Label htmlFor="color" className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Primary Color</Label>
                 <Input id="color" value={color} onChange={(e) => setColor(e.target.value)} placeholder="e.g. Space Gray, Black" maxLength={30} className="rounded-xl h-11 mt-1.5 bg-background shadow-xs" />
               </div>
             </div>

             {/* Dynamic Fields for Electronics / Phones */}
             {(category === "electronics") && (
               <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                 <Label htmlFor="serialNumber" className="text-muted-foreground text-xs uppercase tracking-wider font-semibold text-primary">Device IMEI / Serial Number</Label>
                 <Input id="serialNumber" value={serialNumber} onChange={(e) => setSerialNumber(e.target.value)} placeholder="Critical for precise matching." maxLength={100} className="rounded-xl h-11 mt-1.5 bg-background shadow-xs border-primary/40 focus-visible:ring-primary/50" />
                 <p className="text-[10px] text-muted-foreground mt-1.5">Entering the exact IMEI or Serial Number almost guarantees a match if someone else reports it.</p>
               </motion.div>
             )}

             <div>
               <Label htmlFor="description" className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Description & Identifiers</Label>
               <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder={category === "electronics" ? "Mention Lock Screen wallpaper, phone case details, specific dents, etc." : "Any unique marks, specific details..."} maxLength={500} rows={3} className="rounded-xl resize-none mt-1.5 bg-background shadow-xs" />
             </div>
           </div>
        </motion.div>

        {/* CARD 3: Location */}
        <motion.div variants={itemVariants} className="bg-card border border-border/40 rounded-[2rem] p-6 shadow-sm relative overflow-hidden group">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-warning/5 rounded-full blur-[40px] pointer-events-none" />
           <h2 className="text-lg font-bold font-display tracking-tight text-foreground mb-4 flex items-center gap-2">
             <span className="w-6 h-6 rounded-full bg-warning/20 text-warning flex items-center justify-center text-xs">3</span>
             {isLost ? "Where was it lost?" : "Where was it found?"}
           </h2>

           <div className="relative z-10">
             <Label htmlFor="location" className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Location</Label>
             <div className="mt-1.5">
               <Input 
                 id="location" 
                 value={location} 
                 onChange={(e) => setLocation(e.target.value)} 
                 placeholder={isLost ? "e.g. Near the Central Library entrance" : "e.g. 2nd floor of Science Building"} 
                 required 
                 maxLength={100} 
                 className="rounded-xl h-12 bg-background shadow-xs text-base" 
               />
             </div>
           </div>
        </motion.div>

        {/* CARD 4: Contact & Identity */}
        <motion.div variants={itemVariants} className="bg-card border border-border/40 rounded-[2rem] p-6 shadow-sm relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[40px] pointer-events-none" />
           <h2 className="text-lg font-bold font-display tracking-tight text-foreground mb-4 flex items-center gap-2">
             <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs">4</span>
             Contact Details
           </h2>

           <div className="relative z-10 space-y-4">
             <div>
               <Label htmlFor="contactInfo" className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Phone Number / Backup Email</Label>
               <Input 
                  id="contactInfo" 
                  value={contactInfo} 
                  required
                  onChange={(e) => setContactInfo(e.target.value)} 
                  placeholder="e.g. +91 9876543210 (Visible only to matched user)" 
                  maxLength={100} 
                  className="rounded-xl h-11 mt-1.5 bg-background shadow-xs" 
                />
             </div>
             <p className="text-xs text-muted-foreground leading-relaxed">
               This contact information will be safely secured and *only* shared directly with the other user if a 100% verified match occurs with your item.
             </p>
           </div>
        </motion.div>

        {/* Submit */}
        <motion.div variants={itemVariants} className="pt-2 sticky bottom-6 z-50">
          <Button 
            type="submit" 
            className="w-full h-14 rounded-2xl font-bold font-display text-lg shadow-[0_8px_32px_hsl(var(--primary)/0.25)] hover:shadow-[0_12px_40px_hsl(var(--primary)/0.35)] transition-all hover:-translate-y-1" 
            disabled={loading || !location}
          >
            {loading ? "Submitting..." : `Submit ${isLost ? 'Lost' : 'Found'} Report`}
          </Button>
        </motion.div>
      </motion.form>
    </div>
  );
};

export default ReportForm;
