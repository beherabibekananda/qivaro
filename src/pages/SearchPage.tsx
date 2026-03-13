import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search as SearchIcon, MapPin } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Report = Tables<"reports">;

const categories = [
  { value: "all", label: "All Categories" },
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

const SearchPage = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "lost" | "found">("all");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      let q = supabase.from("reports").select("*").eq("status", "open").order("created_at", { ascending: false });

      if (categoryFilter !== "all") {
        q = q.eq("category", categoryFilter as Report["category"]);
      }
      if (typeFilter !== "all") {
        q = q.eq("type", typeFilter);
      }
      if (query.trim()) {
        q = q.or(`title.ilike.%${query}%,description.ilike.%${query}%`);
      }

      const { data } = await q.limit(50);
      setReports(data || []);
    };

    fetchReports();
  }, [query, categoryFilter, typeFilter]);

  return (
    <div className="px-4 pt-6">
      <h1 className="font-display text-2xl font-bold mb-4 text-foreground">Search Items</h1>

      {/* Search bar */}
      <div className="relative mb-4">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or description..."
          className="pl-9"
        />
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as typeof typeFilter)}>
          <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="lost">Lost</SelectItem>
            <SelectItem value="found">Found</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="flex-1"><SelectValue /></SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results */}
      <div className="space-y-3 pb-8">
        {reports.length === 0 && (
          <p className="text-center text-muted-foreground text-sm py-12">No items found</p>
        )}
        {reports.map((report) => (
          <button
            key={report.id}
            onClick={() => navigate(`/report-detail/${report.id}`)}
            className="w-full bg-card border border-border rounded-xl p-4 flex gap-3 text-left hover:shadow-sm transition-shadow"
          >
            {report.photo_url ? (
              <img src={report.photo_url} alt="" className="w-16 h-16 rounded-lg object-cover shrink-0" />
            ) : (
              <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <span className="text-2xl">📦</span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${report.type === "lost" ? "bg-warning/10 text-warning" : "bg-accent/10 text-accent"}`}>
                  {report.type === "lost" ? "Lost" : "Found"}
                </span>
                <span className="text-xs text-muted-foreground capitalize">{report.category.replace("_", " ")}</span>
              </div>
              <p className="font-medium text-sm text-foreground truncate">{report.title}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <MapPin className="w-3 h-3" /> {report.location}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
