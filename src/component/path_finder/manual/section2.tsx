import { TreeVisualizer2 } from "../../../TREE/TreeVisualizer2";
import { usePathFinder } from "./PathFinderContext";

export const Section2 = () => {
    const { 
        tree, 
        selected_tree1,
        selected_tree2,
        takenListForTree,
        nextListForTree,
      } = usePathFinder();

    return (
    <div className="flex flex-col h-screen justify-center items-center">
        <div className="flex-1 flex justify-center items-center w-full">
            <TreeVisualizer2 
            data={tree} 
            userlist={selected_tree1} 
            takenlist={takenListForTree} 
            nextlist={nextListForTree} 
            />
        </div>
        <div className="flex-1 flex justify-center items-center w-full">
            <TreeVisualizer2 
            data={tree} 
            userlist={selected_tree2} 
            takenlist={takenListForTree} 
            nextlist={nextListForTree} 
            />
        </div>
    </div>
    )
}