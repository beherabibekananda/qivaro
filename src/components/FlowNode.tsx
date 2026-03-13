import { cn } from "@/lib/utils";

type FlowNodeVariant = "default" | "lost" | "found" | "system" | "resolve" | "start";

interface FlowNodeProps {
  children: React.ReactNode;
  variant?: FlowNodeVariant;
  className?: string;
}

const variantClasses: Record<FlowNodeVariant, string> = {
  default: "bg-surface border-border",
  lost: "bg-surface border-l-4 border-l-warning border-t border-r border-b border-border",
  found: "bg-surface border-l-4 border-l-accent border-t border-r border-b border-border",
  system: "bg-primary/5 border-primary/30 border",
  resolve: "bg-accent/5 border-accent/30 border",
  start: "bg-surface border-2 border-primary",
};

const FlowNode = ({ children, variant = "default", className }: FlowNodeProps) => {
  return (
    <div
      className={cn(
        "rounded-xl px-6 py-4 shadow-sm font-body text-sm text-foreground transition-shadow hover:shadow-md",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </div>
  );
};

export default FlowNode;
