import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Search as SearchIcon,
  MapPin,
  Filter,
  ArrowUpDown,
  Calendar,
  Smartphone,
  Laptop,
  Headphones,
  Zap,
  Tablet,
  Watch,
  Wallet,
  Key,
  Sun,
  Briefcase,
  BookOpen,
  Book,
  FileText,
  Calculator,
  CreditCard,
  Pencil,
  Shirt,
  Wind,
  Droplets,
  Umbrella,
  Grid3X3,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import type { Tables } from "@/integrations/supabase/types";

type Report = Tables<"reports">;

const searchCategories = [
  {
    id: "electronics",
    name: "Electronics",
    icon: <Smartphone className="w-5 h-5" />,
    dbValue: "electronics",
    subcategories: [
      { name: "Phone", icon: <Smartphone className="w-4 h-4" /> },
      { name: "Laptop", icon: <Laptop className="w-4 h-4" /> },
      { name: "Earbuds", icon: <Headphones className="w-4 h-4" /> },
      { name: "Chargers", icon: <Zap className="w-4 h-4" /> },
      { name: "Tablets", icon: <Tablet className="w-4 h-4" /> },
      { name: "Smartwatch", icon: <Watch className="w-4 h-4" /> },
    ],
  },
  {
    id: "accessories",
    name: "Accessories",
    icon: <Briefcase className="w-5 h-5" />,
    dbValue: "accessories",
    subcategories: [
      { name: "Wallet", icon: <Wallet className="w-4 h-4" />, dbValue: "wallet" },
      { name: "Keys", icon: <Key className="w-4 h-4" />, dbValue: "keys" },
      { name: "Sunglasses", icon: <Sun className="w-4 h-4" /> },
      { name: "Watches", icon: <Watch className="w-4 h-4" /> },
      { name: "Bags", icon: <Briefcase className="w-4 h-4" />, dbValue: "bag" },
    ],
  },
  {
    id: "academic",
    name: "Academic Items",
    icon: <BookOpen className="w-5 h-5" />,
    dbValue: "books",
    subcategories: [
      { name: "Notebooks", icon: <Book className="w-4 h-4" /> },
      { name: "Textbooks", icon: <BookOpen className="w-4 h-4" /> },
      { name: "Calculators", icon: <Calculator className="w-4 h-4" /> },
      { name: "ID Cards", icon: <CreditCard className="w-4 h-4" />, dbValue: "id_card" },
      { name: "Stationery", icon: <Pencil className="w-4 h-4" /> },
    ],
  },
  {
    id: "clothing",
    name: "Clothing",
    icon: <Shirt className="w-5 h-5" />,
    dbValue: "clothing",
    subcategories: [
      { name: "Jackets", icon: <Shirt className="w-4 h-4" /> },
      { name: "Hoodies", icon: <Shirt className="w-4 h-4" /> },
      { name: "Caps", icon: <Wind className="w-4 h-4" /> },
      { name: "Scarves", icon: <Wind className="w-4 h-4" /> },
    ],
  },
  {
    id: "other",
    name: "Other Items",
    icon: <Grid3X3 className="w-5 h-5" />,
    dbValue: "other",
    subcategories: [
      { name: "Water Bottles", icon: <Droplets className="w-4 h-4" /> },
      { name: "Umbrellas", icon: <Umbrella className="w-4 h-4" /> },
      { name: "Miscellaneous", icon: <Grid3X3 className="w-4 h-4" /> },
    ],
  },
];

const SearchPage = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<"all" | "lost" | "found">("all");
  const [sortBy, setSortBy] = useState<"latest" | "oldest">("latest");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      const matchingCat = searchCategories.find(c => c.dbValue === categoryParam || c.id === categoryParam);
      if (matchingCat) {
        setSelectedCategory(matchingCat.id);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchReports = async () => {
      let q = supabase
        .from("reports")
        .select("*")
        .eq("status", "open")
        .order("created_at", { ascending: sortBy === "latest" ? false : true });

      if (typeFilter !== "all") {
        q = q.eq("type", typeFilter);
      }

      if (selectedSubcategory) {
        const catObj = searchCategories.find(c => c.id === selectedCategory);
        const subObj = catObj?.subcategories.find(s => s.name === selectedSubcategory);
        if (subObj?.dbValue) {
          q = q.eq("category", subObj.dbValue as any);
        } else {
          q = q.or(`title.ilike.%${selectedSubcategory}%,description.ilike.%${selectedSubcategory}%,category.ilike.%${selectedSubcategory}%`);
        }
      } else if (selectedCategory) {
        const catObj = searchCategories.find(c => c.id === selectedCategory);
        if (catObj?.dbValue) {
          q = q.eq("category", catObj.dbValue as any);
        }
      }

      if (debouncedQuery.trim()) {
        q = q.or(`title.ilike.%${debouncedQuery}%,description.ilike.%${debouncedQuery}%`);
      }

      const { data } = await q.limit(50);
      setReports(data || []);
    };

    fetchReports();
  }, [debouncedQuery, selectedCategory, selectedSubcategory, typeFilter, sortBy]);

  const handleSubcategoryClick = (subName: string) => {
    setSelectedSubcategory(subName === selectedSubcategory ? null : subName);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Top Section */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="px-4 pt-6 pb-4 sticky top-0 bg-background/80 backdrop-blur-lg z-40 border-b border-border/40"
      >
        <h1 className="font-display text-2xl font-bold mb-4 text-foreground tracking-tight">Search Items</h1>
        
        <div className="flex flex-col gap-3">
          <div className="relative group">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search lost or found items"
              className="pl-10 h-11 bg-muted/30 border-none rounded-2xl focus-visible:ring-1 focus-visible:ring-primary shadow-sm"
            />
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
              <Button 
                variant={typeFilter === "all" ? "default" : "outline"} 
                size="sm" 
                className="rounded-full h-8 px-4 text-xs font-medium transition-all"
                onClick={() => setTypeFilter("all")}
              >
                All
              </Button>
              <Button 
                variant={typeFilter === "lost" ? "default" : "outline"} 
                size="sm" 
                className="rounded-full h-8 px-4 text-xs font-medium transition-all border-warning/30 hover:bg-warning/10"
                onClick={() => setTypeFilter("lost")}
              >
                Lost
              </Button>
              <Button 
                variant={typeFilter === "found" ? "default" : "outline"} 
                size="sm" 
                className="rounded-full h-8 px-4 text-xs font-medium transition-all border-accent/30 hover:bg-accent/10"
                onClick={() => setTypeFilter("found")}
              >
                Found
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="h-8 w-8 rounded-full border-border/60">
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-xl">
                  <DropdownMenuItem onClick={() => setSortBy("latest")}>Latest First</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("oldest")}>Oldest First</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="outline" size="icon" className="h-8 w-8 rounded-full border-border/60">
                <Filter className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="px-4 pb-24">
        {/* Categories Section */}
        {!selectedCategory ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-6"
          >
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-1">Categories</h2>
            <div className="grid grid-cols-2 gap-3">
              {searchCategories.map((cat, index) => (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <button 
                    onClick={() => {
                        setSelectedCategory(cat.id);
                        navigate(`/search?category=${cat.id}`, { replace: true });
                    }}
                    className="w-full flex items-center gap-3 p-3 lg:p-4 border border-border/40 rounded-2xl bg-card hover:border-primary/40 hover:shadow-sm transition-all text-left"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      {cat.icon}
                    </div>
                    <span className="font-medium text-sm text-foreground">{cat.name}</span>
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="py-4"
          >
             <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 px-1">
                 <button 
                   onClick={() => { 
                       setSelectedCategory(null); 
                       setSelectedSubcategory(null); 
                       navigate('/search', { replace: true }); 
                   }} 
                   className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border/60 bg-muted/30 text-xs font-semibold text-foreground hover:bg-muted/80 shrink-0 transition-colors"
                 >
                   <ChevronRight className="w-3.5 h-3.5 rotate-180" /> Categories
                 </button>
                 
                 {searchCategories.find(c => c.id === selectedCategory)?.subcategories.map((sub) => (
                    <button
                      key={sub.name}
                      onClick={() => handleSubcategoryClick(sub.name)}
                      className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border shrink-0",
                        selectedSubcategory === sub.name 
                          ? "bg-primary text-primary-foreground border-primary shadow-sm drop-shadow-sm" 
                          : "bg-card text-muted-foreground border-border/60 hover:border-primary/40 hover:text-foreground"
                      )}
                    >
                      <span className="opacity-80">{sub.icon}</span>
                      <span>{sub.name}</span>
                    </button>
                 ))}
             </div>
          </motion.div>
        )}

        {/* Results / Items Section */}
        <div className={cn("mt-4", selectedCategory && "pt-2")}>
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              {selectedSubcategory ? (
                <>
                  <span className="text-foreground">{searchCategories.find(c => c.id === selectedCategory)?.name || "Items"}</span>
                  <ChevronRight className="w-3 h-3 text-muted-foreground" />
                  <span className="text-primary font-medium">{selectedSubcategory}</span>
                </>
              ) : selectedCategory ? (
                <span className="text-foreground">{searchCategories.find(c => c.id === selectedCategory)?.name} Items</span>
              ) : (
                "Recent Items"
              )}
            </h3>
            <span className="text-[10px] bg-muted px-2 py-0.5 rounded-full text-muted-foreground font-mono">
              {reports.length} {reports.length === 1 ? 'item' : 'items'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
              {reports.length === 0 ? (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="col-span-full py-16 text-center"
                >
                  <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-sm max-w-sm mx-auto">
                    <h4 className="font-display font-bold text-foreground mb-2">Didn't find what you're looking for?</h4>
                    <p className="text-xs text-muted-foreground mb-6">Add the details of your item to our radar. We'll automatically notify you the second a match is found!</p>
                    
                    <div className="flex flex-col gap-3">
                      <Button 
                        onClick={() => navigate('/report/lost')}
                        className="w-full rounded-xl font-bold h-11 bg-warning hover:bg-warning/90 text-warning-foreground shadow-[0_4px_14px_hsl(var(--warning)/0.25)] transition-all hover:-translate-y-0.5"
                      >
                        Add Lost Item Details
                      </Button>
                      <Button 
                        onClick={() => navigate('/report/found')}
                        variant="outline"
                        className="w-full rounded-xl font-bold h-11 border-border/60 hover:bg-muted transition-all"
                      >
                        Register Found Item
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                reports.map((report, index) => (
                  <motion.button
                    layout
                    key={report.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(index * 0.03, 0.3) }}
                    onClick={() => navigate(`/report-detail/${report.id}`)}
                    className="group flex flex-col bg-card border border-border/50 rounded-2xl overflow-hidden text-left hover:shadow-lg hover:border-primary/30 transition-all duration-300"
                  >
                    <div className="relative aspect-[4/3] w-full bg-muted overflow-hidden">
                      {report.photo_url ? (
                        <img 
                          src={report.photo_url} 
                          alt={report.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted/50">
                          <Grid3X3 className="w-10 h-10 text-muted-foreground opacity-20" />
                        </div>
                      )}
                      <Badge 
                        className={cn(
                          "absolute top-3 left-3 shadow-md border-none px-3 py-1",
                          report.type === "lost" ? "bg-warning text-warning-foreground" : "bg-accent text-accent-foreground"
                        )}
                      >
                        {report.type === "lost" ? "LOST" : "FOUND"}
                      </Badge>
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <div className="flex items-center gap-1.5 mb-2">
                         <span className="text-[10px] font-bold text-primary/70 tracking-widest uppercase">
                          {report.category.replace("_", " ")}
                         </span>
                      </div>
                      <h4 className="font-bold text-sm text-foreground mb-3 line-clamp-1 group-hover:text-primary transition-colors">
                        {report.title}
                      </h4>
                      <div className="space-y-2 mt-auto">
                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                          <MapPin className="w-3.5 h-3.5 text-primary/60 shrink-0" />
                          <span className="truncate">{report.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                          <Calendar className="w-3.5 h-3.5 text-primary/60 shrink-0" />
                          <span>{new Date(report.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </motion.button>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
