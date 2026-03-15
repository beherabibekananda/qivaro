import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { 
  Shield, 
  Search as SearchIcon, 
  AlertTriangle, 
  CheckCircle, 
  User, 
  Bell,
  ChevronRight,
  Smartphone,
  Briefcase,
  BookOpen,
  Shirt,
  Grid3X3,
  Sparkles
} from "lucide-react";
import { motion } from "framer-motion";

const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, stiffness: 100, damping: 15 } }
  };

  const quickCategories = [
    { name: "Tech", icon: <Smartphone className="w-4 h-4" />, path: "/search?category=electronics" },
    { name: "Books", icon: <BookOpen className="w-4 h-4" />, path: "/search?category=books" },
    { name: "Bags", icon: <Briefcase className="w-4 h-4" />, path: "/search?category=accessories" },
    { name: "Clothes", icon: <Shirt className="w-4 h-4" />, path: "/search?category=clothing" },
    { name: "More", icon: <Grid3X3 className="w-4 h-4" />, path: "/search?category=other" },
  ];

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="px-5 pt-12 pb-32 max-w-2xl mx-auto relative min-h-screen overflow-hidden bg-background"
    >
      {/* GenZ Ambient Glowing Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-primary/20 rounded-full blur-[100px] pointer-events-none animate-pulse" />
      <div className="absolute top-[30%] right-[-20%] w-[50vw] h-[50vw] bg-accent/15 rounded-full blur-[120px] pointer-events-none" style={{ animation: "pulse 4s infinite alternate" }} />
      <div className="absolute bottom-[-10%] left-[20%] w-[40vw] h-[40vw] bg-purple-500/15 rounded-full blur-[100px] pointer-events-none" />

      {/* Noise Texture Overlay for GenZ Vibe */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      <div className="relative z-10">
        
        {/* Supa Sleek Header */}
        <motion.div variants={itemVariants} className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
             <div className="relative flex items-center justify-center w-12 h-12 rounded-xl overflow-hidden shrink-0 shadow-sm border border-foreground/5 bg-background">
                <img src="/qivaro-logo.webp" alt="Qivaro Logo" className="w-full h-full object-cover scale-110" />
             </div>
              <div>
               <h1 className="font-display text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-foreground to-foreground/50 tracking-tighter uppercase">Qivaro</h1>
               <p className="text-[10px] tracking-widest text-primary font-bold uppercase">Network</p>
             </div>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/profile')} className="w-10 h-10 rounded-full border border-border/50 bg-background/50 backdrop-blur-md flex items-center justify-center hover:bg-muted transition-all">
               <User className="w-4 h-4 text-foreground/80" />
            </button>
            <button onClick={() => navigate('/notifications')} className="w-10 h-10 rounded-full border border-border/50 bg-background/50 backdrop-blur-md flex items-center justify-center hover:bg-muted transition-all relative">
               <Bell className="w-4 h-4 text-foreground/80" />
               <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full animate-ping" />
               <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
            </button>
          </div>
        </motion.div>

        {/* Hero Welcome */}
        <motion.div variants={itemVariants} className="mb-10">

          <h2 className="text-5xl font-display font-black text-foreground tracking-tighter leading-[1.1]">
            Sup, {user?.user_metadata?.display_name?.split(' ')[0] || "anon"}?<br/>
            <span className="text-muted-foreground opacity-60">Lost something?</span>
          </h2>
        </motion.div>

        {/* Bento Grid Layout! */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          
          {/* Bento Cell: Search (Full Width) */}
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 0.98 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/search')}
            className="col-span-2 relative overflow-hidden group p-6 rounded-[2rem] bg-gradient-to-br from-card to-card/50 backdrop-blur-xl border border-border shadow-[0_8px_32px_rgba(0,0,0,0.05)] flex items-center justify-between"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="text-left relative z-10">
              <h3 className="text-2xl font-black font-display tracking-tight text-foreground mb-1">Search the void</h3>
              <p className="text-sm text-muted-foreground font-medium">Browse 1.2k+ items looking for home.</p>
            </div>
            <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-[0_0_30px_hsl(var(--primary)_/_0.4)] group-hover:scale-110 transition-transform relative z-10">
               <SearchIcon className="w-6 h-6 text-primary-foreground" />
            </div>
          </motion.button>

          {/* Bento Cell: Report Lost (Square) */}
          <motion.button
             variants={itemVariants}
             whileHover={{ scale: 0.95 }}
             whileTap={{ scale: 0.92 }}
             onClick={() => navigate('/report/lost')}
             className="relative p-6 rounded-[2rem] bg-card/50 backdrop-blur-xl border border-warning/20 overflow-hidden text-left flex flex-col justify-between aspect-square group shadow-sm"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-warning/20 rounded-full blur-[40px] group-hover:bg-warning/30 transition-colors" />
            <div className="w-12 h-12 rounded-2xl bg-warning/20 text-warning flex items-center justify-center mb-4 relative z-10">
               <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="relative z-10">
               <h3 className="text-xl font-black font-display tracking-tight text-foreground mb-1 group-hover:text-warning transition-colors">I lost<br/>an item</h3>
            </div>
          </motion.button>

          {/* Bento Cell: Report Found (Square) */}
          <motion.button
             variants={itemVariants}
             whileHover={{ scale: 0.95 }}
             whileTap={{ scale: 0.92 }}
             onClick={() => navigate('/report/found')}
             className="relative p-6 rounded-[2rem] bg-card/50 backdrop-blur-xl border border-accent/20 overflow-hidden text-left flex flex-col justify-between aspect-square group shadow-sm"
          >
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/20 rounded-full blur-[40px] group-hover:bg-accent/30 transition-colors" />
            <div className="w-12 h-12 rounded-2xl bg-accent/20 text-accent flex items-center justify-center mb-4 relative z-10">
               <CheckCircle className="w-6 h-6" />
            </div>
            <div className="relative z-10">
               <h3 className="text-xl font-black font-display tracking-tight text-foreground mb-1 group-hover:text-accent transition-colors">I found<br/>an item</h3>
            </div>
          </motion.button>
        </div>

        {/* Quick Tags GenZ style */}
        <motion.div variants={itemVariants} className="mb-10">
           <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4 pl-2 opacity-70">Explore Categories</h3>
           <div className="flex flex-wrap gap-2">
             {quickCategories.map((cat) => (
               <motion.button
                 key={cat.name}
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
                 onClick={() => navigate(cat.path)}
                 className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-card border border-border/50 backdrop-blur-sm shadow-sm hover:border-primary/50 transition-colors"
               >
                 <span className="text-foreground/70">{cat.icon}</span>
                 <span className="text-sm font-bold tracking-tight">{cat.name}</span>
               </motion.button>
             ))}
           </div>
        </motion.div>

        {/* Status Card */}
        <motion.div variants={itemVariants}>
          <button 
            onClick={() => navigate('/my-reports')}
            className="w-full relative overflow-hidden rounded-[2rem] p-6 bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-white/50 dark:border-white/10 group shadow-[var(--gentle-shadow)]"
          >
             <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
             <div className="relative z-10 flex items-center justify-between">
                <div className="text-left">
                  <div className="flex items-center gap-2 mb-2">
                     <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                     <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Your Radar</span>
                  </div>
                  <h4 className="text-2xl font-black font-display tracking-tight text-foreground group-hover:text-primary transition-colors">0 Active Cases</h4>
                </div>
                <div className="w-12 h-12 rounded-full border border-border/50 bg-background/50 flex items-center justify-center group-hover:bg-primary group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                  <ChevronRight className="w-5 h-5 text-foreground group-hover:text-primary-foreground transition-colors" />
                </div>
             </div>
          </button>
        </motion.div>

      </div>
    </motion.div>
  );
};

export default HomePage;
