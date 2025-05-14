import { TreeVisualizer2 } from "../../../TREE/TreeVisualizer2";
import { usePathFinder } from "./PathFinderContext";
import { Recommend } from "./Recommend";

export const Section2 = () => {
    return (
    <div className="flex flex-col h-screen justify-center items-center">
        <Recommend />
    </div>
    )
}