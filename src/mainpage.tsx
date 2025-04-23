import React, { useReducer, useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import './css/cs.css'

import { DashBoard } from './component/dashboard/dashboard';
import { Sidebar } from './component/side_bar/sidebar';
import { getMajorComponents } from './utils/helper_common/get_major_compo';
import { NextPlanner } from './component/next_planner/next_planner';
import { CustomPlanner } from './component/custom_planner/custom_planner';
import { PathFinder } from './component/path_finder/entire'
import { PathFinder2 } from './component/path_finder/advanced_entire';
import { PathFinder3 } from './component/path_finder/entire_testing';
import { TreeVisualizer } from './TREE/TreeVisualizer';
import { GraphVisualizer } from './TREE/GraphVisualizer';
import { PathFinderContainer, PathFinderManual } from './component/path_finder/manual/PathFinderManual';
import { StartPathFinder } from './component/path_finder/manual/StartPathFinder';
export type CourseState = {
  major: string;
  taken: Set<string>;
  need_take: Set<string>;
  project: Set<string>;
  
  //need list...
  need_complete: Set<string>;
  need_specilazation: Set<string>;
  need_specilazation_elective: Set<string>;
  need_project: Set<string>;
  need_others: Set<string>;
  prefer: Set<string>;
  
  //others...
  upper: Set<string>;
  specialization: string;
  num_total: number;
  num_project: number;
  tree_data:any;
  update_flag:number;
  save_flag:number;
};

export type CourseAction =
  | { type: 'SET_MAJOR'; payload: string }
  | { type: 'ADD_TAKEN'; payload: string }
  | { type: 'REMOVE_TAKEN'; payload: string }
  | { type: 'ADD_NEED_TAKE'; payload: string } 
  | { type: 'REMOVE_NEED_TAKE'; payload: string } 
  | { type: 'ADD_PROJECT'; payload: string }
  | { type: 'REMOVE_PROJECT'; payload: string }
  // FIRST SAVING
  | { type: 'ADD_NEED_COMPLETE'; payload: Set<string> }
  | { type: 'ADD_NEED_SPECIALIZATION'; payload: Set<string> }
  | { type: 'ADD_NEED_SPECIALIZATION_ELECTIVE'; payload: Set<string> }
  | { type: 'ADD_NEED_PROJECT'; payload: Set<string> }
  | { type: 'ADD_NEED_OTHERS'; payload: Set<string> }
  // UPDATE
  | { type: 'UPDATE_NEED_COMPLETE'; payload: Set<string> }
  | { type: 'UPDATE_NEED_ELECTIVE'; payload: Set<string> }
  | { type: 'UPDATE_NEED_PROJECT'; payload: Set<string> }
  | { type: 'UPDATE_NEED_OTHERS'; payload: Set<string> }
  | { type: 'BATCH_UPDATE_NEEDS'; payload: Set<string> }

  // OTHERS
  | { type: 'REMOVE_NEED_PROJECT'; payload: string }
  | { type: 'REMOVE_ELECTIVE'; payload: string }
  | { type: 'REMOVE_COMPLETE'; payload: string }
  | { type: 'REMOVE_OTHERS'; payload: string }

  | { type: 'ADD_PREFER'; payload: string }
  | { type: 'REMOVE_PREFER'; payload: string }
  | { type: 'ADD_UPPER'; payload: string }
  | { type: 'REMOVE_UPPER'; payload: string }
  | { type: 'ADD_SPECIALIZATION'; payload: string }
  | { type: 'REMOVE_SPECIALIZATION'; payload: string }
  | { type: 'TOGGLE_SPECIALIZATION'; payload: string }
  | { type: 'ADD_TREE'; payload: any }
  | { type: 'UPDATE_NEEDED'; payload: number}
  | { type: 'SAVE_ONE_TIME'; payload: number}
  
const initialState: CourseState = {
  major: "student major",
  taken: new Set<string>(),
  need_take: new Set<string>(),
  project: new Set<string>(),
  need_complete: new Set<string>(),
  need_specilazation: new Set<string>(),
  need_specilazation_elective: new Set<string>(),
  need_project: new Set<string>(),
  need_others: new Set<string>(),
  prefer: new Set<string>(),
  upper: new Set<string>(),
  specialization: "",
  num_total: 0, 
  num_project: 0, 
  tree_data: null,
  update_flag: 0, //init: upload not needed
  save_flag: 0, //only one time thing
};

function courseReducer(state: CourseState, action: CourseAction, ): CourseState {
  switch (action.type) {
    case 'SET_MAJOR':
      return {
        ...state,
        major: action.payload
      };
    case 'ADD_TAKEN':
      return {
        ...state,
        taken: new Set([...state.taken, action.payload])
      };
    case 'REMOVE_TAKEN': {
      const newTaken = new Set(state.taken);
      newTaken.delete(action.payload);
      return {
        ...state,
        taken: newTaken
      };
    }
    case 'ADD_NEED_TAKE':
      return {
        ...state,
        need_take: new Set([...state.need_take, action.payload])
      };
    case 'REMOVE_NEED_TAKE': {
      const newNeedTake = new Set(state.need_take);
      newNeedTake.delete(action.payload);
      return {
        ...state,
        need_take: newNeedTake
      };
    }
    case 'ADD_PROJECT':
      const newProject = new Set(state.project);
      newProject.add(action.payload);
      
      return {
        ...state,
        project: newProject,
        num_total: state.upper.size,
        num_project: newProject.size, 
      };
    case 'REMOVE_PROJECT': {
      const newProject = new Set(state.project);
      newProject.delete(action.payload);

      return {
        ...state,
        project: newProject,
        num_total: state.upper.size,
        num_project: newProject.size, 
      };
    }
    //NEED LIST UPDATE ACTIONS *ONE TIME RUNNING ==============================
    case 'ADD_NEED_COMPLETE':
      return {
        ...state,
        need_complete: new Set([...state.need_complete, ...action.payload])
      };
    case 'ADD_NEED_SPECIALIZATION':
      return {
        ...state,
        need_specilazation: new Set(action.payload)
      };
    case 'ADD_NEED_SPECIALIZATION_ELECTIVE':
      return {
        ...state,
        need_specilazation_elective: new Set(action.payload)
      };
    case 'ADD_NEED_PROJECT':
      return {
        ...state,
        need_project: new Set([...state.need_project, ...action.payload])
      };
    case 'ADD_NEED_OTHERS':
      return {
        ...state,
        need_others: new Set([...state.need_others, ...action.payload])
      };
    // UPDATE DATA =======================
    case 'UPDATE_NEED_COMPLETE':
      let new_data = new Set(state.need_complete);
      
      for (const item of action.payload) {
        new_data.delete(item); // remove each item in the Set<string>
      }
      return {
        ...state,
        need_take: new_data
      };
    // case 'UPDATE_NEED_ELECTIVE':
    //   new_data = new Set(state.need_elective);
    //   for (const item of action.payload) {
    //     new_data.delete(item); // remove each item in the Set<string>
    //   }
    //   return {
    //     ...state,
    //     need_take: new_data
    //   };
    case 'UPDATE_NEED_OTHERS':
      new_data = new Set(state.need_others);
      for (const item of action.payload) {
        new_data.delete(item); // remove each item in the Set<string>
      }
      return {
        ...state,
        need_take: new_data
      };
    case 'UPDATE_NEED_PROJECT':
      new_data = new Set(state.need_project);
      for (const item of action.payload) {
        new_data.delete(item); // remove each item in the Set<string>
      }
      return {
        ...state,
        need_take: new_data
      };
    case "BATCH_UPDATE_NEEDS": //once processing
      const taken = action.payload
      return {
        ...state,
        need_complete: new Set([...state.need_complete].filter(x => !taken.has(x))),
        need_specilazation: new Set([...state.need_specilazation].filter(x => !taken.has(x))),
        need_others: new Set([...state.need_others].filter(x => !taken.has(x))),
        need_project: new Set([...state.need_project].filter(x => !taken.has(x))),
      };
    //Preference ADDING ACTION ==============================
    case 'ADD_PREFER':
      return {
        ...state,
        prefer: new Set([...state.prefer, action.payload]) //merging
      };
    case 'REMOVE_PREFER': {
      const newPrefer = new Set(state.prefer);
      newPrefer.delete(action.payload);
      return {
        ...state,
        prefer: newPrefer
      };
    }
    // CALCULATE # OF CLASS NEEDED ACTION ====================
    case 'ADD_UPPER':
      return {
        ...state,
        upper: new Set([...state.upper, action.payload]),
        num_total: state.upper.size,
        num_project: state.project.size, // Subtract from num_project
      };
    case 'REMOVE_UPPER':
      const newUpper = new Set(state.upper);
      newUpper.delete(action.payload);
      return {
        ...state,
        upper: newUpper,
        num_total: state.upper.size,
        num_project: state.project.size, // Subtract from num_project
      };
    case 'TOGGLE_SPECIALIZATION':
      return {
        ...state,
        specialization: state.specialization === action.payload ? "" : action.payload,
      };
    case 'ADD_TREE':
      return {
        ...state,
        tree_data:action.payload,
      };
    case 'UPDATE_NEEDED':
      return {
        ...state,
        update_flag:action.payload, //update 
      };
    case 'SAVE_ONE_TIME':
      return {
        ...state,
        save_flag:1, //update 
      };
    default:
      return state;
  }
}

//centerize data -> sepearte later
type CourseContextType = {
  state: CourseState;
  dispatch: React.Dispatch<CourseAction>;
};

const CourseContext = createContext<CourseContextType | null>(null);

export const useCourseContext = () => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error('useCourseContext must be used within CourseProvider');
  }
  return context;
};

export const MainPage = ({major}:any) => {
  const [state, dispatch] = useReducer(courseReducer, initialState, () => initialState); //init only for less memeory usage
  const [componentPage, setComponentPage] = useState<React.ReactElement | null>(null); // Dynamically change the component page

  // 1) Define a local state for dark mode
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
      if(!major) {
        setComponentPage(getMajorComponents(state.major, dispatch)); //keep maintaining user major
      } 
      else {
        setComponentPage(getMajorComponents(major, dispatch)); //error already handled in function.
      }
  }, [major]);
  
  // return (
  //   <CourseContext.Provider value={{ state, dispatch }}>
  //     <div className="dashboard">
  //       <Sidebar />
  //       {/* MAIN CONTENT */}
  //       <div className="main-content">
  //         <Routes>
  //           <Route path="/progress" element={componentPage} />
  //           <Route path="/nextplanner" element={<NextPlanner />} />
  //           <Route path="/customplanner" element={<CustomPlanner />} />
  //           <Route path="/entireplanner" element={<PathFinder />} />
  //           <Route path="/majortree" element={<TreeVisualizer />} />
  //           <Route path="/majorgraph" element={<GraphVisualizer />} />
  //           <Route path="/test" element={<PathFinder2 />} />
  //           <Route path="*" element={<DashBoard />} />
  //         </Routes>
  //       </div>
  //     </div>
  //   </CourseContext.Provider>
  // );
  return (
    <CourseContext.Provider value={{ state, dispatch }}>
      {/* 2) Add "dark" class if darkMode is true */}
      <div className={`dashboard ${darkMode ? "dark" : ""}`}>
        {/* 3) Pass darkMode & setDarkMode to Sidebar */}
        <Sidebar darkMode={darkMode} setDarkMode={setDarkMode} />

        <div className="main-content">
          <Routes>
            <Route path="/progress" element={componentPage} />
            <Route path="/nextplanner" element={<NextPlanner />} />
            <Route path="/customplanner" element={<CustomPlanner />} />
            <Route path="/entireplanner" element={<PathFinderContainer />} />
            <Route path="/majortree" element={<TreeVisualizer />} />
            <Route path="/majorgraph" element={<GraphVisualizer />} />
            <Route path="/test" element={<PathFinder2 />} />
            <Route path="*" element={<DashBoard />} />
          </Routes>
        </div>
      </div>
    </CourseContext.Provider>
  );
};
