import React, { useState, useEffect } from 'react';
import { useCourseContext } from './mainpage';

import PageTesting from './cs3_test';
// import './checkbox.css'

const CS3_ver2: React.FC = () => {
  const { state, dispatch } = useCourseContext();

  const remainingClasses = Math.max(0, 11 - state.num_total); // 총 수업 수에서 이수한 수업 수를 뺌
  const remainingProjects = Math.max(0, 2 - state.num_project); // 총 프로젝트 수에서 이수한 프로젝트 수를 뺌

  const handleNextQuarterPlanner = () => {
    setPlanner('Next Quarter Planner');
  };

  const handleGeneralNextQuarterPlanner = () => {
    setPlanner('General Next Quarter Planner');
  };

  const handleEntireYearPlanner = () => {
    setPlanner('Entire Year Planner');
  };

  const isWhichPlanner = (newPlanner: string) => {
    return planner === newPlanner; // 현재 선택된 플래너가 주어진 플래너와 같은지 확인
  };
  

  const API_BASE_URL = 'https://your-api-url.com'; // 기본 API URL

  const combineStateToJSON = (graduationDate?: string): object => {
    return {
      taken: Array.from(state.taken),
      need_complete: Array.from(state.need_complete),
      need_elective: Array.from(state.need_elective),
      need_project: Array.from(state.need_project),
      need_others: Array.from(state.need_others),
      major: 'computer_science',
      prefer: state.prefer,
      num_total: state.num_total,
      num_project: state.num_project,
      graduation_date: graduationDate,
    };
  };
  // Define the interface
  interface Final_ClassWithRank {
    value: string; // The node value (class name)
    rank: number;  // How many valid steps upward were counted
  }
  const [plan, setPlan] = useState<Final_ClassWithRank[]>([]);

  const handleNextQuarterPlan = async () => {
    const combinedData = combineStateToJSON();
    console.log("handleNextQuarterPlan", combinedData);
  
    // Pass the object directly, no need to stringify here
    const result = await getNextPlan(combinedData);  // Pass the object
    console.log("FROM THE BACKEND SERVER:::::", result)
    if (result.success) {
      setPlan(result.plan); // 데이터 저장
    }
    // console.log(result); // API 응답 처리
  };
  
  // Function to send the request
  const getNextPlan = async (wholeList: object) => {
    try {
      const response = await fetch('http://localhost:3000/process/entirePlan', {
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
  const [nextQuarterPlanResult, setNextQuarterPlanResult] = useState<Final_ClassWithRank[] | null>(null);


  const getGenNextPlan = async (wholeList: JSON) => {
      try {
          const response = await fetch(`${API_BASE_URL}/gen-next-plan`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(wholeList),
          });

          if (!response.ok) {
              throw new Error('Network response was not ok');
          }

          const result = await response.json();
          return result;
      } catch (error) {
          console.error('Error fetching general next plan:', error);
          throw error;
      }
  };

  const getEntireNextPlan = async (wholeListWithSelectedSchedule: JSON) => {
      try {
          const response = await fetch(`${API_BASE_URL}/entire-next-plan`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(wholeListWithSelectedSchedule),
          });

          if (!response.ok) {
              throw new Error('Network response was not ok');
          }

          const result = await response.json();
          return result;
      } catch (error) {
          console.error('Error fetching entire next plan:', error);
          throw error;
      }
  };

  // // 상태 결합 함수
  // const combineStateToJSON = (graduationDate?: string):object => {
  //     return {
  //         taken: Array.from(state.taken),
  //         need_complete: Array.from(state.need_complete),
  //         need_elective: Array.from(state.need_elective),
  //         need_project: Array.from(state.need_project),
  //         need_others: Array.from(state.need_others),
  //         major: 'computer_science',
  //         prefer: state.prefer,
  //         num_total: state.num_total,
  //         num_project: state.num_project,
  //         graduation_date: graduationDate,
  //     };
  // };

  // // 핸들러 함수
  // const handleNextQuarterPlan = async () => {
  //   const combinedData = combineStateToJSON();
  //   console.log("handleNextQuarterPlan", combinedData);
  
  //   // Pass the object directly, no need to stringify here
  //   const result = await getNextPlan(combinedData);  // Pass the object
  
  //   return result;
  //   // console.log(result); // API 응답 처리
  // };

  const handleGenNextPlan = async () => {
      const combinedData = combineStateToJSON();
      console.log("handleGenNextPlan",combinedData);
      // const result = await getGenNextPlan(JSON.stringify(combinedData)); // JSON 문자열로 변환
      // console.log(result); // API 응답 처리
  };

  const [graduationDate, setGraduationDate] = useState<string>(''); // 졸업일 상태 관리
  const [error, setError] = useState<string>('');

  const generateGraduationOptions = () => {
    const options = [];
    const today = new Date();
    const startYear = today.getFullYear();
    
    for (let year = startYear; year <= startYear + 3; year++) {
        for (let month = 0; month < 12; month++) {
            const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(year, month));
            options.push({ label: `${monthName} ${year}`, value: `${monthName.toLowerCase()} ${year}` });
        }
    }
    return options;
  };
  const graduationOptions = generateGraduationOptions();

  const handleEntireYearPlan = async () => {
    if (!graduationDate) {
        setError('Please select a graduation date.');
        return;
    }

    const combinedData = combineStateToJSON(graduationDate);
    console.log("handleEntireYearPlan",combinedData);
    // const result = await getEntireNextPlan(JSON.stringify(combinedData)); // JSON 문자열로 변환
    // console.log(result); // API 응답 처리
  };

  const [planner, setPlanner] = useState<string>("");  


  
  //TESTING data set
  const all_combinations = {
    1: {
      "COMPSCI 1": {
        Lec: ["MW", "5:00 - 7:50pm"],
        Prof: "MAJUMDER, A.",
        dis: [["W", "11:00 - 11:50"],["W", "12:00 - 12:50pm"],["W", "3:00 - 3:50pm"]],
        lab: {},
      },
      "I&CSCI 2": {
        Lec: ["TuTh", "11:00 - 12:20pm"],
        Prof: "NAWAB, F.",
        dis: [["W", "1:00 - 1:50pm"],["W", "2:00 - 2:50pm"],["W", "3:00 - 3:50pm"],["W", "4:00 - 4:50pm"],["W", "5:00 - 5:50pm"]],
        lab: {},
      },
      "IN4MATX 3": {
        Lec: ["MWF", "11:00 - 12:20pm"],
        Prof: "LI, C.PARK, K.",
        dis: [["F", "1:00 - 1:50pm"],["F", "3:00 - 3:50pm"],["F", "4:00 - 4:50pm"]],
        lab: {},
      }
    },
    2: {
      "COMPSCI 1": {
        Lec: ["MW", "5:00 - 7:50pm"],
        Prof: "MAJUMDER, A.",
        dis: [["W", "11:00 - 11:50"],["W", "12:00 - 12:50pm"],["W", "3:00 - 3:50pm"]],
        lab: {},
      },
      "I&CSCI 2": {
        Lec: ["TuTh", "11:00 - 12:20pm"],
        Prof: "NAWAB, F.",
        dis: [["W", "1:00 - 1:50pm"],["W", "2:00 - 2:50pm"],["W", "3:00 - 3:50pm"],["W", "4:00 - 4:50pm"],["W", "5:00 - 5:50pm"]],
        lab: {},
      },
      "COMPSCI 2": {
        Lec: ["MW", "3:00 - 3:50pm"],
        Prof: "LEVORATO, M.",
        dis: [["W", "4:00 - 4:50pm"],["W", "5:00 - 5:50pm"],["W", "6:00 - 6:50pm"],],
        lab: {},
      }
    },
    // ...
  }

  // ================================================================
  const [selected, setSelected] = useState<number | null>(null);

  const handleClick = (index: number) => {
    setSelected(index);
  };
  // ================================================================

  useEffect(() => {
  },[]);

  const renderPage = () => {
    return <PageTesting />; // return 문 추가
  };

  return (
    <div className='main'>
      {/* {renderPage()} */}
      <div className='main_'> 
        <h4>Double check your selection</h4>

        <h5>Taken Courses:</h5>
        <ul>
          {Array.from(state.taken).map(course => (
            <li key={course}>{course}</li>
          ))}
        </ul>

        <h5>needs to take Courses:</h5>
        <h4>complete section</h4>
        <ul>
          {Array.from(state.need_complete).map(course => (
            <li key={course}>{course}</li>
          ))}
        </ul>
        <h4>elective section</h4>
        <ul>
          {Array.from(state.need_elective).map(course => (
            <li key={course}>{course}</li>
          ))}
        </ul>
        <h4>project section</h4>
        <ul>
          {Array.from(state.project).map(course => (
            <li key={course}>{course}</li>
          ))}
        </ul>
        <h4>others</h4>
        <ul>
          {Array.from(state.need_others).map(course => (
            <li key={course}>{course}</li>
          ))}
        </ul>

        <h5>Project Courses:</h5>
        <ul>
          {Array.from(state.need_project).map(course => (
            <li key={course}>{course}</li>
          ))}
        </ul>

        <h5>Preferred Courses:</h5>
        <ul>
          {Array.from(state.prefer).map(course => (
            <li key={course}>{course}</li>
          ))}
        </ul>

        <h5>Specialization:</h5>
        <p>{state.specialization || "None selected"}</p>

        <h5>Remaining Classes to Take:</h5>
        <p>{remainingClasses}</p>

        <h5>Remaining Projects to Take:</h5>
        <p>{remainingProjects}</p>
      </div>

      <div>
        <p>Options to create your schedule:</p>
        <button onClick={handleNextQuarterPlanner}>Next Quarter Planner</button>
        <button onClick={handleGeneralNextQuarterPlanner}>General Next Quarter Planner</button>
        <button onClick={handleEntireYearPlanner}>Entire Year Planner</button>

        {isWhichPlanner('Next Quarter Planner') && (
          <div>
            <h5>Next Quarter Planner Options:</h5>
            <button onClick={handleNextQuarterPlan}>Generate!</button>
            {plan.map((item, index) => (
                    <li key={index}>
                        {item.value} (Rank: {item.rank})
                    </li>
                ))}
            </div>
        )}

        {isWhichPlanner('General Next Quarter Planner') && (
          <div>
              <h5>General Next Quarter Planner Options:</h5>
              <button onClick={handleGenNextPlan}>Generate!</button>
              {/* 추가 UI */}
          </div>
        )}

        {isWhichPlanner('Entire Year Planner') && (
          <div>
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
              {error && <p style={{ color: 'red' }}>{error}</p>} {/* 에러 메시지 표시 */}
              <button onClick={handleEntireYearPlan}>Generate!</button>
              {/* 추가 UI */}
          </div>
        )}
      </div>

    </div>
  );
};

export default CS3_ver2;