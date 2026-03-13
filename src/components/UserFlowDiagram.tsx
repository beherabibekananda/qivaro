import FlowNode from "./FlowNode";
import FlowArrow from "./FlowArrow";
import SectionHeader from "./SectionHeader";
import { Camera, MapPin, FileText, Bell, CheckCircle, Search, Users } from "lucide-react";

const UserFlowDiagram = () => {
  return (
    <section className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <SectionHeader
          badge="User Flow"
          title="How SafeFindr Works"
          subtitle="A dual-path flow connecting item reporters with finders through smart photo matching."
        />

        {/* Dual flow layout */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 md:gap-4 items-start">
          {/* Lost Item Flow — Left */}
          <div className="flex flex-col items-center">
            <h3 className="font-display text-lg font-semibold text-warning mb-6 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-warning" />
              Report Lost Item
            </h3>

            <FlowNode variant="lost">
              <p className="font-medium">User loses an item</p>
            </FlowNode>
            <FlowArrow />

            <FlowNode variant="lost">
              <p className="font-medium">Opens SafeFindr app</p>
            </FlowNode>
            <FlowArrow />

            <FlowNode variant="lost">
              <p className="font-medium flex items-center gap-2"><FileText className="w-4 h-4 text-warning" /> Taps "Report Lost Item"</p>
            </FlowNode>
            <FlowArrow />

            <FlowNode variant="lost">
              <p className="font-medium flex items-center gap-2"><Camera className="w-4 h-4 text-warning" /> Uploads photo of item</p>
            </FlowNode>
            <FlowArrow />

            <FlowNode variant="lost">
              <p className="font-medium">Adds description</p>
              <p className="text-xs text-muted-foreground mt-1">Brand, color, category</p>
            </FlowNode>
            <FlowArrow />

            <FlowNode variant="lost">
              <p className="font-medium flex items-center gap-2"><MapPin className="w-4 h-4 text-warning" /> Selects last seen location</p>
            </FlowNode>
            <FlowArrow />

            <FlowNode variant="lost">
              <p className="font-medium">Report stored in database</p>
            </FlowNode>
          </div>

          {/* Center merge spine */}
          <div className="hidden md:flex flex-col items-center justify-end h-full pb-0">
            <div className="w-px flex-1 bg-connector/40" />
          </div>

          {/* Found Item Flow — Right */}
          <div className="flex flex-col items-center">
            <h3 className="font-display text-lg font-semibold text-accent mb-6 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-accent" />
              Report Found Item
            </h3>

            <FlowNode variant="found">
              <p className="font-medium">Another user finds the item</p>
            </FlowNode>
            <FlowArrow />

            <FlowNode variant="found">
              <p className="font-medium">Opens SafeFindr app</p>
            </FlowNode>
            <FlowArrow />

            <FlowNode variant="found">
              <p className="font-medium flex items-center gap-2"><FileText className="w-4 h-4 text-accent" /> Taps "Report Found Item"</p>
            </FlowNode>
            <FlowArrow />

            <FlowNode variant="found">
              <p className="font-medium flex items-center gap-2"><Camera className="w-4 h-4 text-accent" /> Uploads photo</p>
            </FlowNode>
            <FlowArrow />

            <FlowNode variant="found">
              <p className="font-medium flex items-center gap-2"><MapPin className="w-4 h-4 text-accent" /> Adds found location</p>
            </FlowNode>
            <FlowArrow />

            <FlowNode variant="found">
              <p className="font-medium">Adds description</p>
            </FlowNode>
            <FlowArrow />

            <FlowNode variant="found">
              <p className="font-medium">Report stored in database</p>
            </FlowNode>
          </div>
        </div>

        {/* Merge: System matching */}
        <div className="flex flex-col items-center mt-2">
          <FlowArrow />
          <FlowNode variant="system" className="max-w-md w-full text-center">
            <p className="font-medium flex items-center justify-center gap-2">
              <Search className="w-4 h-4 text-primary" />
              System compares lost &amp; found reports
            </p>
          </FlowNode>
          <FlowArrow />

          <FlowNode variant="system" className="max-w-md w-full text-center">
            <p className="font-medium flex items-center justify-center gap-2">
              <Bell className="w-4 h-4 text-primary" />
              Possible match detected — Owner notified
            </p>
          </FlowNode>
          <FlowArrow />

          <FlowNode variant="default" className="max-w-md w-full text-center">
            <p className="font-medium mb-2 flex items-center justify-center gap-2">
              <Users className="w-4 h-4 text-foreground" />
              Owner chooses recovery option
            </p>
            <div className="flex flex-col sm:flex-row gap-2 mt-2">
              <span className="inline-block px-3 py-1.5 rounded-lg bg-accent/10 text-accent text-xs font-medium">
                Meet finder at safe location
              </span>
              <span className="inline-block px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium">
                Collect from L&F desk
              </span>
            </div>
          </FlowNode>
          <FlowArrow />

          <FlowNode variant="resolve" className="max-w-sm w-full text-center">
            <p className="font-semibold flex items-center justify-center gap-2">
              <CheckCircle className="w-5 h-5 text-accent" />
              Item Returned — Report Resolved
            </p>
          </FlowNode>
        </div>
      </div>
    </section>
  );
};

export default UserFlowDiagram;
