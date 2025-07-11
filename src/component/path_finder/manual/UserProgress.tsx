import { Line } from 'rc-progress';
import { usePathFinder } from "./PathFinderContext";

export const UserProgress = ({state}:any) => {
    const { 
        nextToTake, takenListForTree,
    } = usePathFinder();

    

    // nextToTake,
    //   nextList,
    //   selected_tree1,
    //   selected_tree2,
    //   tree,
    //   takenListForTree,
    //   nextListForTree,
    //   plannerStatus,
    //   userGraduationDate,
    
    console.log(takenListForTree, nextToTake)

    const renderBox = (title: string, selected: number, total:number, list: Set<string>) => (
        <div className="flex flex-col  border rounded-xl p-3 relative shadow-md bg-white w-[25%] mx-[0.1%] min-w-[50px]">
            <div className='mb-5'>
                <p className="text-sm font-semibold mb-1 truncate">{title}</p>
                <Line percent={(selected / total) * 100} strokeWidth={5} strokeColor="#4ade80" className="mb-3" />
                <p>{`${selected} / ${total}`}</p>
            </div>  
            
    </div>
    );

    return (
        <div className="flex justify-center items-stretch gap-x-2 w-full px-4">
            {renderBox("Major Required List", state.taken.size, 27, state.need_complete)}
            {state.need_specilazation && 
                renderBox("Specialization Required List", 0,4, state.need_specilazation )}
            {state.need_specilazation && state.need_specilazation_elective && 
                renderBox("Specialization Elective List", 2,5, state.need_specilazation_elective )}
            {state.need_project &&
                renderBox("Porject Required List", 1,3, state.need_project )}
            {renderBox("Ohter List", 0,20, state.need_others)}
        </div>
    )
}
