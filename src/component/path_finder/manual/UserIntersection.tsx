
import { usePathFinder } from './PathFinderContext';
import { useState,useEffect,useRef } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Info,ChevronRight  } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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

    const takenListRef = useRef(new Set<string>());
    
    const [takenList, setTakenList] = useState(new Set<string>());
    
    const findParent = (childCourse: string) => {
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
    setTakenListForTree(Array.from(takenList));
    setNextListForTree(Array.from(nextList));
    }, [takenList, nextList]);
      
    const addTreeView = (classdata:string, index:number, choose:number) => {
      if(choose == 1) {
        setSelected1(classdata)
      }
      else {
        setSelected2(classdata)
      }

      // if(!selected_tree1)
      //   setSelected1(classdata)
      // else if(!selected_tree2)
      //   setSelected2(classdata)
      // else {
      //   // random
      //   if(index % 2 == 0)
      //     setSelected2(classdata)
      //   else
      //     setSelected1(classdata)
      // }
    }
    const handleStudentClick = async (classdata: string, index: number) => {

        // if(!selected_tree1)
        //   setSelected1(classdata)
        // else if(!selected_tree2)
        //   setSelected2(classdata)
        // else {
        //   // random
        //   if(index % 2 == 0)
        //     setSelected2(classdata)
        //   else
        //     setSelected1(classdata)
        // }
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

            // console.log("CHECK THIS ONE::::", nextAffectedList);
        
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
      <div className="w-full px-4 mt-6 h-[75vh] min-h-[68vh]">
        <ScrollArea className="w-full h-full" type="always">
          <div className="flex flex-row gap-3 min-w-fit">
            {plannerStatus && userGraduationDate?.map((option, index) => (
              <div key={index} className="min-w-[222px] max-h-[80vh]">
                <div className="shadow-md border border-gray-300 bg-[#F4F7FF] rounded-lg p-3 flex flex-col gap-1">
                  <h2 className="text-sm font-semibold text-gray-700 text-center">{option.label}</h2>
                  <hr className="my-0 border-gray-300" />
                  <div className="flex flex-col items-center gap-1.5">
                    {[0, 0.2, 0.4].map((delay, idx) => (
                      <div
                        key={idx}
                        className="w-1 h-1 bg-black rounded-full"
                        style={{ animation: 'blink 1.5s infinite', animationDelay: `${delay}s` }}
                      ></div>
                    ))}
                  </div>

                  <ScrollArea className="h-[calc(80vh-80px)] pr-1">
                    {nextToTake &&
                      nextToTake[index]
                        ?.slice()
                        .sort((a, b) => {
                          const inTakenA = takenList.has(a);
                          const inTakenB = takenList.has(b);
                          const inNextA = nextList.has(a);
                          const inNextB = nextList.has(b);
                          const inPrevA = index - 1 >= 0 && nextToTake[index - 1].includes(a);
                          const inPrevB = index - 1 >= 0 && nextToTake[index - 1].includes(b);

                          if (inTakenA !== inTakenB) return inTakenA ? -1 : 1;
                          if (inNextA !== inNextB) return inNextA ? -1 : 1;
                          if (inPrevA !== inPrevB) return inPrevA ? -1 : 1;
                          return 0;
                        })
                        .map((item, itemIndex) => {
                          const next = nextList.has(item);
                          const taken = takenList.has(item);
                          const existsInPreviousIndex = index - 1 >= 0 && nextToTake[index - 1].includes(item);

                          let newClass = "text-gray-800";
                          if (taken) newClass = "text-red-500";
                          else if (existsInPreviousIndex && (taken || next)) newClass = "text-green-500";
                          else if (next) newClass = "text-blue-500";

                          return (
                            <div key={itemIndex} className="relative rounded-md bg-white shadow-sm border border-gray-300 px-2 py-1.5 my-0.5 flex justify-between items-center">
                              <a
                                className={`block text-sm font-medium cursor-pointer ${newClass}`}
                                onClick={newClass === "text-gray-800" ? undefined : () => handleStudentClick(item, index)}
                              >
                                {item}
                              </a>
                              {/* Info Icon with Popover */}
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-5 w-5 text-gray-500 hover:text-blue-500">
                                    <Info className="h-4 w-4" />
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-56 text-sm">
                                  <p><strong>{item}</strong> - Details about this course will go here.</p>
                                  <p>Course Info</p>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="outline" size="icon" className="h-4 w-4">
                                        {/* add to tree */}
                                        <ChevronRight className="text-sm text-gray-600" />
                                      </Button>
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent align="end" className="w-[250px]">

                                      <DropdownMenuGroup>
                                        <p className="text-xs text-muted-foreground pt-1">Select the section</p>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => addTreeView(item, index,1)}>Section 1</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => addTreeView(item, index,2)}>Section 2</DropdownMenuItem>
                                      </DropdownMenuGroup>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                            
                                  
                      
                                </PopoverContent>
                              </Popover>
                            </div>
                          );
                        })}
                  </ScrollArea>
                </div>
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    )
}