import React, { useState } from "react";

import './entire.css'
import { CourseState } from "../mainpage";

interface Final_ClassWithRank {
  value: string; // The node value (class name)
  rank: number;  // How many valid steps upward were counted
}

const EntirePage: React.FC<{ data: CourseState }> = ( state_data ) => {

  const copy_state = state_data; //get copy of it (don't touch original)

  const combineStateToJSON = (graduationDate?: string): object => {
    return {
      taken: Array.from(copy_state.data.taken),
      need_complete: Array.from(copy_state.data.need_complete),
      need_elective: Array.from(copy_state.data.need_elective),
      need_project: Array.from(copy_state.data.need_project),
      need_others: Array.from(copy_state.data.need_others),
      major: 'computer_science',
      prefer: copy_state.data.prefer,
      num_total: copy_state.data.num_total,
      num_project: copy_state.data.num_project,
      graduation_date: graduationDate,
    };
  };

  const [nextToTake, setNextToTake] = useState<Final_ClassWithRank[][]>([]);

  const handleNextClass = async () => {
    const combinedData = combineStateToJSON(); //json objectset to BACKEND

    const result = await getNextClass(combinedData);  // Pass the object
    console.log("FROM THE BACKEND SERVER:::::", result)
   
    if (result.success) {
      setNextToTake(result.plan); // 데이터 저장
    }
    else {
      alert("Fail to get data");
    }
  };

  // Function to send the request
  const getNextClass = async (wholeList: object) => {
    try {
      const response = await fetch('http://localhost:3000/process/nextClass', {
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

  //========= graduation data getter =========
  const [graduationDate, setGraduationDate] = useState<string>(''); // 졸업일 상태 관리
  const [error, setError] = useState<string>('');

  const handleEntireYearPlan = async () => {
    if (!graduationDate) {
        setError('Please select a graduation date.');
        return;
    }
    setError('Start');
    //get the data and start making all row of each
    handleNextClass();
  };
  
  type GraduationOption = {
    label: string;
    value: string;
  };
  
  const generateGraduationOptions = (): GraduationOption[] => {
      const options: GraduationOption[] = [];
      const today = new Date();
      const startYear = today.getFullYear();
      const startMonth = today.getMonth();
      const startDate = today.getDate();
  
      const seasons = ['Spring', 'Summer', 'Fall', 'Winter'] as const;
      
      let startSeason: typeof seasons[number];
      if ((startMonth === 0 && startDate <= 15) || (startMonth === 1) || (startMonth === 2 && startDate < 28)) {
          startSeason = 'Spring';
      } else if ((startMonth === 2 && startDate >= 28) || (startMonth === 3) || (startMonth === 4 && startDate < 28)) {
          startSeason = 'Fall';
      } else if ((startMonth === 4 && startDate >= 28) || (startMonth === 5) || (startMonth === 6 && startDate < 15)) {
          startSeason = 'Fall';
      } else {
          startSeason = 'Winter';
      }
  
      // 시즌 순서 찾기
      const startIndex = seasons.indexOf(startSeason);
  
      // 4년 동안의 옵션 생성
      for (let yearOffset = 0; yearOffset < 4; yearOffset++) {
          for (let seasonOffset = 0; seasonOffset < 3; seasonOffset++) {
              const year = startYear + yearOffset;
              const seasonIndex = (startIndex + seasonOffset) % seasons.length;
              options.push({
                  label: `${seasons[seasonIndex]} ${year}`,
                  value: `${seasons[seasonIndex].toLowerCase()} ${year}`
              });
          }
      }
  
      return options;
  };
  const graduationOptions = generateGraduationOptions();
  //========= graduation data getter =========

  const handlegood = (data:string, index:number) => {
    console.log("cliecked", data, "at ", index)
  }
  
  return (
    <div className="entire_pagemain">
      <div className="init_setup_container">
        <h5>Entire Year Planner Options:</h5>
        <select 
          value={graduationDate} 
          onChange={(e) => {
              setGraduationDate(e.target.value);
              setError(''); // 에러 초기화
          }}
        >
          <option value="" disabled>Select your graduation date</option>
          {graduationOptions.map(option => (
            <option key={option.value} value={option.value}>
                {option.label}
            </option>
          ))}
        </select> 
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button onClick={handleEntireYearPlan}>START Entire Planner</button>
        {/* 추가 UI */}
      </div>

      <div className="entire_planner_table">
      {error === 'Start' && graduationOptions.map((option, index) => (
          <div key={option.value} className="graduation_row">
            <div className="quarter_container">
              {option.label}
              <div className="plan_container">
                <hr />
                {/* Filter classes that belong to this graduation option */}
                {nextToTake[index] && nextToTake[index].map(item => (
                  <div className="class_container">
                    <a className="class_item" onClick={()=> handlegood(item.value, index)} key={item.value}>
                      {item.value}</a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      
    </div>
  );
};

export default EntirePage;
