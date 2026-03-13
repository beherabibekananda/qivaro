import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, MapPin, Calendar, Tag, Palette, Award } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Report = Tables<"reports">;
type Match = Tables<"matches">;

const ReportDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [report, setReport] = useState<Report | null>(null);
  const [matches, setMatches] = useState<(Match & { matchedReport: Report })[]>([]);

  useEffect(() => {
    if (!id) return;

    supabase.from("reports").select("*").eq("id", id).single().then(({ data }) => {
      setReport(data);
    });

    // Fetch matches for this report
    const fetchMatches = async () => {
      const { data: matchData } = await supabase
        .from("matches")
        .select("*")
        .or(`lost_report_id.eq.${id},found_report_id.eq.${id}`)
        .order("score", { ascending: false });

      if (matchData && matchData.length > 0) {
        const otherIds = matchData.map((m) =>
          m.lost_report_id === id ? m.found_report_id : m.lost_report_id
        );
        const { data: otherReports } = await supabase
          .from("reports")
          .select("*")
          .in("id", otherIds);

        const enriched = matchData.map((m) => ({
          ...m,
          matchedReport: (otherReports || []).find(
            (r) => r.id === (m.lost_report_id === id ? m.found_report_id : m.lost_report_id)
          )!,
        })).filter((m) => m.matchedReport);

        setMatches(enriched);
      }
    };

    fetchMatches();
  }, [id]);

  const handleResolve = async () => {
    if (!report) return;
    await supabase.from("reports").update({ status: "resolved" }).eq("id", report.id);
    toast({ title: "Report resolved!" });
    setReport({ ...report, status: "resolved" });
  };

  if (!report) return <div className="px-4 pt-6 text-center text-muted-foreground">Loading...</div>;

  const isOwner = user?.id === report.user_id;

  return (
    <div className="px-4 pt-6 pb-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-muted-foreground text-sm mb-4 hover:text-foreground">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      {/* Photo */}
      {report.photo_url && (
        <img src={report.photo_url} alt={report.title} className="w-full h-48 object-cover rounded-xl mb-4" />
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${report.type === "lost" ? "bg-warning/10 text-warning" : "bg-accent/10 text-accent"}`}>
              {report.type === "lost" ? "Lost" : "Found"}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              report.status === "open" ? "bg-primary/10 text-primary" :
              report.status === "matched" ? "bg-warning/10 text-warning" :
              "bg-accent/10 text-accent"
            }`}>
              {report.status}
            </span>
          </div>
          <h1 className="font-display text-xl font-bold text-foreground">{report.title}</h1>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-3 mb-6">
        {report.description && <p className="text-sm text-muted-foreground">{report.description}</p>}
        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {report.location}</span>
          <span className="flex items-center gap-1"><Tag className="w-3.5 h-3.5" /> {report.category.replace("_", " ")}</span>
          {report.color && <span className="flex items-center gap-1"><Palette className="w-3.5 h-3.5" /> {report.color}</span>}
          {report.brand && <span className="flex items-center gap-1"><Award className="w-3.5 h-3.5" /> {report.brand}</span>}
          <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(report.created_at).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Matches */}
      {matches.length > 0 && (
        <div className="mb-6">
          <h2 className="font-display font-semibold text-foreground mb-3">Possible Matches ({matches.length})</h2>
          <div className="space-y-3">
            {matches.map((m) => (
              <button
                key={m.id}
                onClick={() => navigate(`/report-detail/${m.matchedReport.id}`)}
                className="w-full bg-card border border-border rounded-xl p-3 flex gap-3 text-left hover:shadow-sm transition-shadow"
              >
                {m.matchedReport.photo_url ? (
                  <img src={m.matchedReport.photo_url} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0" />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center shrink-0 text-lg">📦</div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-foreground truncate">{m.matchedReport.title}</p>
                  <p className="text-xs text-muted-foreground">{m.matchedReport.location}</p>
                </div>
                <span className="text-xs font-medium text-primary shrink-0">{m.score}% match</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      {isOwner && report.status === "open" && (
        <Button onClick={handleResolve} className="w-full">Mark as Resolved</Button>
      )}
    </div>
  );
};

export default ReportDetail;
