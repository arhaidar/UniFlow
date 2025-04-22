import React, { useState,useEffect,useRef } from "react";

import './entire.css'
import { getApiData } from "../../../utils/api_call/api_call";
import { progress_upadate } from "../../../utils/helper_common/progress_update";
import { useCourseContext } from "../../../mainpage";
import { getGraduationData } from "../../../utils/helper_common/graduation_data";
import { GraduationData } from "../grad_setting";
import { PathFinderAutoDisplay } from "./path_finder_auto";

interface GraduationOption {
  label: string;
  value: string;
};
interface CourseNode {
  value: string;
  children: string[];
  rank?: number;
}

export const PathFinderAutoMode = () => {
  const { state, dispatch } = useCourseContext();
  // progress_upadate(dispatch,state)
  useEffect(() => {
      progress_upadate(dispatch,state)
  }, []);

  const copy_state = state; //get copy of it (don't touch original)
  // endpoints: treedata / wholelist
  
  const [nextToTake, setNextToTake] = useState<string[][]>([]);
  //init data setting
  const handleNextClass = async () => {
    try {
      const auto_plan = await getApiData(copy_state, 'autoplan');

      console.log("FROM THE BACKEND SERVER:::::Tree", auto_plan.plan)

      if(auto_plan.success) {
        setNextToTake(auto_plan.plan)
        setNextList(new Set(auto_plan.plan[0])); // Convert array to Set
      }
      else {
        alert("Fail to get next class data");
      }
    }
    catch(error) {
      console.error("Error fetching data from the backend:", error);
      alert("An error occurred while fetching data.");
    }
  };

  return (
    <div className="dashboard-container">
      <div className="first-section">
        <div className="first-portion">

          <GraduationData />
          <PathFinderAutoDisplay />
          <div className="entire_planner_table">
            {error === 'Start' && userGraduationDate?.map((option, index) => (
                <div key={option.value} className="graduation_row">
                  <div className="quarter_container">
                    {option.label}
                    <div className="plan_container">
                      <hr />
                      <div className="dot-container">
                        <div className="dot"></div>
                        <div className="dot"></div>
                        <div className="dot"></div>
                      </div>
                      {/* Filter classes that belong to this graduation option */}
                      {nextToTake &&
                        nextToTake[index]
                          ?.slice().map((item, itemIndex) => {
                            return (
                              <div key={itemIndex} className="class_container">
                                <a className="cool" key={item}>
                                  {item}
                                </a>
                              </div>
                            );
                          })}
                    </div>
                  </div>
                </div>
            ))}

          </div>
        </div>
      </div>
 
    </div>
  );
};
