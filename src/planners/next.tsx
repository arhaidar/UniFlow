import React, { useEffect, useState } from "react";
import "./next.css";
import filterIcon from '../icons/panel.png'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"

interface TimeSlot {
  days: string[];
  start: number;
  end: number;
}

interface Course {
  courseName: string;
  sectionId: string;
  lecture: TimeSlot;
  discussions: TimeSlot[];
}

const formatTime = (time: number) => {
  const hours = Math.floor(time / 100);
  const minutes = time % 100;
  const period = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${period}`;
};

interface NextPageProps {
  plan: Course[][];
}

const NextPage: React.FC<NextPageProps> = ({plan}) => {
  // ================== NEW STATES FOR FILTERING ==================
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [filteredPlan, setFilteredPlan] = useState<Course[][]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const combinationsPerPage = 10;
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  useEffect (() => { // store the original plan in filteredPlan 
    setFilteredPlan(plan);
  }, [plan]);

  // Open or close the filter menu
  const toggleFilterMenu = () => {
    setShowFilterMenu(!showFilterMenu);
  };

  useEffect(() => {
    // For example, assume user enters classes separated by commas:
    // e.g. "COMPSCI 161, COMPSCI 171, COMPSCI 178"
    const searchCourses = filterText.split(",").map((s) => s.trim()).filter(Boolean);
    if (searchCourses.length === 0) {
      setFilteredPlan(plan);
    } else {
      const newPlan = plan.filter((combination) => {
        return searchCourses.every((search) =>
          combination.some((course) =>
            course.courseName.toLowerCase().includes(search.toLowerCase())
          )
        );
      });
      setFilteredPlan(newPlan);
    }
    setCurrentPage(0);
  }, [filterText, plan]);

  //=====================EXISTING STATES ========================
  const [selectedNumber, setSelectedNumber] = useState<number>(3);
  const [selectedCombination, setSelectedCombination] = useState<number | null>(null);  

  const [selectedDiscussions, setSelectedDiscussions] = useState<
    {combinationIndex: number; courseIndex: number; discussionIndex: number; days:string[]; start: number; end: number;}[]
  >([]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDiscussions([]);
    setSelectedNumber(Number(event.target.value));
  };

  // Filter + sort logic for displayed plan

  console.log("plan", plan)
  let displayedPlan = filteredPlan.filter((combination) => combination.length === selectedNumber);
  // Pagination
  const paginatedPlan = displayedPlan.slice(
    currentPage * combinationsPerPage,
    (currentPage + 1) * combinationsPerPage
  );

  const handleDisplayDetails = (combinationIdx: number) => {
    setSelectedCombination(prev => (prev === combinationIdx ? null : combinationIdx));
  };

  // discussions time conflict (time overlap)
  const isConflicting = (start1: number, end1: number, start2: number, end2: number) => {
    return !(end1 <= start2 || start1 >= end2);
  };

  const expandDays = (days: string[]): string[] => {
    const dayMapping: { [key: string]: string[] } = {
        'M': ['M'],
        'Tu': ['Tu'],
        'W': ['W'],
        'Th': ['Th'],
        'F': ['F'],
        'MW': ['M','W'],
        'MWF': ['M', 'W', 'F'],
        'TuTh': ['Tu', 'Th'],
        'WF': ['W', 'F'],
    };

    return days.flatMap(day => dayMapping[day] || [day]); 
  }

  const daysOverlap = (days1: string[], days2: string[]): boolean => {
    const allDays1 = expandDays(days1);
    const allDays2 = expandDays(days2);
    return allDays1.some(day => allDays2.includes(day));
  }

  // Function to handle clicking on a discussion
  const handleDiscussionClick = (
    combinationIndex: number,
    courseIndex: number,
    discussionIndex: number,
    days: string[],
    start: number,
    end: number
  ) => {
    setSelectedDiscussions((prev) => {
      const isAlreadySelected = prev.some(
        (d) =>
          d.combinationIndex === combinationIndex &&
          d.courseIndex === courseIndex &&
          d.discussionIndex === discussionIndex
      );

      if (isAlreadySelected) {
        return prev.filter(
          (d) =>
            !(d.combinationIndex === combinationIndex &&
              d.courseIndex === courseIndex &&
              d.discussionIndex === discussionIndex)
        );
      } else {
        return [...prev, { combinationIndex, courseIndex, discussionIndex, days, start, end }];
      }
    });
  };

  return (
    <div className="next_pagemain">
      {/* Class count dropdown at the top */}
      <div className="flex items-center gap-2 mb-4">
        <label htmlFor="number-select" className="text-sm font-medium">
          Select the number of classes for the quarter
        </label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-[100px]">
              {selectedNumber} <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {[1, 2, 3, 4, 5, 6].map((number) => (
              <Button
                key={number}
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  setSelectedNumber(number);
                  setSelectedDiscussions([]);
                  setCurrentPage(0);
                }}
              >
                {number}
              </Button>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {/* Filter search bar */}
      <div className="flex items-center py-4">
        <Input
          type="text"
          placeholder="Filter classes (e.g., COMPSCI 161, COMPSCI 171)"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="w-[400px]"
        />
      </div>
      
      {/**/}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-6"></TableHead>
              {Array.from({ length: selectedNumber }).map((_, idx) => (
                <TableHead key={idx} className="px-6">Class {idx + 1}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedPlan.length ? (
              paginatedPlan.map((combination, idx) => (
                <React.Fragment key={idx}>
                  <TableRow>
                    <TableCell className="px-6">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setExpandedRow(expandedRow === idx ? null : idx)}
                        aria-label="Expand row"
                      >
                        <ChevronDown className={expandedRow === idx ? "rotate-180 transition-transform" : "transition-transform"} />
                      </Button>
                    </TableCell>
                    {combination.map((course, cIdx) => (
                      <TableCell key={cIdx} className="px-6">
                        {course.courseName} <span>{course.sectionId}</span>
                      </TableCell>
                    ))}
                    {/* empty cells if less than selectedNumber */}
                    {combination.length < selectedNumber &&
                      Array.from({ length: selectedNumber - combination.length }).map((_, i) => (
                        <TableCell key={`empty-${i}`} className="px-6"></TableCell>
                      ))}
                  </TableRow>
                  {expandedRow === idx && (
                    <TableRow>
                      <TableCell colSpan={selectedNumber + 1} className="bg-muted px-6">
                        <div className="flex gap-4">
                          {combination.map((course, courseIdx) => (
                            <div key={courseIdx} className="w-full">
                              <div className="font-semibold mb-2">{course.courseName} <span>{course.sectionId}</span></div>
                              <div className="mb-2">
                                <div className="font-medium">Lecture</div>
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead className="px-6">Days</TableHead>
                                      <TableHead className="px-6">Start</TableHead>
                                      <TableHead className="px-6">End</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    <TableRow>
                                      <TableCell className="px-6">{course.lecture.days.join(", ")}</TableCell>
                                      <TableCell className="px-6">{formatTime(course.lecture.start)}</TableCell>
                                      <TableCell className="px-6">{formatTime(course.lecture.end)}</TableCell>
                                    </TableRow>
                                  </TableBody>
                                </Table>
                              </div>
                              <div>
                                <div className="font-medium">Discussions</div>
                                {course.discussions.length > 0 ? (
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead className="px-6">Days</TableHead>
                                        <TableHead className="px-6">Start</TableHead>
                                        <TableHead className="px-6">End</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {course.discussions.map((discussion, disIndex) => {
                                        const isSelected = selectedDiscussions.some(
                                          (d) =>
                                            d.combinationIndex === currentPage * combinationsPerPage + idx &&
                                            d.courseIndex === courseIdx &&
                                            d.discussionIndex === disIndex
                                        );
                                        const conflict = selectedDiscussions.some(
                                          (d) =>
                                            d.combinationIndex === currentPage * combinationsPerPage + idx &&
                                            d.courseIndex !== courseIdx &&
                                            daysOverlap(d.days, discussion.days) &&
                                            isConflicting(d.start, d.end, discussion.start, discussion.end)
                                        );
                                        return (
                                          <TableRow
                                            key={disIndex}
                                            className="discussion_table"
                                            onClick={() => {
                                              if (!conflict) {
                                                handleDiscussionClick(
                                                  currentPage * combinationsPerPage + idx,
                                                  courseIdx,
                                                  disIndex,
                                                  discussion.days,
                                                  discussion.start,
                                                  discussion.end
                                                );
                                              }
                                            }}
                                            style={{
                                              textDecoration: conflict && !isSelected ? "line-through" : "none",
                                              backgroundColor: isSelected ? "yellow" : conflict && !isSelected ? "#d3d3d3" : "transparent",
                                              cursor: conflict && !isSelected ? "not-allowed" : "pointer",
                                            }}
                                          >
                                            <TableCell className="px-6">{discussion.days.join(", ")}</TableCell>
                                            <TableCell className="px-6">{formatTime(discussion.start)}</TableCell>
                                            <TableCell className="px-6">{formatTime(discussion.end)}</TableCell>
                                          </TableRow>
                                        );
                                      })}
                                    </TableBody>
                                  </Table>
                                ) : (
                                  <div className="text-muted-foreground">No discussions</div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={selectedNumber + 1} className="h-24 text-center px-6">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {displayedPlan.length === 0 ? (
            '0 of 0 combination(s) shown.'
          ) : (
            `${currentPage * combinationsPerPage + 1}-${Math.min((currentPage + 1) * combinationsPerPage, displayedPlan.length)} of ${displayedPlan.length} combination(s) shown.`
          )}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
            disabled={currentPage === 0}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={((currentPage + 1) * combinationsPerPage) >= displayedPlan.length}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NextPage;
