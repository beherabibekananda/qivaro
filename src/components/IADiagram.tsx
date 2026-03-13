import SectionHeader from "./SectionHeader";
import { Home, Camera, Search, FileText, Bell, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface IANodeProps {
  icon: React.ReactNode;
  title: string;
  children: string[];
  accentClass?: string;
}

const IANode = ({ icon, title, children, accentClass = "border-primary/20" }: IANodeProps) => (
  <div className={cn("bg-surface rounded-xl border shadow-sm overflow-hidden flex-1 min-w-[200px]", accentClass)}>
    <div className="px-5 py-4 border-b border-border/50 flex items-center gap-2">
      {icon}
      <h4 className="font-display font-semibold text-sm text-foreground">{title}</h4>
    </div>
    <ul className="px-5 py-3 space-y-2">
      {children.map((item) => (
        <li key={item} className="text-xs text-muted-foreground font-body flex items-start gap-2">
          <span className="w-1 h-1 rounded-full bg-connector mt-1.5 shrink-0" />
          {item}
        </li>
      ))}
    </ul>
  </div>
);

const IADiagram = () => {
  return (
    <section className="py-20 px-4 bg-card/50">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          badge="Information Architecture"
          title="App Structure"
          subtitle="A clear hierarchy connecting the five core areas of SafeFindr."
        />

        {/* Root node */}
        <div className="flex justify-center mb-6">
          <div className="bg-primary text-primary-foreground rounded-xl px-8 py-4 shadow-md flex items-center gap-3">
            <Home className="w-5 h-5" />
            <span className="font-display font-bold text-base">Home Screen</span>
          </div>
        </div>

        {/* Connector lines */}
        <div className="flex justify-center mb-6">
          <div className="w-px h-8 bg-connector" />
        </div>
        <div className="hidden md:flex justify-center mb-6 px-12">
          <div className="w-full max-w-4xl h-px bg-connector relative">
            {[0, 25, 50, 75, 100].map((pct) => (
              <div
                key={pct}
                className="absolute top-0 w-px h-6 bg-connector"
                style={{ left: `${pct}%` }}
              />
            ))}
          </div>
        </div>

        {/* IA Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <IANode
            icon={<Camera className="w-4 h-4 text-warning" />}
            title="Report Lost"
            accentClass="border-warning/30"
          >
            {["Upload photo", "Add description", "Select category", "Choose last seen location", "Submit report"]}
          </IANode>

          <IANode
            icon={<Camera className="w-4 h-4 text-accent" />}
            title="Report Found"
            accentClass="border-accent/30"
          >
            {["Upload photo", "Add found location", "Add description", "Submit report"]}
          </IANode>

          <IANode
            icon={<Search className="w-4 h-4 text-primary" />}
            title="Search Items"
            accentClass="border-primary/30"
          >
            {["Filter by category", "Filter by location", "View possible matches"]}
          </IANode>

          <IANode
            icon={<FileText className="w-4 h-4 text-primary" />}
            title="My Reports"
            accentClass="border-primary/30"
          >
            {["Lost items", "Found items"]}
          </IANode>

          <IANode
            icon={<Bell className="w-4 h-4 text-primary" />}
            title="Notifications"
            accentClass="border-primary/30"
          >
            {["Match alerts", "Messages"]}
          </IANode>
        </div>

        {/* Profile — separate row */}
        <div className="flex justify-center mt-6">
          <div className="max-w-xs w-full">
            <IANode
              icon={<User className="w-4 h-4 text-muted-foreground" />}
              title="Profile"
              accentClass="border-border"
            >
              {["Personal information", "My activity", "Privacy settings"]}
            </IANode>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IADiagram;
