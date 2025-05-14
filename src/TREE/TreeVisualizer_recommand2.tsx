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
      "CLASS F"
    ],
    "rank": 2
  },
  "CLASS H": {
    "value": "CLASS H",
    "children": [
    ],
    "rank": 2
  }
};

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

// Function to find nodes that have a specific node in their children
const findParentNodes = (data: CourseData, nodeKey: string): string[] => {
  return Object.entries(data)
    .filter(([key, node]) => node.children.includes(nodeKey))
    .map(([key]) => key);
};

// Get the key for a node by its value (name)
const getNodeKeyByValue = (data: CourseData, nodeValue: string): string | null => {
  for (const [key, node] of Object.entries(data)) {
    if (node.value === nodeValue) {
      return key;
    }
  }
  return null;
};

// Build tree from bottom up, with recursive parent finding
const buildBottomUpTree = (data: CourseData, startNode: string): TreeNode => {
  //first make a data from 'startNodeValue' as root -> startNodeValue will be the top
  //    and then later we flip the tree so that it will be bottom up shape

  // queue stack processing to create tree
  const queue:string[] = [] //class name queue
  queue.push(startNode)

  while(queue.length != 0) {
    const nodeKey = queue.pop();
    if (!nodeKey) {
      continue;
    }
    const parents = findParentNodes(data, nodeKey);
    if (parents.length == 0) {
      continue;
    }
    // Add the parent nodes to the queue for further processing
    parents.forEach(element => {
      queue.push(element)
    });






    // const nodeKey = queue.pop();
    // const parents = findParentNodes(data, nodeKey!);
    // if (parents.length == 0) {
    //   continue;
    // }
    // // Add the parent nodes to the queue for further processing

    // queue.push(parents.map(parent => parent))
  }


  // Get the key for the start node
  const startNodeKey = getNodeKeyByValue(data, startNode);
  
  if (!startNodeKey) {
    return { name: startNode };
  }

  // Process nodes in levels, starting from the bottom
  const processedNodes = new Set<string>();
  const rootNode: TreeNode = { name: startNode };
  
  // Queue for BFS through the levels from bottom to top
  let currentLevel = [startNodeKey];
  let levelNum = 0;
  
  // Track the tree structure as we build it
  const nodeMap = new Map<string, TreeNode>();
  nodeMap.set(startNodeKey, rootNode);
  
  // Build up level by level
  while (currentLevel.length > 0 && levelNum < 10) { // Prevent infinite loops
    const nextLevel = new Set<string>();
    
    // Process each node in the current level
    for (const nodeKey of currentLevel) {
      if (processedNodes.has(nodeKey)) continue;
      processedNodes.add(nodeKey);
      
      // Find all parent nodes (nodes that include this node in their children)
      const parentKeys = findParentNodes(data, nodeKey);
      
      for (const parentKey of parentKeys) {
        // Get or create the tree node for this parent
        if (!nodeMap.has(parentKey)) {
          nodeMap.set(parentKey, { 
            name: data[parentKey].value, 
            children: [] 
          });
        }
        
        // Get or create the current node
        if (!nodeMap.has(nodeKey)) {
          nodeMap.set(nodeKey, { 
            name: data[nodeKey].value, 
            children: [] 
          });
        }
        
        // Add current node as a child of the parent node
        const parentNode = nodeMap.get(parentKey)!;
        const currentNode = nodeMap.get(nodeKey)!;
        
        // Avoid duplicates
        if (!parentNode.children?.some(child => child.name === currentNode.name)) {
          parentNode.children = parentNode.children || [];
          parentNode.children.push(currentNode);
        }
        
        // Add parent to the next level
        nextLevel.add(parentKey);
      }
    }
    
    // Move to the next level up
    currentLevel = Array.from(nextLevel);
    levelNum++;
  }
  
  
  // Fallback to the original node if structure is broken
  return rootNode;
};

interface TreeVisualizerProps {
  data: any;
  userlist: string;
  takenlist: string[];
  nextlist: string[];
}

export const Tree_Recommand_Visual2: React.FC<TreeVisualizerProps> = ({ data, userlist, takenlist, nextlist }) => {
  const [bottomUpTree, setBottomUpTree] = useState<TreeNode | null>(null);
  
  useEffect(() => {
    let treeData;

    // Determine if data is available; if not, use the default data
    if (!data || Object.keys(data).length === 0) {
      treeData = defaultTreeData;
    } else {
      console.log("Getting data", data);
      treeData = data;
    }

    if (userlist) {
      const tree = buildBottomUpTree(treeData, userlist);
      console.log("data", tree)
      setBottomUpTree(tree);
    } else {
      setBottomUpTree(null);
    }
  }, [data, userlist, takenlist, nextlist]);

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
      {bottomUpTree ? (
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
            data={bottomUpTree}
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