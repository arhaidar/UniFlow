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
  userlist: string;
  takenlist: string[];
  nextlist: string[];
}

export const TreeVisualizer2: React.FC<TreeVisualizerProps> = ({ data, userlist, takenlist, nextlist }) => {
  // State to hold the filtered tree
  const [userSelectedTree, setUserSelectedTree] = useState<TreeNode | null>(null);
  
  // Default tree data (assuming defaultTreeData is already available)
  const defaultTreeData = { /* your defaultTreeData */ };

  useEffect(() => {
    let treeData;

    // Determine if data is available; if not, use the default data
    if (!data || userlist === "") {
      treeData = defaultTreeData;
    } else {
      console.log("Getting data");
      treeData = data;
    }

    const treedata: TreeNode = generateTreeData(treeData); // Assuming this function converts data to TreeNode structure

    // If userlist is set, find the corresponding node in the tree
    if (userlist) {
      const findNodeByName = (node: TreeNode, name: string): TreeNode | null => {
        if (node.name === name) {
          return node;
        }
        if (node.children) {
          for (let child of node.children) {
            const result = findNodeByName(child, name);
            if (result) return result;
          }
        }
        return null;
      };

      const selectedNode = findNodeByName(treedata, userlist);
      setUserSelectedTree(selectedNode); // Set the selected node
    } else {
      setUserSelectedTree(null); // Reset if no userlist is selected
    }
  }, [data, userlist, takenlist, nextlist]); // Dependencies include all relevant props

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

    const isTaken = takenlist.includes(nodeDatum.name);
    const isNext = nextlist.includes(nodeDatum.name);

    // Default styling
    let rectFill = "white";
    let textColor = "black";
    let borderColor = "black";

    // Apply coloring based on node type and lists
    if (isTaken) {
      rectFill = "red";
      textColor = "white";
      borderColor = "black";
    } else if (isNext) {
      rectFill = "blue";
      textColor = "white";
      borderColor = "black";
    }

    const yPosition1 = isOrNode ? rectHeight + 2 : isAndNode ? rectHeight + 2 : -rectHeight / 1.7;
    const yPosition2 = isOrNode ? rectHeight + 21 : isAndNode ? rectHeight + 21 : "";

    return (
      <g onClick={toggleNode}>
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

  // Positioning for the tree
  const x_center = 375;
  const y_center = 60;

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
        overflow: "auto", // Allow scrolling if needed
      }}
    >      
      {userSelectedTree ? (
        <div
          style={{
            width: "95%",
            height: "95%", // Limit the height of each tree
            border: "1px solid #000",
            borderRadius: "8px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Tree
            data={userSelectedTree}
            orientation="vertical"
            pathFunc="step" // Makes the connection lines straight
            separation={{ siblings: 1, nonSiblings: 1 }}
            depthFactor={100} //length of connection line
            nodeSize={{ x: 130, y: 50 }} // Adjusts node spacing
            renderCustomNodeElement={renderRectSvgNode} //custom setting for each nodes in tree
            translate={{ x: x_center, y: y_center }} // Apply the translation
            scaleExtent={{ min: 0.1, max: 0.7 }} // Allow zoom-out + first-render
            zoomable={true} // Enable zoomable
          />
        </div>
      ) : (
        <div>Choose the class to see prerequisite Tree</div>
      )}
    </div>
  );
};
