import { useState } from "react";
import { getGraduationData } from "../../../utils/helper_common/graduation_data";
import { usePathFinder } from './PathFinderContext';
import { startPlanner } from "./startPlanner";


export const Graduation = ({state}:any) => {
    const {
        setPlannerStatus,
        setUserGraduationDate,
        setNextToTake,
        setNextList,
        setTree
    } = usePathFinder();


    const [graduationDate, setGraduationDate] = useState<string>(''); // grduation date
    // const [userGraduationDate, setUserGraduationDate] = useState<GraduationOption[] | undefined>(undefined);

    const graduationOptions = getGraduationData();

    // const [error, setError] = useState<string>('');
    const handleEntireYearPlan = async () => {
        if (!graduationDate) {
            // setError('Please select a graduation date.');
            return;
        }
        // setUserGraduationDate(graduationOptions.filter(option => option.value <= graduationDate));
        const selectedIndex = graduationOptions.findIndex(option => option.value === graduationDate);
        if (selectedIndex !== -1) {
          setUserGraduationDate(graduationOptions.slice(0, selectedIndex + 1));
        } else {
            // setError('Invalid graduation date selected.');
        }
        
        // setError('Start');
        setPlannerStatus(true)

        startPlanner(
          setNextToTake,
          setNextList,
          setTree, 
          state)
        // handleNextClass();

    };
    return (
      <div className="w-full max-w-xl mx-auto bg-white border border-gray-300 shadow-md rounded-2xl p-6 space-y-6">
      <h5 className="text-lg font-semibold text-gray-800">Entire Year Planner Options:</h5>
      
      <select
        value={graduationDate}
        onChange={(e) => {
          setGraduationDate(e.target.value);
          setPlannerStatus(false);
        }}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="" disabled>Select your graduation date</option>
        {graduationOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    
      <button
        onClick={handleEntireYearPlan}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors"
      >
        START Entire Planner
      </button>
    </div>
    )
}