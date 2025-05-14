// import { TreeVisualizer2 } from "../../../TREE/TreeVisualizer2";

import { useEffect, useState } from "react";
import { usePathFinder } from "./PathFinderContext";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { ranker } from "@/utils/helper_common/ranker";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";
import { Info,ChevronRight  } from "lucide-react";
import { Separator } from "@radix-ui/react-separator";

// import { Tree_Recommand_Visual2 } from "@/TREE/TreeVisualizer2";
import { TreeVisualizer2 }  from "@/TREE/TreeVisualizer2";
import { Tree_Recommand_Visual } from "@/TREE/TreeVisualizer_recommand";
import { Tree_Recommand_Visual2 } from "@/TREE/TreeVisualizer_recommand2";

export interface SortedList {
  course_name:string;
  rank:number;
}

export const Recommend = () => {
    const [sorted_list, setSorted_list] = useState<SortedList[]>([{course_name: "COMPSCI 175", rank: 12.5},{course_name: "COMPSCI 178", rank: 9.5},
      {course_name: "MATH 2B", rank: 7.5}, {course_name: "CLASS D", rank: 12.3}, {course_name: "I&CSCI 32", rank: 12.3}, {course_name: "I&CSCI 6B", rank: 12.3}])


    const { 
      tree, nextListForTree, takenListForTree
      } = usePathFinder();
    
    //null checking for 'tree' ==> NO NEED -> it only render if user clicks the start button
    // let sorted_list = ranker(tree! , nextListForTree,list1, list2, list3)
    // setSorted_list(ranker(tree! , nextListForTree,list1, list2, list3))
    
    useEffect(() => {
      //update the list if user addes more class
      console.log("redner!", tree)
      // setSorted_list(ranker(tree! , nextListForTree,list1, list2, list3))
    },[nextListForTree, tree]);

    return (
      <div className="w-full px-4 mt-6 h-[75vh] min-h-[68vh]">
        <ScrollArea className="w-full h-full rounded-md border shadow-sm">
          <div className="p-4">
            <h4 className="mb-4 text-sm font-medium leading-none sticky top-0 bg-white z-10">
              Course Recommandation : based on your progress
            </h4>
            {sorted_list.map((courses) => (
              <div key={courses.course_name} className="flex items-start gap-2 py-2">
              <div className="flex-1 text-sm">
                <p>{courses.course_name} : {courses.rank}</p>
              </div>
            
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-gray-500 hover:text-blue-500"
                  >
                    <Info className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
            
                <PopoverContent className="w-72 text-sm space-y-3">
                  <div>
                    <p className="font-medium text-gray-900">{courses.course_name}</p>
                    <p className="text-muted-foreground text-xs">Details about this course go here.</p>
                  </div>
            
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2 px-2 py-1 text-xs h-8"
                      >
                        Visualize Tree
                        <ChevronRight className="h-4 w-4 text-gray-600" />
                      </Button>
                    </DropdownMenuTrigger>
            
                    <DropdownMenuContent
                      side="right"
                      align="start"
                      className="w-[600px] h-[400px] p-4 shadow-lg"
                    >
                      <DropdownMenuGroup className="w-full h-full">
                        <p className="text-sm text-muted-foreground mb-1 pl-1 font-medium">
                          Understand the Tree
                        </p>
                        <DropdownMenuSeparator />
                        <div className="flex justify-center items-center h-full">
                          <Tree_Recommand_Visual
                            data={tree}
                            userlist={courses.course_name}
                            takenlist={takenListForTree}
                            nextlist={nextListForTree}
                          />
                        </div>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </PopoverContent>
              </Popover>
            
              <Separator orientation="vertical" className="h-6 mx-2" />
            </div>
            ))}
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </div>
    )
}