import React, { useState,useEffect,useRef } from "react";
import { TreeVisualizer } from "../../TREE/TreeVisualizer"
import { TreeVisualizer2 } from "../../TREE/TreeVisualizer2";
import { findHighestNodes } from "../../TREE/TreeVisualizer2";

import './entire.css'
import { CourseState } from "../../mainpage";
import { useCourseContext } from '../../mainpage'; //sharing data

import { Preference } from "../../majorComponents/CS_components/preference";
import { progress_upadate } from "../../utils/helper_common/progress_update";

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

export const PathFinder = () => {
  const { state, dispatch } = useCourseContext();

  useEffect(() => {
      progress_upadate(dispatch,state)
  }, []);
  
  const handleToggleTreeData = (tree: CourseData) => {
    dispatch({ type: 'ADD_TREE', payload: tree });
  };

  const copy_state = state; //get copy of it (don't touch original)
  
  // console.log(copy_state)
  const combineStateToJSON = (graduationDate?: string): object => {
    return {
      taken: Array.from(copy_state.taken),
      need_complete: Array.from(copy_state.need_complete),
      need_elective: Array.from(copy_state.need_specilazation),
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
  // const getNextClass = async (wholeList: object) => {
  //   try {
  //     const response = await fetch('http://localhost:3000/process/nextclass', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(wholeList), // Only stringify here
  //     });
  
  //     if (!response.ok) {
  //       throw new Error('Network response was not ok');
  //     }
  
  //     const result = await response.json();
  //     return result;
  //   } catch (error) {
  //     console.error('Error fetching next plan:', error);
  //     throw error;
  //   }
  // };


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

      console.log("FRONTEND DATA:::::", state)
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


  const handleGood = async (classdata: string, index: number) => {
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

  // // =======================================================================
  // const takenCompleteCount = Array.from(copy_state.need_complete)
  //   .filter(item => takenList.has(item)).length;
  
  // const takenElectiveCount = Array.from(copy_state.need_elective)
  //   .filter(item => takenList.has(item)).length;
  
  // const takenNeedTakeCount = Array.from(copy_state.need_take)
  //   .filter(item => takenList.has(item)).length;
  
  // // Calculate adjusted total
  // const adjustedTotal = copy_state.num_total - (takenCompleteCount + takenElectiveCount + takenNeedTakeCount);
  // // =======================================================================


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
                                  onClick={newClass === "class_item" ? undefined : () => handleGood(item, index)}
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
      <div className="second-section">
        <div className="dropdown-container">
          <button
            className="dropdown-button"
            onClick={() => setIsOpen(!isOpen)}
          >
            Select options
          </button>

          {isOpen && (
            <ul className="dropdown-options">
              {options.map((option, index) => (
                <li
                  key={index}
                  className={`option-item ${selected.includes(option) ? 'selected' : ''}`}
                  onClick={() => toggleSelection(option)}
                >
                  {option}
                  {selected.includes(option) && <span className="checkmark">✓</span>}
                </li>
              ))}
            </ul>
          )}

          {/* Display selected items in separate boxes */}
          {selected.length > 0 && (
            <div className="selected-items-container">
              {selected.map((item, index) => (
                <div key={index} className="selected-item">
                  {item}
                  <span 
                    className="remove-btn" 
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent dropdown from toggling
                      removeSelected(item);
                    }}
                  >
                    ×
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <TreeVisualizer2 
          data={tree} 
          userlist={selected} 
          takenlist={takenListForTree} 
          nextlist={nextListForTree} 
        />        
      </div>      
    </div>
  );
};
