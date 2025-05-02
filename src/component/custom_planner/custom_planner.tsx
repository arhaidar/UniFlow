// This file is now fully refactored to use Tailwind CSS utility classes only.
import React, { useState, useEffect } from 'react';
import { useCourseContext } from '../../mainpage'; //sharing data

import nextIcon from '../../icons/next_icon.png';
import entireIcon from '../../icons/entire_icon.png';
import alterIcon from '../../icons/alter_icon.png';
import loadingIcon from '../../icons/loading.gif'

import NextPage from '../../planners/next';

// import '../css/cs1_ver2.css';
// import '../../css/page3.css' //OLD
import './custom_planner.css'
import { ChevronDown } from "lucide-react";

import { Search } from "lucide-react";

// Define the interface
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

interface Final_ClassWithRank {
  value: string; // The node value (class name)
  rank: number;  // How many valid steps upward were counted
}

// this is for the search bar
interface Course {
  // If you just store strings, you might not need an interface
  // But let's assume it's just a string name from your JSON
  name?: string;
}


const majorNames: Record<string, string> = {
  cs: "Computer Science, B.S.",
  ae: "Aerospace Engineering, B.S.",
  be: "Biomedical Engineering, B.S.",
  che: "Chemical Engineering, B.S.",
  cve: "Civil Engineering, B.S.",
  ce: "Computer Engineering, B.S.",
  ee: "Electrical Engineering, B.S.",
  me: "Mechanical Engineering, B.S.",
};

export const CustomPlanner:React.FC = () => {
  const { state, dispatch } = useCourseContext();
  const [userMajor, setUserMajor] = useState<string>('');


  // setUserMajor(state.major); // Get the user's major from the context
  
  const combineStateToJSON = (): object => {
    return {
      major: 'cs',
      customlist: selectedCourses
    };
  };
  const remainingClasses = Math.max(0, 11 - state.num_total);
  const remainingProjects = Math.max(0, 2 - state.num_project);

  // ========================= PLANNER SELECTION ================================
  const [planner, setPlanner] = useState<string>("");  
  const handleNextQuarterPlanner = () => {
    setPlanner('Next Quarter Planner');
  };
  // ========================= END PLANNER SELECTION ================================

  // ========================= NEXT PLANNER ================================
  const [plan, setPlan] = useState<Course[][]>([]);
  const [loading, setLoading] = useState(false);

  const handleNextQuarterPlan = async () => {
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);  // Set loading to false after 3 seconds
    }, 3000);
    
    const combinedData = combineStateToJSON(); //json objectset to BACKEND
    const result = await getCustomPlan(combinedData);  // Pass the object
    console.log("FROM THE BACKEND SERVER:::::", result)

    //   export interface Section {
    //     courseName: string;
    //     sectionId: string;
    //     lecture: TimeSlot | null;
    //     discussions: TimeSlot[];
    // }
    if (result.success) {
      setPlan(result.plan);
    }
  };


  // ==================== FOR Search Data =============================
  const [nextQuarterList, setNextQuarterList] = useState<string[]>();

  const getNextList = async (wholeList: object) => {
    try {
      const response = await fetch('http://localhost:3000/process/nextlist', {
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

  // For selected courses (once user clicks on a suggestion)
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);

  const getCustomPlan = async (wholeList: object) => {
    try {
      const response = await fetch('http://localhost:3000/process/customplan', {
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

  // For the search bar
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredClasses, setFilteredClasses] = useState<string[]>([]);

  const getSearchResult = async () => {
    // console.log("user major", major)
    // const combinedData = combineStateToJSON(); //json objectset to BACKEND
    // const result = await getNextList(combinedData);  // Pass the object
    // console.log("FROM THE BACKEND SERVER:::::", result)
    // if (result.success) {
    //   setNextQuarterList(result.plan);
    // }

    //instead use json file
    fetch('/nextlist.json')
    .then(response => response.json())
      .then(data => {
        console.log(data);
        setNextQuarterList(data); // JSON 데이터를 상태에 저장
      })
      .catch(error => {
        console.error("Error loading JSON:", error);
      });
      
  };

  // ==================== FOR Search Data =============================

  // =========================== RESULT DATA =================================
  const [selected, setSelected] = useState(state.taken); 
  const toggleSelection = (value: any) => {
    setSelected(selected === value ? value : value);
  };
  // =========================== END RESULT DATA =================================

  // ===================== RENDER TO UPDATE DATA ====================
  const [major, setMajor] = useState<string>('');
  useEffect(() => {
    setMajor(userMajor);
    getSearchResult(); //for search data
  },[]);

  // A function that filters nextQuarterList as the user types
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (!query) {
      // If search bar is empty, clear filtered results
      setFilteredClasses([]);
      return;
    }

    // Filter the nextQuarterList by partial match (case-insensitive)
    // const filtered = nextQuarterList.filter(course =>
    //   course.toLowerCase().includes(query.toLowerCase())
    // );

    const filtered = (nextQuarterList ?? []).filter(course =>
      course.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredClasses(filtered);
  };

  // Handle user clicking on a suggestion
  const handleSelectCourse = (course: string) => {
    // Add to selectedCourses if not already selected
    if (!selectedCourses.includes(course)) {
      setSelectedCourses(prev => [...prev, course]);
    }
    // Clear out the search
    setSearchQuery("");
    setFilteredClasses([]);
  };

  // ===================== END RENDER TO UPDATE DATA ====================

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8 border-2 border-red-500">
      <div className="w-full max-w-2xl bg-gray-50 rounded-lg">
        <div className="mb-6">
          <h4 className="text-xl font-semibold text-gray-800">
            {majorNames[state.major] || state.major}
          </h4>
        </div>

        {/* SEARCH BAR */}
        <div className={`relative mb-6 ${filteredClasses.length > 0 ? 'z-10' : ''}`}>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search..."
          />
          <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />

          {filteredClasses.length > 0 && (
            <div className="absolute w-full bg-white border border-gray-200 rounded shadow mt-1 max-h-48 overflow-y-auto">
              {filteredClasses.map((course, idx) => (
                <div
                  key={idx}
                  className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                  onClick={() => handleSelectCourse(course)}
                >
                  {course}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Selected searched courses */}
        {selectedCourses.length > 0 && (
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-2">Selected Courses:</h4>
            <ul className="list-disc list-inside">
              {selectedCourses.map((course, idx) => (
                <li key={idx} className="text-gray-700">{course}</li>
              ))}
            </ul>
          </div>
        )}

        <div className='nextPlan_page'>
          <button onClick={handleNextQuarterPlan}>Generate!</button>

          {loading ? (
            <div className="loading-container">
              <img src={loadingIcon} alt="Loading..." />
            </div>
          ) : plan.length > 0 ? ( // fixed the select # of courses per quarter bug
            <NextPage plan={plan} />
          ) : null}
        </div>
      </div>
    </div>
  );
};
