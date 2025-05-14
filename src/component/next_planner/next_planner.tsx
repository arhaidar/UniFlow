import React, { useState, useEffect } from 'react';
import { useCourseContext } from '../../mainpage'; //sharing data

import nextIcon from '../../icons/next_icon.png';
import entireIcon from '../../icons/entire_icon.png';
import alterIcon from '../../icons/alter_icon.png';
import loadingIcon from '../../icons/loading.gif'

import NextPage from '../../planners/next';
import EntirePage from '../../planners/entire';
// import '../css/cs1_ver2.css';
// import '../../css/page3.css' //OLD
import './next_planner.css'
import { ChevronDown, Search } from "lucide-react";



import { ResultTable } from './result_table';
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { Loader2 } from "lucide-react";

import planData from './FUCK.json';


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



export const NextPlanner = () => {
  const { state, dispatch } = useCourseContext();

  const combineStateToJSON = (graduationDate?: string): object => {
    return {
      taken: Array.from(state.taken),
      need_complete: Array.from(state.need_complete),
      need_specilazation: Array.from(state.need_specilazation),
      need_specilazation_elective: Array.from(state.need_specilazation_elective),
      need_project: Array.from(state.need_project),
      need_others: Array.from(state.need_others),
      major: state.major,
      prefer: Array.from(state.prefer),
      num_total: state.num_total,
      num_project: state.num_project,
      graduation_date: graduationDate,
    };
  };
  const remainingClasses = Math.max(0, 11 - state.num_total);
  const remainingProjects = Math.max(0, 2 - state.num_project);

  // ========================= PLANNER SELECTION ================================
  const [planner, setPlanner] = useState<string>("");  
  const handleNextQuarterPlanner = () => {
    setPlanner('Next Quarter Planner');
  };
  const handleGeneralNextQuarterPlanner = () => {
    setPlanner('Alternative Course Finder');
  };
  const handleEntireYearPlanner = () => {
    setPlanner('Entire Year Planner');
  };
  const isWhichPlanner = (newPlanner: string) => {
    return planner === newPlanner; 
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
    const result = await getNextPlan(combinedData);  // Pass the object
    console.log("FROM THE BACKEND SERVER:::::", result)
    if (result.success) {
      // setPlan(result.plan);
      const transformedData = result.plan.map((item: any) => item.combination);
      setPlan(transformedData);
    }
    //   // Save result.plan as JSON
    //   const jsonData = JSON.stringify(result.plan, null, 2);
    //   const blob = new Blob([jsonData], { type: 'application/json' });
    //   const url = window.URL.createObjectURL(blob);
    //   const link = document.createElement('a');
    //   link.href = url;
    //   link.download = 'FUCK.json';
    //   document.body.appendChild(link);
    //   link.click();
    //   document.body.removeChild(link);
    //   window.URL.revokeObjectURL(url);
    // }
    // try {
    //   // Transform the data to match Course[][] format
    //   const transformedData = planData.map((item: any) => item.combination);
    //   console.log("Transformed plan data:", transformedData);
    //   setPlan(transformedData);
    // } catch (error){
    //   console.error('Error loading plan:', error);
    // }
  };
  
  // Function to send the request
  const getNextPlan = async (wholeList: object) => {
    try {
      const response = await fetch('https://scheduler-docker-server.onrender.com/process/nextPlan', {
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
  // ========================= END NEXT PLANNER ================================


  // =========================== RESULT DATA =================================
  const [nextavilable, setNextavilable] = useState<string[]>([
    "COMPSCI 161", "COMPSCI 171", "COMPSCI 178", "I&CSCI 139W",
    "COMPSCI 116", "COMPSCI 114", "COMPSCI 132", "COMPSCI 151",
    "IN4MATX 113", "IN4MATX 131", "IN4MATX 133"
  ]);
  // const [selected, setSelected] = useState(state.taken); 
  const [selected, setSelected] = useState<string>("taken"); 

  // const toggleSelection = (value: any) => {
  //   setSelected(selected === value ? value : value);
  // };
  const toggleSelection = (key: string) => {
    setSelected(key);
  };
  // =========================== END RESULT DATA =================================

  // ===================== RENDER TO UPDATE DATA ====================
  useEffect(() => {
  }, []);
  // ===================== END RENDER TO UPDATE DATA ====================
  
  return (
  // testing new layout
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8 ">
      <div className="w-full max-w-2xl bg-gray-50 rounded-lg">
        <div className="mb-6">
          <h4 className="text-2xl font-semibold text-gray-800 text-center">
            {majorNames[state.major] || state.major}
          </h4>
        </div>
        <ResultTable nextavilable={nextavilable} />
      </div>
      
      <div className="w-full max-w-2xl mx-auto mt-8">
        <h2 className="text-xl font-bold text-black">Schedules</h2>
        <div className="border-b-2 border-gray-200 my-2" />
        <div className="mt-4">
          {/* <Button className="font-bold bg-blue-500 hover:bg-blue-600 active:bg-blue-700 active:scale-95 transition transform text-white flex items-center gap-2 px-6 py-2 rounded">
            <RefreshCcw className="w-6 h-6 font-bold text-xl" /> Generate Schedules
          </Button> */}
          <Button
            className="font-bold bg-blue-500 hover:bg-blue-600 active:bg-blue-700 active:scale-95 transition transform text-white flex items-center justify-center gap-2 px-6 py-2 rounded"
            onClick={handleNextQuarterPlan}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <RefreshCcw className="w-6 h-6" />
                Generate Schedules
              </>
            )}
          </Button>
        </div>
        <div className="mt-4">
          {loading ? (
            // <div className="flex justify-center">
            //   <Loader2 className="w-8 h-8 animate-spin" />
            // </div>
            null
          ) : plan && plan.length > 0 ? (
            <NextPage plan={plan} />
          ) : (
            <div className="text-center text-gray-500">No schedules generated yet</div>
          )}
        </div>
      </div>
    </div>
  );
};
