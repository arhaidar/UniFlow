
//input: dispatch & data
//output: void
//function: compare with taken list and update with new list in each NEED_LIST
import { getApiData } from '../../../utils/api_call/api_call';
import { CourseData, CourseNode } from './PathFinderContext'; //type getting

export async function startPlanner(setNextToTake: any,setNextList: any,setTree: any,  state: React.SetStateAction<any>) {
    const copy_state = state; //get copy of it (don't touch original)

    // const { 
    //     setNextToTake,
    //     setNextList,
    //     setTree
    //   } = usePathFinder();

    // const init_data = async () => {
    try {
    const [backendtreedata, backendnextdata] = await Promise.all([
        getApiData(copy_state, 'treedata'),
        getApiData(copy_state, 'manualplan')
    ]);

    // console.log("FROM THE BACKEND SERVER:::::Tree", backendtreedata.treedata)
    // console.log("FROM THE BACKEND SERVER:::::Next", backendnextdata.plan)

    if(backendnextdata.success) {
        setNextToTake(backendnextdata.plan)
        setNextList(new Set(backendnextdata.plan[0])); // Convert array to Set
    }
    else {
        alert("Fail to get next class data");
    }
    if (backendtreedata.success) {
        const formattedTree: CourseData = Object.entries(backendtreedata.treedata.nodes).reduce(
          (acc, [key, value]) => {
              const courseNode = value as CourseNode;
              acc[key] = {
              ...courseNode,
              rank: courseNode.rank ?? 0,
              };
              return acc;
          },
          {} as CourseData
        );
    
        console.log("SAVING....", formattedTree)
        setTree(formattedTree);
        // handleToggleTreeData(formattedTree);
        // console.log("TREE DATA (AFTER STATE UPDATE)::::", formattedTree);
    }
    else {
        alert("Fail to get tree data");
    }
    }
    catch(error) {
        console.error("Error fetching data from the backend:", error);
        alert("An error occurred while fetching data.");
    }
    // };
    

}
