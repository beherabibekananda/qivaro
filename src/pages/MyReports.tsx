import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Report = Tables<"reports">;

const MyReports = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    supabase
      .from("reports")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => setReports(data || []));
  }, [user]);

  const lost = reports.filter((r) => r.type === "lost");
  const found = reports.filter((r) => r.type === "found");

  const ReportCard = ({ report }: { report: Report }) => (
    <button
      onClick={() => navigate(`/report-detail/${report.id}`)}
      className="w-full bg-card border border-border rounded-xl p-4 flex gap-3 text-left hover:shadow-sm transition-shadow"
    >
      {report.photo_url ? (
        <img src={report.photo_url} alt="" className="w-14 h-14 rounded-lg object-cover shrink-0" />
      ) : (
        <div className="w-14 h-14 rounded-lg bg-muted flex items-center justify-center shrink-0 text-xl">📦</div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <p className="font-medium text-sm text-foreground truncate">{report.title}</p>
          <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ml-2 ${
            report.status === "open" ? "bg-primary/10 text-primary" :
            report.status === "matched" ? "bg-warning/10 text-warning" :
            "bg-accent/10 text-accent"
          }`}>
            {report.status}
          </span>
        </div>
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <MapPin className="w-3 h-3" /> {report.location}
        </p>
      </div>
    </button>
  );

  return (
    <div className="px-4 pt-6">
      <h1 className="font-display text-2xl font-bold mb-4 text-foreground">My Reports</h1>

      <Tabs defaultValue="lost" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="lost" className="flex-1">Lost ({lost.length})</TabsTrigger>
          <TabsTrigger value="found" className="flex-1">Found ({found.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="lost" className="space-y-3 mt-4 pb-8">
          {lost.length === 0 && <p className="text-center text-muted-foreground text-sm py-8">No lost reports yet</p>}
          {lost.map((r) => <ReportCard key={r.id} report={r} />)}
        </TabsContent>
        <TabsContent value="found" className="space-y-3 mt-4 pb-8">
          {found.length === 0 && <p className="text-center text-muted-foreground text-sm py-8">No found reports yet</p>}
          {found.map((r) => <ReportCard key={r.id} report={r} />)}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyReports;
