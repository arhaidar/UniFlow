import img_progress from "./data/img_progress.png";
import img_table from "./data/img_table.png";
import img_tree from "./data/img_tree.png";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

const ImageWithHoverCard = ({
  src,
  description,
}: {
  src: string;
  description: string;
}) => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
      <img
        src={src}
        className="w-full h-full object-cover rounded-xl shadow-md transition-all hover:brightness-75 cursor-pointer"
      />
      </HoverCardTrigger>
      <HoverCardContent className="w-64 text-sm text-gray-700 font-medium">
        {description}
      </HoverCardContent>
    </HoverCard>
  );
};
export const Turtorial = () => {
  return (
    <div className="flex gap-4">
      {/* Left side: vertical stack with equal height */}
      <div className="flex flex-col gap-4 flex-1">
        <ImageWithHoverCard
          src={img_progress}
          description="Tracking your planning process based on major requirement"
        />
        <ImageWithHoverCard
          src={img_table}
          description="Click this section to progress your planning"
        />
      </div>

      {/* Right side: single image, full height */}
      <div className="flex-1">
        <ImageWithHoverCard
          src={img_tree}
          description="This image visualizes the course tree."
        />
      </div>
    </div>
  );
};
