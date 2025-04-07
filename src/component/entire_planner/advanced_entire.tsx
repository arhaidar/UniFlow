import React, { useState,useEffect,useRef } from "react";
import Tree from 'react-d3-tree';

import { TreeVisualizer } from "../../TREE/TreeVisualizer"
import { TreeVisualizer2 } from "../../TREE/TreeVisualizer2";
import { findHighestNodes } from "../../TREE/TreeVisualizer2";

import './entire.css'
import { CourseState } from "../../mainpage";
import { useCourseContext } from '../../mainpage'; //sharing data

import { Test } from "../../testing/test";
import { Preference } from "../../majorComponents/preference";

interface Final_ClassWithRank {
  value: string; // The node value (class name)
  rank: number;  // How many valid steps upward were counted
}

interface GraduationOption {
  label: string;
  value: string;
};
interface CourseNode {
  value: string;
  children: string[];
  rank?: number;
}
interface CourseData {
  [key: string]: CourseNode;
}

export const PathFinder2 = () => {
  const { state, dispatch } = useCourseContext();

  const handleToggleTreeData = (tree: CourseData) => {
    dispatch({ type: 'ADD_TREE', payload: tree });
  };

  const copy_state = state; //get copy of it (don't touch original)
  
  // console.log(copy_state)
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

  const getTreeData = async (wholeList: object) => {
    try {
      const response = await fetch('http://localhost:3000/process/treedata', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(wholeList), // Only stringify here
        }
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      return result;
    }
    catch {
      console.error('Error fetching next plan:', error);
      throw error;
    }
  }
  const getWholeList = async (wholeList: object) => {
    try {
      const response = await fetch('http://localhost:3000/process/wholelist', {
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

  const [nextToTake, setNextToTake] = useState<string[][]>([]);
  const [tree, setTree] = useState<CourseData | undefined>(undefined);

  //init data setting
  const handleNextClass = async () => {
    const combinedData = combineStateToJSON(); //json objectset to BACKEND

    try {
      const [backendnextdata, backendtreedata] = await Promise.all([
        getWholeList(combinedData),
        getTreeData(combinedData)
      ]);

      console.log("FRONTEND DATA:::::", combinedData)
      console.log("FROM THE BACKEND SERVER:::::Tree", backendtreedata.treedata)
      console.log("FROM THE BACKEND SERVER:::::Next", backendnextdata.plan)

      if(backendnextdata.success) {
        setNextToTake(backendnextdata.plan)
        setNextList(new Set(backendnextdata.plan[0])); // Convert array to Set
      }
      else {
        alert("Fail to get next class data");
      }
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
  };


  //========= graduation data getter =========
  const [graduationDate, setGraduationDate] = useState<string>(''); // 졸업일 상태 관리
  const [userGraduationDate, setUserGraduationDate] = useState<GraduationOption[] | undefined>(undefined);

  const generateGraduationOptions = (): GraduationOption[] => {
    const options: GraduationOption[] = [];
    const today = new Date();
    const startYear = today.getFullYear();
    const startMonth = today.getMonth();
    const startDate = today.getDate();

    const seasons = ['Spring', 'Summer', 'Fall', 'Winter'] as const;
    const seasonsnosummer = ['Spring', 'Fall', 'Winter'] as const;

    let startSeason: typeof seasonsnosummer[number];
    if ((startMonth === 0 && startDate <= 15) || (startMonth === 1) || (startMonth === 2 && startDate < 28)) {
        startSeason = 'Spring';
    } else if ((startMonth === 2 && startDate >= 28) || (startMonth === 3) || (startMonth === 4 && startDate < 28)) {
        startSeason = 'Fall';
    } else if ((startMonth === 4 && startDate >= 28) || (startMonth === 5) || (startMonth === 6 && startDate < 15)) {
        startSeason = 'Fall';
    } else {
        startSeason = 'Winter';
    }

    // 시즌 순서 찾기
    const startIndex = seasonsnosummer.indexOf(startSeason);

    // 4년 동안의 옵션 생성
    for (let yearOffset = 0; yearOffset < 4; yearOffset++) {
      for (let seasonOffset = 0; seasonOffset < 3; seasonOffset++) {
          const year = startYear + yearOffset;
          const seasonIndex = (startIndex + seasonOffset) % seasonsnosummer.length;
          options.push({
              label: `${seasonsnosummer[seasonIndex]} ${year}`,
              value: `${seasonsnosummer[seasonIndex].toLowerCase()} ${year}`
          });
      }
    }

    return options;
  };
  const graduationOptions = generateGraduationOptions();
  const [error, setError] = useState<string>('');
  const handleEntireYearPlan = async () => {
    if (!graduationDate) {
        setError('Please select a graduation date.');
        return;
    }
    // setUserGraduationDate(graduationOptions.filter(option => option.value <= graduationDate));
    const selectedIndex = graduationOptions.findIndex(option => option.value === graduationDate);
    if (selectedIndex !== -1) {
      setUserGraduationDate(graduationOptions.slice(0, selectedIndex + 1));
    } else {
      setError('Invalid graduation date selected.');
    }
    
    setError('Start');
    //get the data and start making all row of each
    handleNextClass();
  };
  //========= graduation data getter =========



  // ========= INTERACTIVE DATA ===========
  const takenListRef = useRef(new Set<string>());

  const [takenList, setTakenList] = useState(new Set<string>());
  const [nextList, setNextList] = useState<Set<string>>(new Set());
  
  const [takenListForTree, setTakenListForTree] = useState<string[]>([]);
  const [nextListForTree, setNextListForTree] = useState<string[]>([]);
  

  const findParent = (childCourse: string) => {
    // for now, using 'testData' change this later 'tree'  
    if(tree === undefined) {
      return [];
    }
    const result: string[] = [];
    Object.keys(tree).forEach(key => {
      const childrenWithMatch = tree[key].children.filter(child => 
        child.toLowerCase().includes(childCourse.toLowerCase())
      );
      
      const orandcheck = childrenWithMatch.filter(data => data.includes("OR") || data.includes("AND"))
      if(orandcheck.length > 0) {
        console.log(orandcheck);
      }

      if (childrenWithMatch.length > 0) {
        result.push(tree[key].value);
      }
    });
  
    return result;
  };
  const findChildren = (classdata: string): string[] => {
    if(tree !== undefined) {
      const node = tree[classdata]; // Access the node directly
      return node ? node.children : [];
    }
    return []
  }

  useEffect(() => {
    setTakenList(new Set(takenListRef.current));
  }, [takenListRef.current.size]); // This will update when takenListRef changes


  const addClass = async (classdata: string, index: number) => {
    console.log("clicked", classdata, "at ", index);

    const isChecked = takenListRef.current.has(classdata);
    let nextAffectedList: string[] = [];

    if (!isChecked) {
      // console.log("adding,, ", classdata);
      takenListRef.current.add(classdata);
    } else {
      // console.log("removing,, ", classdata);
      takenListRef.current.delete(classdata);
    }

    const parentEval = async (data: string) => {
      const parents: string[] = findParent(data);
      // console.log("-> parents::::", parents);
  
      if (parents.length === 0) {
        // console.log("no parentsnode ", parents);
        return;
      }
  
      for (const parent of parents) {
        if (parent.includes('OR')) {
          takenListRef.current.add(parent); // Instant update in ref
          // console.log("or:::", parent);
          await parentEval(parent);
        } 
        else if (parent.includes('AND')) {
          const children = findChildren(parent);  
          const isAllChildTaken = children.every(child => takenListRef.current.has(child));
          if (isAllChildTaken) {
            // console.log("ALL TAKEN:::", parent, " with ", children);
            takenListRef.current.add(parent);
            await parentEval(parent);
          } 
        } else {
          setNextList((prevList) => {
            const newSet = new Set(prevList).add(parent);
            return newSet;
          });
          nextAffectedList.push(parent);
        }
      }
    };
    await parentEval(classdata);

    // Force re-render by updating state
    setTakenList(new Set(takenListRef.current));
    
    setNextToTake((prev) => { 
      if (!prev || index < 0 || index >= prev.length) return prev; // Ensure valid index 
   
      const updatedList = [...prev]; // Copy the state 
      
      // Get all classes from current index - we preserve these
      const currentList = [...updatedList[index]]; 
      
      // Add any unclicked classes to next index if it exists
      if (index + 1 < updatedList.length) {
        // Get unclicked classes to pass to next level
        const classesToPassForward = currentList.filter(course => course !== classdata);
        
        // Merge unclicked classes into next index without duplicates
        const nextIndexSet = new Set([...updatedList[index + 1]]);
        classesToPassForward.forEach(course => nextIndexSet.add(course));
        updatedList[index + 1] = Array.from(nextIndexSet);
      } else if (currentList.length > 0 && classdata !== currentList[0]) {
        // Create a new array for the next index if it doesn't exist
        // Only pass forward classes other than the clicked one
        const classesToPassForward = currentList.filter(course => course !== classdata);
        if (classesToPassForward.length > 0) {
          updatedList.push([...classesToPassForward]); 
        }
      }
      
      // If a class was added to takenList, remove clicked data from all future arrays
      if (takenListRef.current.has(classdata)) {
        for (let i = 0; i < updatedList.length; i++) {
          if(i !== index) {
            updatedList[i] = updatedList[i].filter(course => course !== classdata);
          }
        }
      }
      
      if (index + 1 < updatedList.length) {
        // Get all classes in current index that are in takenListRef
        const classesToRemove = new Set(updatedList[index].filter(course => takenListRef.current.has(course)));
      
        // Remove those classes from next index
        updatedList[index + 1] = updatedList[index + 1].filter(course => !classesToRemove.has(course));
      }

      console.log("CHECK THIS ONE::::", nextAffectedList);
  
      // Use the local affected list which is now complete
      if (nextAffectedList.length > 0) {
        // updatedList[index] = updatedList[index].filter(course => !localAffectedList.includes(course));

        for (let i = 0; i <= index; i++) {
          // Make sure this index exists in the updatedList
          if (i < updatedList.length) {
            // Filter out any courses that are in the localAffectedList
            updatedList[i] = updatedList[i].filter(course => !nextAffectedList.includes(course));
          }
        }
      }
    
      // Remove any empty arrays that might result from filtering
      const cleanedList = updatedList.filter(arr => arr.length > 0);
      
      // console.log("updated list", index, cleanedList);
      return cleanedList;
    }); 
    // console.log("Usestate LIST ", takenList, " Array LIST ", nextList);



    // ============ UPDATEING TREE =====================
    //get most recent data of 2 data list
    // setTakenListForTree(Array.from(takenList));
    // setNextListForTree(Array.from(nextList));
  };

  useEffect(() => {
    // This ensures we're using the most recent state values
    setTakenListForTree(Array.from(takenList));
    setNextListForTree(Array.from(nextList));
  }, [takenList, nextList]);
  
  const [selected, setSelected] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<string[]>([]);

  useEffect(() => {
    setOptions(findHighestNodes(tree as any)); // Force cast to CourseData
  }, [tree]);

   // Toggle selection of an option
   const toggleSelection = (option:string) => {
    if (selected.includes(option)) {
      // Remove option if already selected
      setSelected(selected.filter(item => item !== option));
    } else {
      // Add option if not selected
      setSelected([...selected, option]);
    }
  };

  // Remove a specific selected item
  const removeSelected = (option:string) => {
    setSelected(selected.filter(item => item !== option));
  };




  // ==================== Advanced Visualization =============================
  // goal: add it to tree opposite side
  // 1. add a node as a parent for bottom-up growth
  // 2. add a node as a child for horizontal expansion
  interface TreeNode {
    name: string;
    id: string;
    children?: TreeNode[];
    attributes?: {
      [key: string]: string | number;
    };
  }

  const [unifiedTree, setUnifiedTree] = useState<TreeNode>({
    name: 'Root',
    id: 'root',
    children: []
  });
  
  // State to keep track of all nodes for easy access
  const [nodesMap, setNodesMap] = useState<{[key: string]: TreeNode}>({
    'root': unifiedTree
  });
  
  // Function to add a node as a parent of another node (for bottom-up growth)
  const addNodeAsParent = (childId: string, nodeName: string, condition: string) => {
    // Create a unique ID for the new node
    const newNodeId = `node-${nodeName}-${Date.now()}`;
    
    // Check if child exists
    if (!nodesMap[childId]) {
      console.error(`Child node with ID ${childId} not found`);
      return;
    }
    
    // Create the new node that will become the parent
    const newNode: TreeNode = {
      name: nodeName,
      id: newNodeId,
      attributes: { condition, addedAt: new Date().toISOString() },
      // The current node will become a child of this new node
      children: []
    };
    
    // Update the tree structure
    setUnifiedTree(prevTree => {
      // Create a deep copy of the tree
      const newTree = JSON.parse(JSON.stringify(prevTree));
      
      const processNode = (node: TreeNode, parentNode: TreeNode | null = null, parentIndex: number = -1) => {
        // If this is the target node to replace
        if (node.id === childId) {
          // If this node is a direct child of the root
          if (parentNode && parentNode.id === 'root') {
            // Replace the child with the new node
            parentNode.children![parentIndex] = newNode;
            // Add the old node as a child of the new node
            newNode.children!.push(JSON.parse(JSON.stringify(node)));
            return true;
          }
          // If this node is deeper in the tree, we need to handle it differently
          else if (parentNode) {
            // Create the new parent node
            newNode.children!.push(JSON.parse(JSON.stringify(node)));
            // Replace the child in its parent's children array
            parentNode.children![parentIndex] = newNode;
            return true;
          }
        }
        
        // Recursively search through children
        if (node.children) {
          for (let i = 0; i < node.children.length; i++) {
            if (processNode(node.children[i], node, i)) {
              return true;
            }
          }
        }
        
        return false;
      };
      
      // Start processing from the root
      processNode(newTree);
      return newTree;
    });
    
    // Update the nodes map with the new node
    setNodesMap(prevMap => {
      const newMap = { ...prevMap };
      newMap[newNodeId] = newNode;
      return newMap;
    });
    
    return newNodeId;
  };
  
  // Function to add a completely new root level node
  const addNewRootNode = (nodeName: string, condition: string) => {
    // Create a unique ID for the new node
    const newNodeId = `node-${nodeName}-${Date.now()}`;
    
    // Create the new node
    const newNode: TreeNode = {
      name: nodeName,
      id: newNodeId,
      attributes: { condition, addedAt: new Date().toISOString() }
    };
    
    // Update the nodes map
    setNodesMap(prevMap => ({
      ...prevMap,
      [newNodeId]: newNode
    }));
    
    // Add the new node directly under the root
    setUnifiedTree(prevTree => {
      const newTree = JSON.parse(JSON.stringify(prevTree));
      if (!newTree.children) {
        newTree.children = [];
      }
      newTree.children.push(newNode);
      return newTree;
    });
    
    return newNodeId;
  };
  
  // Add multiple children to a node (for horizontal expansion)
  const addMultipleChildren = (parentId: string, names: string[], condition: string) => {
    names.forEach(name => {
      // For bottom-up growth, each new node becomes the parent
      addNodeAsChild(parentId, name, condition);
    });
  };
  
  // Add a node as a standard child (for horizontal expansion)
  const addNodeAsChild = (parentId: string, nodeName: string, condition: string) => {
    // Create a unique ID for the new node
    const newNodeId = `node-${nodeName}-${Date.now()}`;
    
    // Create the new node
    const newNode: TreeNode = {
      name: nodeName,
      id: newNodeId,
      attributes: { condition, addedAt: new Date().toISOString() }
    };
    
    // Update the nodes map
    setNodesMap(prevMap => ({
      ...prevMap,
      [newNodeId]: newNode
    }));
    
    // Update the tree structure
    setUnifiedTree(prevTree => {
      // Create a deep copy of the tree
      const newTree = JSON.parse(JSON.stringify(prevTree));
      
      const findAndAddChild = (node: TreeNode) => {
        if (node.id === parentId) {
          // Initialize children array if it doesn't exist
          if (!node.children) {
            node.children = [];
          }
          // Add the new node as a child
          node.children.push(newNode);
          return true;
        }
        
        // Recursively search through children
        if (node.children) {
          for (const child of node.children) {
            if (findAndAddChild(child)) {
              return true;
            }
          }
        }
        
        return false;
      };
      
      findAndAddChild(newTree);
      return newTree;
    });
    
    return newNodeId;
  };
  
  // Handler for adding a node (either as parent for bottom-up or as child for horizontal)
  const handleNameClick = (name: string, condition: string, targetId: string = 'root', asParent: boolean = true) => {
    if (targetId === 'root') {
      // Adding a new root level node
      return addNewRootNode(name, condition);
    } else if (asParent) {
      // Bottom-up growth: new node becomes parent of selected node
      return addNodeAsParent(targetId, name, condition);
    } else {
      // Horizontal expansion: new node becomes child of selected node
      return addNodeAsChild(targetId, name, condition);
    }
  };
  
  // Get all node IDs except the root for the dropdown
  const nodeOptions = Object.keys(nodesMap).filter(id => id !== 'root');
  
  // For selecting a node to operate on
  const [selectedNode, setSelectedNode] = useState<string>('root');
  
  // Toggle for adding as parent (bottom-up) or child (horizontal)
  const [addAsParent, setAddAsParent] = useState<boolean>(true);
  
  // Custom node rendering
  const renderCustomNode = ({ nodeDatum }: { nodeDatum: any }) => {
    // Different styling based on condition
    let nodeColor = "#1f77b4"; // default blue
    if (nodeDatum.attributes && nodeDatum.attributes.condition) {
      switch (nodeDatum.attributes.condition) {
        case 'A': nodeColor = "#2ca02c"; break; // green
        case 'B': nodeColor = "#d62728"; break; // red
        case 'C': nodeColor = "#9467bd"; break; // purple
        default: nodeColor = "#1f77b4"; break; // blue
      }
    }
    
    // Root node has a different style
    if (nodeDatum.id === 'root') {
      return (
        <g>
          <circle r={15} fill="#aaaaaa" strokeWidth={1} stroke="#666666" />
          <text
            fill="#333"
            strokeWidth="0.5"
            x="0"
            y="5"
            textAnchor="middle"
            fontSize="10"
          >
            {nodeDatum.name}
          </text>
        </g>
      );
    }
    
    return (
      <g>
        <circle r={20} fill={nodeColor} />
        <text
          fill="white"
          strokeWidth="0.5"
          x="0"
          y="5"
          textAnchor="middle"
        >
          {nodeDatum.name}
        </text>
      </g>
    );
  };


  return (
    <div className="dashboard-container">
      <div className="first-section">
        <div className="first-portion">
          {/* Add content for the first portion here */}
          <div className="init_setup_container">
            <h5>Entire Year Planner Options:</h5>
            <select 
              value={graduationDate} 
              onChange={(e) => {
                  setGraduationDate(e.target.value);
                  setError(''); // 에러 초기화
              }}
            >
              <option value="" disabled>Select your graduation date</option>
              {graduationOptions.map(option => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
              ))}
            </select> 
            {/* {error && <p style={{ color: 'red' }}>{error}</p>} */}
            <button onClick={handleEntireYearPlan}>START Entire Planner</button>
            {/* 추가 UI */}
          </div>
          <div className="entire_planner_table">
            {error === 'Start' && userGraduationDate?.map((option, index) => (
                <div key={option.value} className="graduation_row">
                  <div className="quarter_container">
                    {option.label}
                    <div className="plan_container">
                      <hr />
                      <div className="dot-container">
                        <div className="dot"></div>
                        <div className="dot"></div>
                        <div className="dot"></div>
                      </div>
                      {/* Filter classes that belong to this graduation option */}
                      {nextToTake &&
                        nextToTake[index]
                          ?.slice() // Create a copy to avoid mutating state
                          .sort((a, b) => {
                            const inTakenA = takenList.has(a);
                            const inTakenB = takenList.has(b);
                            const inNextA = nextList.has(a);
                            const inNextB = nextList.has(b);
                            const inPrevA = index - 1 >= 0 && nextToTake[index - 1].includes(a);
                            const inPrevB = index - 1 >= 0 && nextToTake[index - 1].includes(b);

                            // Sort order: 1. taken(red) 2. nextList(blue) 3. existed in prev index(green)
                            if (inTakenA !== inTakenB) return inTakenA ? -1 : 1; // Taken first
                            if (inNextA !== inNextB) return inNextA ? -1 : 1; // Next second
                            if (inPrevA !== inPrevB) return inPrevA ? -1 : 1; // Prev index third
                            return 0; // Otherwise, maintain order
                          })
                          .map((item, itemIndex) => {
                            const next = nextList.has(item);
                            const taken = takenList.has(item);
                            const existsInPreviousIndex = index - 1 >= 0 && nextToTake[index - 1].includes(item);

                            let newClass = "class_item"; // Default class
                            
                            // Priority: 1. taken(red) 2. nextList(blue) 3. existed in prev index(green)
                            if(taken) {
                              newClass = "text-red";
                            }
                            else if(existsInPreviousIndex && (taken || next)) {
                              newClass = "text-green";
                            }else if (next) {
                              newClass = "text-blue"; // Blue
                            }

                            return (
                              <div key={itemIndex} className="class_container">
                                <a
                                  className={`${newClass}`}
                                  onClick={newClass === "class_item" ? undefined : () => {
                                    addClass(item, index);
                                    
                                  }}
                                  key={item}
                                >
                                  {item}
                                </a>
                              </div>
                            );
                          })}
                    </div>
                  </div>
                </div>
            ))}
          </div>
        </div>
      </div>

      {/* display class tree */}
      <div className="second-section">

      {/* ======================== Advanced Visualization ======================== */}
      <div className="w-full">
      {/* Growth Direction Toggle */}
      <div className="mb-4 p-4 border border-gray-300 rounded">
        <h3 className="text-lg font-bold mb-2">Growth Direction</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setAddAsParent(true)}
            className={`px-4 py-2 rounded ${
              addAsParent ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'
            }`}
          >
            Bottom-Up (New nodes become parents)
          </button>
          <button
            onClick={() => setAddAsParent(false)}
            className={`px-4 py-2 rounded ${
              !addAsParent ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'
            }`}
          >
            Top-Down (New nodes become children)
          </button>
        </div>
      </div>
      
      {/* Tree Visualization */}
      <div className="w-full h-200 border border-gray-300 rounded">
        {unifiedTree.children && unifiedTree.children.length > 0 ? (
          <Tree
            data={unifiedTree}
            orientation="vertical"
            pathFunc="straight"
            translate={{ x: 200, y: 100 }}
            separation={{ siblings: 1.5, nonSiblings: 2 }}
            nodeSize={{ x: 100, y: 100 }}
            renderCustomNodeElement={renderCustomNode}
            collapsible={false}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <p>Click on a name to start building the tree</p>
          </div>
        )}
      </div>

      {/* Node Selection */}
      <div className="mt-4 p-4 border-t border-gray-300">
        <h3 className="text-lg font-bold mb-2">Select Node</h3>
        <select 
          value={selectedNode} 
          onChange={(e) => setSelectedNode(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="root">Root</option>
          {nodeOptions.map(nodeId => (
            <option key={nodeId} value={nodeId}>
              {nodesMap[nodeId]?.name || nodeId}
            </option>
          ))}
        </select>
      </div>
      
      {/* Add Single Node */}
      <div className="mt-4 p-4 border-t border-gray-300">
        <h3 className="text-lg font-bold mb-2">
          Add Single Node 
          ({addAsParent ? 'Bottom-Up: New node becomes parent' : 'Top-Down: New node becomes child'})
        </h3>
        <div className="grid grid-cols-4 gap-2">
          {['Alice', 'Bob', 'Charlie', 'David'].map((name) => (
            <div key={name} className="flex flex-col gap-2">
              <button
                onClick={() => handleNameClick(name, 'A', selectedNode, addAsParent)}
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Add {name} (A)
              </button>
              <button
                onClick={() => handleNameClick(name, 'B', selectedNode, addAsParent)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Add {name} (B)
              </button>
              <button
                onClick={() => handleNameClick(name, 'C', selectedNode, addAsParent)}
                className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600"
              >
                Add {name} (C)
              </button>
            </div>
          ))}
        </div>
      </div>
      
      {/* Add Multiple Nodes (only in horizontal mode) */}
      {!addAsParent && (
        <div className="mt-4 p-4 border-t border-gray-300">
          <h3 className="text-lg font-bold mb-2">Add Multiple Children</h3>
          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => addMultipleChildren(selectedNode, ['X', 'Y', 'Z'], 'A')}
              className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Add X, Y, Z as children (A)
            </button>
            <button
              onClick={() => addMultipleChildren(selectedNode, ['Alpha', 'Beta', 'Gamma'], 'B')}
              className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Add Alpha, Beta, Gamma (B)
            </button>
            <button
              onClick={() => addMultipleChildren(selectedNode, ['One', 'Two', 'Three'], 'C')}
              className="px-3 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            >
              Add One, Two, Three (C)
            </button>
          </div>
        </div>
      )}
    </div>
      </div>      
    </div>
  );
};
