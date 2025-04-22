
import { usePathFinder } from './PathFinderContext';
import { useState,useEffect,useRef } from "react";

export const UserIntersection = () => {
    const { 
        nextToTake, setNextToTake,
        nextList, setNextList,
        // selected, setSelected,
        setTakenListForTree, setNextListForTree,
        tree, plannerStatus, userGraduationDate,
        setSelected1, setSelected2,
        selected_tree1, selected_tree2
      } = usePathFinder();



    //data processing functions will be here 
    // sepearete functiosn later

    const takenListRef = useRef(new Set<string>());
    
    const [takenList, setTakenList] = useState(new Set<string>());
    //const [nextList, setNextList] = useState<Set<string>>(new Set());
      
    //const [takenListForTree, setTakenListForTree] = useState<string[]>([]);
    //const [nextListForTree, setNextListForTree] = useState<string[]>([]);
      
    //const [selected, setSelected] = useState<string[]>([]);
    //const [isOpen, setIsOpen] = useState(false);
    //const [options, setOptions] = useState<string[]>([]);
    
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
    
    useEffect(() => {
    // This ensures we're using the most recent state values
    setTakenListForTree(Array.from(takenList));
    setNextListForTree(Array.from(nextList));
    }, [takenList, nextList]);
      
    //   useEffect(() => {
    //     setOptions(findHighestNodes(tree as any)); // Force cast to CourseData
    //   }, [tree]);
    
    const handleStudentClick = async (classdata: string, index: number) => {

        if(!selected_tree1)
          setSelected1(classdata)
        else if(!selected_tree2)
          setSelected2(classdata)
        else {
          // random
          if(index % 2 == 0)
            setSelected2(classdata)
          else
            setSelected1(classdata)
        }
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
    };
    
    

    return (
        <div>
            <div className="entire_planner_table">
            {plannerStatus && userGraduationDate?.map((option, index) => (
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
                              <div key={itemIndex} className="class_container"
                              >
                                <a
                                  className={`${newClass}`}
                                  onClick={newClass === "class_item" ? undefined : () => handleStudentClick(item, index)}
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
    )
}