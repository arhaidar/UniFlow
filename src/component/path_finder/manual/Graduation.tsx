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
        <div className="init_setup_container">
            <h5>Entire Year Planner Options:</h5>
            <select 
              value={graduationDate} 
              onChange={(e) => {
                setGraduationDate(e.target.value);
                //   setError(''); // 에러 초기화
                setPlannerStatus(false);
              }}
            >
              <option value="" disabled>Select your graduation date</option>
              {graduationOptions.map(option => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
              ))}
            </select> 
            <button onClick={handleEntireYearPlan}>START Entire Planner</button>
          </div>
    )
}