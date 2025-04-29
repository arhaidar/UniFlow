import React, { useEffect, useState } from "react";
import "./next.css";
import filterIcon from '../icons/panel.png'

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

interface PlanItem {
  combination: Course[];
  total_rank: number;
}
interface NextPageProps {
  plan: PlanItem[];
}

const NextPage: React.FC<NextPageProps> = ({plan}) => {

  // ================== NEW STATES FOR FILTERING ==================
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [filteredPlan, setFilteredPlan] = useState<PlanItem[]>([]);

  useEffect (() => { // store the original plan in filteredPlan 
    setFilteredPlan(plan);
  }, [plan]);

  // Open or close the filter menu
  const toggleFilterMenu = () => {
    setShowFilterMenu(!showFilterMenu);
  };

  const handleApplyFilter = () => {
    // For example, assume user enters classes separated by commas:
    // e.g. "COMPSCI 161, COMPSCI 171, COMPSCI 178"
    const searchCourses = filterText.split(",").map((s) => s.trim()).filter(Boolean);

    if (searchCourses.length === 0) {
      // If nothing typed, reset to full plan
      setFilteredPlan(plan);
    } else {
      // Filter plan so each combination must have ALL the classes
      const newPlan = plan.filter((item) => {
        return searchCourses.every((search) =>
          item.combination.some((course) =>
            course.courseName.toLowerCase().includes(search.toLowerCase())
          )
        );
      });
      setFilteredPlan(newPlan);
    }

    // Optionally close the filter menu after applying
    setShowFilterMenu(false);
  };

 //=====================EXISTING STATES ========================
  const [selectedNumber, setSelectedNumber] = useState<number>(3);
  const [selectedCombination, setSelectedCombination] = useState<number | null>(null);  

  const [selectedDiscussions, setSelectedDiscussions] = useState<
    {combinationIndex: number; courseIndex: number; discussionIndex: number; days:string[]; start: number; end: number;}[]
  >([]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    //reset other # of combination's selected discussion????
    // pros => get rid of user's mistake
    // cons => user might want to keep it
    setSelectedDiscussions([]);

    setSelectedNumber(Number(event.target.value));
  };

  //plan always stays here => beucase render sequence will get # of class user wants to see to filter!
  plan = plan.filter(item => item.combination.length === selectedNumber);
  // plan = plan.filter(item => !item.combination.some(itme2 => itme2.courseName.includes("139W")) && item.combination.length === 3);
  plan = plan.sort((a,b) => b.total_rank - a.total_rank);

   // Filter + sort logic for displayed plan
   let displayedPlan = filteredPlan
   .filter((item) => item.combination.length === selectedNumber)
   .sort((a, b) => b.total_rank - a.total_rank);

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

    const check = allDays1.some(day => allDays2.includes(day));
    if(check) {
      return true;
    }
    else {
      return false;
    }
    // return allDays1.some(day => allDays2.includes(day));
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
        // If already selected, remove it from the array (toggle off)
        return prev.filter(
          (d) =>
            !(d.combinationIndex === combinationIndex &&
              d.courseIndex === courseIndex &&
              d.discussionIndex === discussionIndex)
        );
      } else {
        // Otherwise, add it to the array (toggle on)
        return [...prev, { combinationIndex, courseIndex, discussionIndex,days, start, end }];
      }
    });
  };

  

   // ------------------------ RENDER ------------------------
  return (
    <div className="next_pagemain">
      <div 
        className="top_bar" 
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
      >
        <img id="filter_icon" src={filterIcon} alt="Filter" onClick={toggleFilterMenu} />

        {/* # of classes dropdown */}
        <div className="courseNumSelect">
          <label htmlFor="number-select">Select the number of classes for the quarter</label>
          <select id="number-select" onChange={handleChange}>
            <option value="">3</option>
            {[1, 2, 3, 4, 5, 6].map((number) => (
              <option key={number} value={number}>
                {number}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ========== POPUP FILTER MENU ========== */}
      {showFilterMenu && (
        <div className="filter_popup">
          <div className="filter_popup_content">
            <h3>Filter Combinations</h3>
            <p>Enter classes separated by commas (e.g., COMPSCI 161, COMPSCI 171)</p>
            
            <input
              type="text"
              placeholder="COMPSCI 161, COMPSCI 171"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
            
            <div style={{ marginTop: "1rem" }}>
              <button onClick={handleApplyFilter} style={{ marginRight: "8px" }}>
                Apply
              </button>
              <button onClick={toggleFilterMenu}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ========== TABLE OF COMBINATIONS ========== */}
      {selectedNumber !== 0 && displayedPlan.map((item, combinationIdx) => (
        <table key={combinationIdx} className="schedule-table">
          <thead onClick={() => handleDisplayDetails(combinationIdx)} className="combination_container">
            <tr className="combination_list">
              {item.combination.map((course, courseIdx) => (
                <th
                  className="combination"
                  style={{ width: `${100 / item.combination.length}%` }}
                  key={courseIdx}
                >
                  {course.courseName} <span>{course.sectionId}</span>
                  <span className="total_rank">Total Rank: {item.total_rank}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="combination_details_table">
            <tr className="combination_details">
              {selectedCombination === combinationIdx &&
                item.combination.map((course, courseIdx) => (
                  <td
                    key={courseIdx}
                    className="course-cell"
                    style={{ width: `${100 / item.combination.length}%` }}
                  >
                    {/* Lecture info */}
                  <div className="Lec_cell">
                    <p>Section: {course.sectionId}</p>
                    <table className="Lec_table">
                      <tr>
                        <th>Days</th>
                        <th>Start</th>
                        <th>End</th>
                      </tr>
                      <tbody>
                        <tr className="lecture_table">
                          <th>{course.lecture.days.join(", ")}</th>
                          <th>{formatTime(course.lecture.start)}</th>
                          <th>{formatTime(course.lecture.end)}</th>
                        </tr>
                      </tbody>
                    </table>
                    {/* <p>
                      Lecture: {course.lecture.days.join(", ")} | {formatTime(course.lecture.start)} - {formatTime(course.lecture.end)}
                    </p> */}
                  </div>

                    {/* Discussion info */}
                  <div className="Dis_cell">
                    <p>Discussion: </p>
                    {course.discussions.length > 0 && (
                    <table className="Dis_table">
                      <thead>
                        <tr>
                          <th>Days</th>
                          <th>Start</th>
                          <th>End</th>
                        </tr>
                      </thead>
                      <tbody>
                      {course.discussions.map((discussion, disIndex) => {
                        // Check if the discussion is selected
                        const isSelected = selectedDiscussions.some(
                            (d) =>
                            d.combinationIndex === combinationIdx &&
                            d.courseIndex === courseIdx &&
                            d.discussionIndex === disIndex
                        );
                        // Check for conflicts:
                        // 1. Same combination
                        // 2. Conflicting time (same course or different courses)
                        const conflict = selectedDiscussions.some(
                            (d) =>
                            d.combinationIndex === combinationIdx && // UNDER Same combination
                            d.courseIndex !== courseIdx && //differnt class in same combination
                            ( // Different course or conflicting time
                              daysOverlap(d.days, discussion.days) &&
                              isConflicting(d.start, d.end, discussion.start, discussion.end) //conflicting time
                            )
                        );

                        return (
                            <tr
                              key={disIndex}
                              className="discussion_table"
                                onClick={() =>
                                  {if(!conflict) //prevent user mistake to click onflicted one 
                                    {handleDiscussionClick(combinationIdx, courseIdx, disIndex, discussion.days, discussion.start, discussion.end)
                                  }}
                                }
                              style={{
                                  // Strikethrough if conflicting and not selected
                                  textDecoration: conflict && !isSelected ? "line-through" : "none",
                                  // Yellow for selected, gray for conflicts
                                  backgroundColor: isSelected ? "yellow" : conflict && !isSelected ? "#d3d3d3" : "transparent", 
                                  cursor: "pointer", // Pointer cursor on hover
                              }}
                            >
                            <td>{discussion.days}</td>
                            <td>{formatTime(discussion.start)}</td>
                            <td>{formatTime(discussion.end)}</td>
                            </tr>
                        );
                        })}
                      </tbody>
                    </table>
                    )}
                  </div>
                  </td>
                ))
              }
            </tr>
          </tbody>
        </table>
      ))}
    </div>
  );
};

export default NextPage;
