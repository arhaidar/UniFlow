import React, { useReducer, useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import './css/cs.css'

import { Error404 } from './component/error/error404'
import { DashBoard } from './component/dashboard/dashboard';

import { Sidebar } from './component/side_bar/sidebar';
import { getMajorComponents } from './utils/helper_common/get_major_compo';

import { NextPlanner } from './component/next_planner/next_planner';
import { CustomPlanner } from './component/custom_planner/custom_planner';

import { ComputerScienceBS } from './majorComponents/CS_components/progress';
import { Preference } from './majorComponents/CS_components/preference';
// add other majors components here ...


import { PathFinder } from './component/entire_planner/entire'
import { PathFinder2 } from './component/entire_planner/advanced_entire';
import { TreeVisualizer } from './TREE/TreeVisualizer';
import { GraphVisualizer } from './TREE/GraphVisualizer';



/* ======================= difference major =========================

// import { ComputerScienceBS } from './computersciencebs';

// import { AerospaceEngineeringBS } from './aerospaceengineeringbs';
// import { BiomedicalEngineeringBS } from './biomedicalengineeringbs';
// import { ComputerEngineeringBS } from './computerengineeringbs';
// import { ElectricalEngineeringBS } from './electricalengineeringbs';
// import { MechanicalEngineeringBS } from './mechanicalengineeringbs';

// import { BiologicalSciencesBS } from './Biologicalsciencesbs';

// import { BusinessAdministrationBA } from './Businessadministrationba';

// import { EnglishBA } from './Englishba';

// import { PharmaceuticalSciencesBS } from './Pharmaceuticalsciencesbs';

// import { CriminologyLawandSocietyBA } from './Criminologylawandsocietyba';

// import { PsychologicalScienceBA } from './Psychologicalscienceba';




 ======================= difference major ========================= */

export type CourseState = {
  major: string;
  taken: Set<string>;
  need_take: Set<string>;
  project: Set<string>;
  need_complete: Set<string>;
  need_elective: Set<string>;
  need_project: Set<string>;
  need_others: Set<string>;
  prefer: Set<string>;
  upper: Set<string>;
  specialization: string | null;
  num_total: number;
  num_project: number;
  tree_data:any;
  update_flag:number;
};

export type CourseAction =
  | { type: 'SET_MAJOR'; payload: string }
  | { type: 'ADD_TAKEN'; payload: string }
  | { type: 'REMOVE_TAKEN'; payload: string }
  | { type: 'ADD_NEED_TAKE'; payload: string } 
  | { type: 'REMOVE_NEED_TAKE'; payload: string } 
  | { type: 'ADD_PROJECT'; payload: string }
  | { type: 'REMOVE_PROJECT'; payload: string }
  | { type: 'ADD_COMPLETE'; payload: Set<string> }
  | { type: 'REMOVE_COMPLETE'; payload: string }
  | { type: 'ADD_ELECTIVE'; payload: Set<string> }
  | { type: 'REMOVE_ELECTIVE'; payload: string }
  | { type: 'ADD_NEED_PROJECT'; payload: Set<string> }
  | { type: 'REMOVE_NEED_PROJECT'; payload: string }
  | { type: 'ADD_OTHERS'; payload: Set<string> }
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
  
const initialState: CourseState = {
  major: "student major",
  taken: new Set<string>(),
  need_take: new Set<string>(),
  project: new Set<string>(),
  need_complete: new Set<string>(),
  need_elective: new Set<string>(),
  need_project: new Set<string>(),
  need_others: new Set<string>(),
  prefer: new Set<string>(),
  upper: new Set<string>(),
  specialization: null,
  num_total: 0, 
  num_project: 0, 
  tree_data: null,
  update_flag: 0, //init: upload not needed
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
    case 'ADD_COMPLETE':
      return {
        ...state,
        need_complete: new Set(action.payload)
      };
    case 'ADD_ELECTIVE':
      return {
        ...state,
        need_elective: new Set(action.payload)
      };
    case 'ADD_NEED_PROJECT':
      return {
        ...state,
        need_project: new Set(action.payload)
      };
    case 'ADD_OTHERS':
      return {
        ...state,
        need_others: new Set(action.payload)
      };
    case 'ADD_PREFER':
      return {
        ...state,
        prefer: new Set([...state.prefer, action.payload])
      };
    case 'REMOVE_PREFER': {
      const newPrefer = new Set(state.prefer);
      newPrefer.delete(action.payload);
      return {
        ...state,
        prefer: newPrefer
      };
    }
    case 'ADD_UPPER':
      return {
        ...state,
        upper: new Set([...state.upper, action.payload]),
        num_total: state.upper.size,
        num_project: state.project.size, // Subtract from num_project
      };
    case 'REMOVE_UPPER': {
      const newUpper = new Set(state.upper);
      newUpper.delete(action.payload);
      return {
        ...state,
        upper: newUpper,
        num_total: state.upper.size,
        num_project: state.project.size, // Subtract from num_project
      };
    }
    case 'TOGGLE_SPECIALIZATION':
      return {
        ...state,
        specialization: state.specialization === action.payload ? null : action.payload,
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
      }
    default:
      return state;
  }
}

//centerize data
type CourseContextType = {
  state: CourseState;
  dispatch: React.Dispatch<CourseAction>;
  // state2: UserInfo;
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

  useEffect(() => {
    setComponentPage(getMajorComponents(major, dispatch)); //error already handled in function.
  }, [major]);
  
  return (
    <CourseContext.Provider value={{ state, dispatch }}>
      <div className="dashboard">
        <Sidebar />
        {/* MAIN CONTENT */}
        <div className="main-content">
          <Routes>
            <Route path="/progress" element={componentPage} />
            <Route path="/nextplanner" element={<NextPlanner />} />
            <Route path="/customplanner" element={<CustomPlanner />} />
            <Route path="/entireplanner" element={<PathFinder />} />
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
