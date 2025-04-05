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

export interface TreeNode {
  name: string;
  children?: TreeNode[];
}

export interface CourseNode {
  value: string;
  children: string[];
  rank: number;
}

export interface CourseData {
  [key: string]: CourseNode;
}

export const findHighestNodes = (data?: CourseData): string[] => {
  if(!data) return []; //undefined...

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

const convertToTreeData = (data: CourseData, nodeName: string): TreeNode => {
  const node = data[nodeName];
  const children = node.children.map((childName: string) => convertToTreeData(data, childName));

  return {
    name: node.value,
    children: children.length > 0 ? children : undefined
  };
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

interface TreeVisualizerProps {
  data: any;
  userlist: string[];
  takenlist: string[];
  nextlist: string[];
}

export const TreeVisualizer2: React.FC<TreeVisualizerProps> = ({ data, userlist, takenlist, nextlist }) => {
  //data = tree data
  //userlist = what user select to see in tree among highest one
  //takenlist = list of they select to take -> for later using tree node coloring, red background / black border / white font color
  //nextlist = list of next available to take -> for later using tree node coloring, blue background / black border / white font color
  let treeData = data;
  if (!treeData) {
    treeData = defaultTreeData;
  } else {
    console.log("Getting data");
  }
  
  const treedata:TreeNode = generateTreeData(treeData);
  let firstLevelChildren = treedata.children || []; // Adjust based on the structure of `treedata`

  //filtering...
  if (userlist && userlist.length > 0) {
    firstLevelChildren = firstLevelChildren.filter(child => 
      userlist.includes(child.name)
    );
  }
    
  const renderRectSvgNode = ({ nodeDatum, toggleNode }: any) => {
    const fontSize = 20;
    const padding = 6; 
    const rectWidth = nodeDatum.name.length * fontSize * 0.6 + padding * 1;
    const rectHeight = fontSize + padding * 2;

    const isChild = nodeDatum.children;
    const isOrNode = nodeDatum.name.includes("OR");
    const isAndNode = nodeDatum.name.includes("AND");

    let displayText;
    if (isOrNode) {
        displayText = "One of";
    } else if (isAndNode) {
        displayText = "All of";
    } else {
        displayText = nodeDatum.name;
    }

    // const rectFill = "white";
    // const fillcolor = isOrNode ? "white" : isAndNode ? "white" : isChild ? "gray" : "white";
    // const color = isAndNode ? "none" : (isOrNode ? rectFill : (isChild ? "gray" : "white")); 
    // const border = isOrNode ? rectFill : (isAndNode ? "none" : (isChild ? "black" : "black"));

    // Check if the node is in takenlist or nextlist
    const isTaken = takenlist.includes(nodeDatum.name);
    const isNext = nextlist.includes(nodeDatum.name);

    // Default styling
    let rectFill = "white";
    let textColor = "black";
    let borderColor = "black";
    
    // Apply coloring based on node type and lists
    if (isTaken) {
      // For taken items: red background, black border, white text
      rectFill = "red";
      textColor = "white";
      borderColor = "black";
    } else if (isNext) {
      // For next available items: blue background, black border, white text
      rectFill = "blue";
      textColor = "white";
      borderColor = "black";
    } else {
      // Default styling based on node type
      if (isOrNode) {
        rectFill = "white";
        textColor = "black";
        borderColor = "none";
      } else if (isAndNode) {
        rectFill = "white";
        textColor = "black";
        borderColor = "none";
      }
    }

    const yPosition1 = isOrNode ? rectHeight + 2 : isAndNode ? rectHeight + 2 : -rectHeight / 1.7;
    const yPosition2 = isOrNode ? rectHeight + 21 : isAndNode ? rectHeight + 21 : "";

    return (
      <g onClick={toggleNode} >
        <rect 
          width={rectWidth} 
          height={rectHeight} 
          x={-rectWidth / 2} 
          y={yPosition1} 
          fill={rectFill}
          stroke={borderColor}
          strokeWidth={2}
        />
        <text 
          fill={textColor}  
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

  const x_center = 125;
  const y_center = 80; 

  useEffect(() => {
    //filtering...
    if (userlist && userlist.length > 0) {
      firstLevelChildren = firstLevelChildren.filter(child => 
        userlist.includes(child.name)
      );
    }
  },[userlist,takenlist]) 

    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", // Automatic columns        
          justifyContent: "center", // Center horizontally
          gap: "8px", // Small gap for spacing
          height: "100%", // Fill second-portion height
          width: "100%", // Fill second-portion width
          boxSizing: "border-box",
        }}
      >      
        {firstLevelChildren.map((child, index) => (
          
          <div
            key={index}
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
            <Tree
              data={child}
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
          ))} 
      </div>
    );
  };
