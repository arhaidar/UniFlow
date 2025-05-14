
//input: tree_data, next_list
//output: sorted_list
//function: rank classes in next_list and sort it
export interface CourseNode {
  value: string;
  children: string[];
  rank?: number;
}
export interface CourseData {
  [key: string]: CourseNode;
}

export interface SortedList {
  course_name:string;
  rank:number;
}

export function ranker(tree_data:CourseData, nextListForTree:string[], list1:Set<string>, list2:Set<string>, list3:Set<string>):SortedList[] {
  
  function assignRanks(nodeKey: string, currentRank: number) {
    const node = tree_data[nodeKey];
    if (!node) return;
    // Set rank if not already set, or update if this path is deeper
    if (node.rank === undefined || node.rank < currentRank) {
      node.rank = currentRank;
    }
    for (const childKey of node.children) {
      assignRanks(childKey, currentRank + 1);
    }
  }

  // Start from all root nodes (could be different depending on your tree shape)
  for (const key in tree_data) {
    if (tree_data.hasOwnProperty(key)) {
      assignRanks(key, 0);
    }
  }

  // Sort nextListForTree based on assigned ranks
  const sortedList = nextListForTree.sort((a, b) => {
    const rankA = tree_data[a]?.rank ?? 0;
    const rankB = tree_data[b]?.rank ?? 0;
    return rankA - rankB;
  });

  return sortedList;
}
