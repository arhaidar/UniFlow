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
          className="w-64 h-40 object-cover rounded-xl shadow-md transition-all hover:brightness-75 cursor-pointer"
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
    <div className="w-full h-full flex flex-col md:flex-row">
      <div className="max-w-xs max-h-[10px]"> {/* Set max height to 10px */}
        <ImageWithHoverCard
          src={img_progress}
          description="This image shows your progress."
        />
      </div>
      <div className="max-w-xs max-h-[10px]"> {/* Set max height to 10px */}
        <ImageWithHoverCard
          src={img_table}
          description="This image represents the course table."
        />
      </div>
      <div className="max-w-xs max-h-[10px]"> {/* Set max height to 10px */}
        <ImageWithHoverCard
          src={img_tree}
          description="This image visualizes the course tree."
        />
      </div>
    </div>
  );
};
