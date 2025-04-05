import React, { useEffect, useState } from "react";
import Tree from "react-d3-tree";
import { useCourseContext } from "../mainpage";

const defaultTreeData = {
  "CLASS A": {
    "value": "CLASS A",
    "children": [
      "AND1A"
    ],
    "rank": 6
  },
  "AND1A": {
    "value": "AND1A",
    "children": [
      "CLASS B",
      "CLASS E"
    ],
    "rank": 6
  },
  "CLASS B": {
    "value": "CLASS B",
    "children": [
      "OR1B"
    ],
    "rank": 5
  },
  "OR1B": {
    "value": "OR1B",
    "children": [
      "CLASS C",
      "CLASS D"
    ],
    "rank": 5
  },
  "CLASS C": {
    "value": "CLASS C",
    "children": [
    ],
    "rank": 4
  },
  "CLASS D": {
    "value": "CLASS D",
    "children": [
    ],
    "rank": 3
  },
  "CLASS E": {
    "value": "CLASS E",
    "children": [
      "AND1E"
    ],
    "rank": 2
  },
  "AND1E": {
    "value": "AND1E",
    "children": [
      "CLASS F",
      "CLASS G",
      "CLASS H"
    ],
    "rank": 2
  },
  "CLASS F": {
    "value": "CLASS F",
    "children": [
    ],
    "rank": 2
  },
  "CLASS G": {
    "value": "CLASS G",
    "children": [
    ],
    "rank": 2
  },
  "CLASS H": {
    "value": "CLASS H",
    "children": [
    ],
    "rank": 2
  }
}


interface TreeNode {
  name: string;
  children?: TreeNode[];
}

interface CourseNode {
  value: string;
  children: string[];
  rank: number;
}

interface CourseData {
  [key: string]: CourseNode;
}

const convertToTreeData = (data: CourseData, nodeName: string): TreeNode => {
  const node = data[nodeName];
  const children = node.children.map((childName: string) => convertToTreeData(data, childName));

  return {
    name: node.value,
    children: children.length > 0 ? children : undefined
  };
};

const findHighestNodes = (data: CourseData): string[] => {
  const result: string[] = [];
  const allKeys = Object.keys(data);
  const allChildren = Object.values(data)
    .map(node => node.children)
    .flat();
  
  allKeys.forEach(key => {
    if (!allChildren.includes(key)) {
      result.push(data[key].value);
    }
  });
  
  return result;
};

const findNodeInTree = (
  tree: TreeNode, 
  nodeName: string, 
  depth: number
): { node: TreeNode | null, parent: TreeNode | null } => {
  if (tree.name === nodeName) {
    return { node: tree, parent: null };
  }

  if (tree.children) {
    for (let child of tree.children) {
      const result = findNodeInTree(child, nodeName, depth + 1);
      if (result.node) {
        return { node: result.node, parent: tree };
      }
    }
  }

  return { node: null, parent: null };
};

const dfsTraverseAndConnect = (
  data: CourseData, 
  nodeName: string, 
  visited: Set<string>, 
  rootNode: TreeNode, 
  depth: number
): void => {
  if (visited.has(nodeName)) return;
  
  const node = data[nodeName];
  visited.add(nodeName);

  const treeData = convertToTreeData(data, nodeName);
  // console.log("tree data", treeData)
  const { node: existingNode, parent } = findNodeInTree(rootNode, nodeName, depth);

  if (existingNode && parent) {
    // this one adds everything...
    // parent.children = parent.children?.filter(child => child !== existingNode);
    // parent.children?.push(treeData);
  } else if (!existingNode) {
    rootNode.children = rootNode.children || [];
    rootNode.children.push(treeData);
  }

  node.children.forEach((childName: string) => {
    dfsTraverseAndConnect(data, childName, visited, rootNode, depth + 1);
  });
};

const generateTreeData = (data: CourseData): TreeNode => {
  const rootNode: TreeNode = {
    name: "Graduation",
    children: []
  };

  const visited = new Set<string>();
  const highestNodes = findHighestNodes(data);
  // console.log("highest....", highestNodes);

  highestNodes.forEach(nodeName => {
    Object.entries(data).forEach(([key, node]) => {
      if (node.value === nodeName && !visited.has(key)) {
        dfsTraverseAndConnect(data, key, visited, rootNode, 0);
      }
    });
  });

  return rootNode;
};



export const AdancedVisualizer = () => {
  const { state, dispatch } = useCourseContext();
  const [tree, setTree] = useState<CourseData | undefined>(undefined);
  
  const copy_state = state; //get copy of it (don't touch original)
  const combineStateToJSON = (graduationDate?: string): object => {
    return {
      taken: Array.from(copy_state.taken),
      need_complete: Array.from(copy_state.need_complete),
      need_elective: Array.from(copy_state.need_elective),
      need_project: Array.from(copy_state.need_project),
      need_others: Array.from(copy_state.need_others),
      major: 'computer_science',
      prefer: copy_state.prefer,
      num_total: copy_state.num_total,
      num_project: copy_state.num_project,
      graduation_date: graduationDate,
    };
  };
  // API CALL to get 1) tree data 2) next class data
  const getTreeData = async (wholeList: object) => {
    try {
      const response = await fetch('http://localhost:3000/process/treedata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(wholeList), // Only stringify here
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error fetching next plan:', error);
      throw error;
    }
  };

  //getting Tree data
  const renderTreeData = async () => {
    const combinedData = combineStateToJSON();
    try {
      const backendtreedata = await getTreeData(combinedData);
      if(backendtreedata.success) {
        const formattedTree: CourseData = Object.entries(backendtreedata.treedata.nodes).reduce(
          (acc, [key, value]) => {
            const courseNode = value as CourseNode; // Explicitly type value
            
            acc[key] = {
              ...courseNode, // Now TypeScript knows the structure
              rank: courseNode.rank ?? 0, // Ensure rank is always a number
            };
      
            return acc;
          },
          {} as CourseData
        );
        console.log("SAVING....", formattedTree)
        setTree(formattedTree);
      }
    }
    catch(error) {
      console.error("Error fetching data from the backend:", error);
      alert("An error occurred while fetching data.");
    }
  }

  useEffect(() => {
    renderTreeData();
  },[])

  //rendering data
  console.log("CHECK!!!!:::", tree)
  let treeData = tree; // Default to provided data

  if (!treeData) { // If treeData is null or undefined
    console.log("undefined11111111");
    treeData = defaultTreeData; // Use backup data
  } else {
    console.log("Getting data");
  }
  
    const treedata:TreeNode = generateTreeData(treeData);

    const firstLevelChildren = treedata.children || []; // Adjust based on the structure of `treedata`

    const renderRectSvgNode = ({ nodeDatum, toggleNode }: any) => {
      const fontSize = 20;
      const padding = 6; // Space around text
      const rectWidth = nodeDatum.name.length * fontSize * 0.6 + padding * 1; // Approximate width
      const rectHeight = fontSize + padding * 2; // Approximate height

      const isChild = nodeDatum.children;
      const isOrNode = nodeDatum.name.includes("OR"); // 'OR' 포함 여부
      const isAndNode = nodeDatum.name.includes("AND"); // 'AND' 포함 여부

      let displayText;
      if (isOrNode) {
          displayText = "One of";
      } else if (isAndNode) {
          displayText = "All of";
      } else {
          displayText = nodeDatum.name; // 'OR' 또는 'AND'가 아니면 원래 이름
      }

      const rectFill = "white"; // 'OR' 포함 시 색상 변경
      const fillcolor = isOrNode ? "white" : isAndNode ? "white" : isChild ? "gray" : "white";
      const color = isAndNode ? "none" : (isOrNode ? rectFill : (isChild ? "gray" : "white")); // 'AND'일 경우 배경 색상 none
      const border = isOrNode ? rectFill : (isAndNode ? "none" : (isChild ? "black" : "black")); // 'AND'일 경우 border도 none  

      //for 'or' & 'and' position
      const yPosition1 = isOrNode ? rectHeight + 2 : isAndNode ? rectHeight + 2 : -rectHeight / 1.7;
      const yPosition2 = isOrNode ? rectHeight + 21 : isAndNode ? rectHeight + 21 : "";

      return (
        <g onClick={toggleNode} >
          {/* Background rectangle */}
          <rect 
            width={rectWidth} 
            height={rectHeight} 
            x={-rectWidth / 2} 
            y={yPosition1} 
            fill={fillcolor} //2 cases -> one for 'or' one for rectFill
            stroke={border}
            strokeWidth={2} // 추가: 테두리 두께 설정
          />
          <text 
            fill="black" 
            strokeWidth="0"
            y={yPosition2}
            fontSize={fontSize} 
            textAnchor="middle" 
            alignmentBaseline="middle"
          >
            {displayText}
          </text>
        </g>
      );
    };
    const numChildren = firstLevelChildren.length;
    const boxsize1 = 400;
    const x_center = 125; // Horizontal movement for center main class
    const y_center = 80; // Vertical movement for center main class
    //use this as center
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", // Automatic columns        justifyContent: "center", // Center horizontally
          gap: "8px", // Small gap for spacing
          height: "100%", // Fill second-portion height
          width: "100%", // Fill second-portion width
          boxSizing: "border-box",
        }}
      >      
        {/* {firstLevelChildren.map((child, index) => ( */}
          <div
            // key={index}
            style={{
              width: "100%",
              height: "100%",
              border: "1px solid #000",
              borderRadius: "8px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              // transform: "scale(0.94)",
            }}
          >
            {/* <button>ICON TO BIGGER *AT THE TOP RIGHT</button>  */}
            <Tree
              data={treedata}
              orientation="vertical"
              pathFunc="step" // Makes the connection lines straight
              separation={{ siblings: 1, nonSiblings: 1 }}
              depthFactor={100} //length of connection line
              nodeSize={{ x: 130, y: 50 }} // Adjusts node spacing
              renderCustomNodeElement={renderRectSvgNode} //custom setting
              translate={{ x: x_center, y: y_center }} // Apply the translation
              scaleExtent={{ min: 0.2, max: 4 }} // Allow zoom-out + first-render
              zoomable={true} // Enable zoomable
            />
            
          </div>
          {/* ))} */}
      </div>
    );
  };
