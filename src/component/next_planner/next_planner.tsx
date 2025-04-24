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
import { ChevronDown } from "lucide-react";

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
      setPlan(result.plan);
    }
  };
  
  // Function to send the request
  const getNextPlan = async (wholeList: object) => {
    try {
      const response = await fetch('http://localhost:3000/process/nextPlan', {
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
    <div className='main_container'>
      <header className="zot-header">
        <h1 className="zot-title">
          <a href="/" className="zot-title-link">
            <span id="zot-bold"></span> Next Quarter Planner
          </a>
        </h1>
        <div className="zot-underline"></div>
      </header>
      <div className='main'>
        {/* main page has margin left and right -> takes 2/7 ratio 
        main page only using 5/7 of section of whole page
        there are many div, line those up in vertically
        */}

        <div className='major'>
          {/*
            this pages has
            1) simply h5 tag with "Computer Science"
            2) simply p tag with "Check your selection"
          */}
          <h4>Computer Science B.S</h4>
        </div>

        <div className="container">
          <p className='p_stlye'>Selection Result</p>
          {/* Collapsible Sections */}
          <div className="button_selections">
            {[
              { label: "Can Take", value: "nextavilable" },
              { label: "Completed", value: "taken" },
              { label: "Preference", value: "prefer" },
              { label: "Others", value: "need_others" },
            ].map(({ label, value }) => (
              <div
                key={label}
                className={`selections ${selected === value ? "selected" : ""}`}
                onClick={() => toggleSelection(value)}
              >
                <span className="font-semibold">{label}</span>
                <ChevronDown
                  className={`transition-transform ${selected === value ? "rotate-180" : ""}`}
                />
              </div>
            ))}
          </div>

          {/* Selected List Output */}
          <div className="list_container">
            {selected === "nextavilable" && (
              <p>{nextavilable.join(" , ") || "No courses"}</p>
            )}
            {selected === "taken" && (
              <p>{Array.from(state.taken).join(" , ") || "No courses"}</p>
            )}
            {selected === "prefer" && (
              <p>{Array.from(state.prefer).join(" , ") || "No courses"}</p>
            )}
            {selected === "need_others" && (
              <div>
                <h5 className="font-semibold">Specialization:</h5>
                <p>{state.specialization || "None selected"}</p>

                <h5 className="font-semibold mt-2">Remaining Classes to Take:</h5>
                <p>{remainingClasses || "0"}</p>

                <h5 className="font-semibold mt-2">Remaining Projects to Take:</h5>
                <p>{remainingProjects || "0"}</p>
              </div>
            )}
          </div>
        </div>

        
        {/* <button onClick={handleNextQuarterPlanner}>Start Generating...</button> */}
        <div className='nextPlan_page'>
          {/* <h5 className="next_text">Next Quarter Planner</h5> */}
          <button onClick={handleNextQuarterPlan}>Submit!</button>

          {loading ? (
            <div className="loading-container">
              <img src={loadingIcon} alt="Loading..." />
            </div>
          ) : plan.length > 0 ? (
            <NextPage plan={plan} />
          ) : null}
        </div>
      </div>
    </div>
  );
};
