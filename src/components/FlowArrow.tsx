import { cn } from "@/lib/utils";

interface FlowArrowProps {
  className?: string;
  horizontal?: boolean;
}

const FlowArrow = ({ className, horizontal }: FlowArrowProps) => {
  if (horizontal) {
    return (
      <div className={cn("flex items-center justify-center w-12", className)}>
        <div className="h-px w-full bg-connector" />
        <div className="w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[8px] border-l-connector -ml-px" />
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col items-center py-1", className)}>
      <div className="w-px h-6 bg-connector" />
      <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[8px] border-t-connector" />
    </div>
  );
};

export default FlowArrow;
