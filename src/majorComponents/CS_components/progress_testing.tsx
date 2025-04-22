import React, { useEffect } from 'react';
import { useState } from 'react'; // ✅ Add useState here
import { useCourseContext } from '../../mainpage';

import { savingMajorData } from '../../utils/helper_common/save_all_majorClass'

// { name: string; id: string; description: string; }[] = 
// all major data will be differenet
// but one same format will be like this
// inside the object file, it has different datalist of type: { name: string; id: string; description: string; }
// but we just need to add 'name' part

// purpose -> complete, elective, project, others
//C, C, O, P, E * 10

type majorDataType = {
  name: string;
  id: string;
  description: string;
};

const all_major_comments:string[] = [
  "Lower-division: ",
  "A. Select one of the following series: I&C SCI 31- 32- 33 or I&C SCI H32- 33",
  "B. Complete:",
  "Upper-division: ",
  "A. Core(complete)",
  "B. Upper-division electives: Select 11 upper-division courses from the list below. Sections B-1 and B-2 must be completed as part of the 11 upper-division electives.",
  "B-1. Project Courses: Choose at least 2 projects courses from the following list:",
  "B-2. Specialization: Select and satisfy the requirements for one of the specializations below. (Note: Students may not pursue more than one specialization.)",
  "Algorithms: Four courses from the following list:",
  "Architecture and Embedded Systems: four courses from the following list:",
  "Bioinformatics: three courses from the following list:",
  "and complete:",
  "Information",
  "and four courses from: *at least one of which must be: COMPSCI 122B, COMPSCI 122C, COMPSCI 122D, COMPSCI 125, COMPSCI 179",
  "Intelligent Systems",
  "and at least three courses from:",
  "Networked Systems",
  "Systems and Software: three courses from the following list:",
  "Visual Computing: four courses from the following list:",
]

const major_data:{ [key: string]: majorDataType[]; } = {
  lower_division_coursesA: [
    {
        name: 'I&CSCI 31',
        id: 'course_31',
        description: 'Introduction to Programming',
    },
    {
        name: 'I&CSCI 32',
        id: 'course_32',
        description: 'Programming with Software Libraries',
    },
    {
        name: 'I&CSCI H32',
        id: 'course_H32',
        description: 'Python Programming and Libraries (Accelerated)',
    },
    {
        name: 'I&CSCI 33',
        id: 'course_33',
        description: 'Intermediate Programming',
    },
  ],
  lower_division_coursesB: [
    {
        name: 'I&CSCI 45C',
        id: 'course_45C',
        description: 'Programming in C/C++ as a Second Language',
    },
    {
        name: 'I&CSCI 45J',
        id: 'course_45J',
        description: 'Programming in Java as a Second Language',
    },
    {
        name: 'I&CSCI 46',
        id: 'course_46',
        description: 'Data Structure Implementation and Analysis',
    },
    {
        name: 'I&CSCI 51',
        id: 'course_51',
        description: 'Introductory Computer Organization',
    },
    {
        name: 'I&CSCI 53',
        id: 'course_53',
        description: 'Principles in System Design',
    },
    {
        name: 'IN4MATX 43',
        id: 'course_IN4MATX43',
        description: 'Introduction to Software Engineering',
    },
    {
        name: 'MATH 2A',
        id: 'course_MATH2A',
        description: 'Single-Variable Calculus I',
    },
    {
        name: 'MATH 2B',
        id: 'course_MATH2B',
        description: 'Single-Variable Calculus II',
    },
    {
        name: 'I&CSCI 6B',
        id: 'course_6B',
        description: 'Boolean Logic and Discrete Structures',
    },
    {
        name: 'I&CSCI 6D',
        id: 'course_6D',
        description: 'Discrete Mathematics for Computer Science',
    },
    {
        name: 'I&CSCI 6N',
        id: 'course_6N',
        description: 'Computational Linear Algebra',
    },
    {
        name: 'MATH 3A',
        id: 'course_3A',
        description: 'Introduction to Linear Algebra',
    },
    {
        name: 'STATS 67',
        id: 'course_67',
        description: 'Introduction to Probability and Statistics for Computer Science',
    }
  ],
  upper_core:[
    {
      name: 'COMPSCI 161',
      id: 'course_161',
      description: 'Design and Analysis of Algorithms',
    },
    {
      name: 'I&CSCI 139W',
      id: 'course_139W',
      description: 'Critical Writing on Information Technology',
    },
  ],
  upper_division_electives:[
    {
      name: 'IN4MATX 101',
      id: 'course_I101',
      description: 'Concepts of Programming Language I',
    },
    {
      name: 'IN4MATX 102',
      id: 'course_I102',
      description: 'Concepts of Programming Language II',
    },
    {
        name: 'IN4MATX 113',
        id: 'course_I113',
        description: 'Requirements Analysis and Engineering',
    },
    {
        name: 'IN4MATX 115',
        id: 'course_I115',
        description: 'Software Testing, Analysis, and Quality Assurance',
    },
    {
        name: 'IN4MATX 117',
        id: 'course_I117',
        description: 'Project in Software System Design',
    },
    {
        name: 'IN4MATX 121',
        id: 'course_I121',
        description: 'Software Design: Applications',
    },
    {
        name: 'IN4MATX 122',
        id: 'course_I122',
        description: 'Software Design: Structure and Implementation',
    },
    {
        name: 'IN4MATX 124',
        id: 'course_I124',
        description: 'Internet Applications Engineering',
    },
    {
        name: 'IN4MATX 131',
        id: 'course_I131',
        description: 'Human Computer Interaction',
    },
    {
        name: 'IN4MATX 133',
        id: 'course_I133',
        description: 'User Interaction Software',
    },
    {
        name: 'IN4MATX 134',
        id: 'course_I134',
        description: 'Project in User Interaction Software',
    },
    {
        name: 'I&CSCI 162',
        id: 'course_SCI162',
        description: 'Modeling and World Building',
    },
    {
        name: 'COMPSCI 103',
        id: 'course_COMPSCI103',
        description: 'Advanced Programming and Problem Solving with C++',
    },
    {
        name: 'COMPSCI 132',
        id: 'course_COMPSCI132',
        description: 'Computer Networks',
    },
    {
        name: 'COMPSCI 133',
        id: 'course_COMPSCI133',
        description: 'Advanced Computer NetworksS',
    },
    {
        name: 'COMPSCI 137',
        id: 'course_COMPSCI137',
        description: 'Internet Applications Engineering',
    },
    {
        name: 'COMPSCI 142A',
        id: 'course_COMPSCI142A',
        description: 'Compilers and Interpreters',
    },
    {
        name: 'COMPSCI 151',
        id: 'course_COMPSCI151',
        description: 'Digital Logic Design',
    },
    {
        name: 'COMPSCI 132',
        id: 'course_132',
        description: 'Computer Networks',
    },
  ],
  upper_project_courses:[
    {
      name: 'COMPSCI 113',
      id: 'course_113',
      description: 'Computer Game Development',
    },
    {
        name: 'COMPSCI 114',
        id: 'course_114',
        description: 'Projects in Advanced 3D Computer Graphics',
    },
    {
        name: 'COMPSCI 117',
        id: 'course_117',
        description: 'Project in Computer Vision',
    },
    {
        name: 'COMPSCI 118',
        id: 'course_118',
        description: 'Introduction to Virtual Reality',
    },
    {
        name: 'COMPSCI 122B',
        id: 'course_122B',
        description: 'Project in Databases and Web Applications',
    },
    {
        name: 'COMPSCI 122C',
        id: 'course_122C',
        description: 'Principles of Data Management',
    },
    {
        name: 'COMPSCI 122D',
        id: 'course_122D',
        description: 'Beyond SQL Data Management',
    },
    {
        name: 'COMPSCI 125',
        id: 'course_125',
        description: 'Next Generation Search Systems',
    },
    {
        name: 'COMPSCI 133',
        id: 'course_133',
        description: 'Advanced Computer Networks',
    },
    {
        name: 'COMPSCI 142B',
        id: 'course_142B',
        description: 'Language Processor Construction',
    },
    {
        name: 'COMPSCI 143B',
        id: 'course_143B',
        description: 'Project in Operating System Organization',
    },
    {
        name: 'COMPSCI 145',
        id: 'course_145',
        description: 'Embedded Software',
    },
    {
        name: 'COMPSCI 147',
        id: 'course_147',
        description: 'Internet of Things (IoT) Software and Systems',
    },
    {
        name: 'COMPSCI 153',
        id: 'course_153',
        description: 'Logic Design Laboratory',
    },
    {
        name: 'COMPSCI 154',
        id: 'course_154',
        description: 'Computer Design Laboratory',
    },
    {
        name: 'COMPSCI 165',
        id: 'course_165',
        description: 'Project in Algorithms and Data Structures',
    },
    {
        name: 'COMPSCI 175',
        id: 'course_175',
        description: 'Project in Artificial Intelligence',
    },
    {
        name: 'COMPSCI 180A',
        id: 'course_180A',
        description: 'Project in Computer Science 1',
    },
    {
        name: 'COMPSCI 180B',
        id: 'course_180B',
        description: 'Project in Computer Science 1',
    },
    {
        name: 'COMPSCI 189',
        id: 'course_189',
        description: 'Project in Bioinformatics',
    },
    {
        name: 'IN4MATX 117',
        id: 'course_IN4MATX117',
        description: 'Project in Software System Design',
    },
    {
        name: 'IN4MATX 134',
        id: 'course_IN4MATX134',
        description: 'Project in User Interaction Software',
    }
  ],
}
const major_comment_group: string[][] = [
  ["Lower-division: ", "A. Select one of the following series: I&C SCI 31- 32- 33 or I&C SCI H32- 33"],
  ["B. Complete:"],
  ["Upper-division: "],
  ["A. Core(complete)"],
  ["B. Upper-division electives: Select 11 upper-division courses from the list below. Sections B-1 and B-2 must be completed as part of the 11 upper-division electives.",]
  , ["B-1. Project Courses: Choose at least two projects courses from the following list:"]
  // ...
];

const specializations: { [key: string]: majorDataType[]; } = {  
  upper_specialization_algorithm_complete:[
    {
        name: 'COMPSCI 162',
        id: 'course_162',
        description: 'Formal Languages and Automata',
    },
    {
        name: 'COMPSCI 163',
        id: 'course_163',
        description: 'Graph Algorithms',
    },
    {
        name: 'COMPSCI 164',
        id: 'course_164',
        description: 'Computational Geometry and Geometric Modeling',
    },
    {
        name: 'COMPSCI 165',
        id: 'course_165',
        description: 'Project in Algorithms and Data Structures',
    },
    {
        name: 'COMPSCI 166',
        id: 'course_166',
        description: 'Quantum Computation and Information',
    },
    {
        name: 'COMPSCI 167',
        id: 'course_167',
        description: 'Introduction to Applied Cryptography',
    },
    {
        name: 'COMPSCI 169',
        id: 'course_169',
        description: 'Introduction to Optimization',
    }
  ],
  upper_specialization_architecture_and_embedded_systems_complete:[
    {
        name: 'COMPSCI 145',
        id: 'course_145',
        description: 'Embedded Software',
    },
    {
        name: 'COMPSCI 147',
        id: 'course_147',
        description: 'Internet of Things (IoT) Software and Systems',
    },
    {
        name: 'COMPSCI 151',
        id: 'course_151',
        description: 'Digital Logic Design',
    },
    {
        name: 'COMPSCI 152',
        id: 'course_152',
        description: 'Computer Systems Architecture',
    },
    {
        name: 'COMPSCI 153',
        id: 'course_153',
        description: 'Logic Design Laboratory',
    },
    {
        name: 'COMPSCI 154',
        id: 'course_154',
        description: 'Computer Design Laboratory',
    }
  ],
  upper_specialization_Bioinformatics_complete:[
    {
        name: 'COMPSCI 184A',
        id: 'course_184A',
        description: 'Artificial Intelligence in Biology and Medicine',
    }
  ],
  upper_specialization_Bioinformatics_choose:[
    {
        name: 'COMPSCI 172B',
        id: 'course_172B',
        description: 'Neural Networks and Deep Learning',
    },
    {
        name: 'COMPSCI 172C',
        id: 'course_172C',
        description: 'Artificial Intelligence Frontiers: Technical, Ethical, and Societal',
    },
    {
        name: 'COMPSCI 178',
        id: 'course_178',
        description: 'Machine Learning and Data-Mining',
    },
    {
        name: 'COMPSCI 184C',
        id: 'course_184C',
        description: 'Computational Systems Biology',
    },
    {
        name: 'COMPSCI 189',
        id: 'course_189',
        description: 'Project in Bioinformatics',
    }
  ],
  upper_specialization_Information_complete:[
    {
        name: 'COMPSCI 121',
        id: 'course_121',
        description: 'Information Retrieval',
    },
    {
        name: 'COMPSCI 122A',
        id: 'course_122A',
        description: 'Introduction to Data Management',
    },
    {
        name: 'COMPSCI 178',
        id: 'course_178',
        description: 'Machine Learning and Data-Mining',
    }
  ],
  upper_specialization_Information_choose:[
    {
        name: 'I&CSCI 45J',
        id: 'course_45J',
        description: 'Programming in Java as a Second Language',
    },
    {
        name: 'COMPSCI 122B',
        id: 'course_122B',
        description: 'Project in Databases and Web Applications',
    },
    {
        name: 'COMPSCI 122C',
        id: 'course_122C',
        description: 'Principles of Data Management',
    },
    {
        name: 'COMPSCI 122D',
        id: 'course_122D',
        description: 'Beyond SQL Data Management',
    },
    {
        name: 'COMPSCI 125',
        id: 'course_125',
        description: 'Next Generation Search Systems',
    },
    {
        name: 'COMPSCI 132',
        id: 'course_132',
        description: 'Computer Networks',
    },
    {
        name: 'COMPSCI 134',
        id: 'course_134',
        description: 'Computer and Network Security',
    },
    {
        name: 'COMPSCI 141',
        id: 'course_141',
        description: 'Concepts in Programming Languages I',
    },
    {
        name: 'COMPSCI 142A',
        id: 'course_142A',
        description: 'Compilers and Interpreters',
    },
    {
        name: 'COMPSCI 143A',
        id: 'course_143A',
        description: 'Principles of Operating Systems',
    },
    {
        name: 'COMPSCI 163',
        id: 'course_163',
        description: 'Graph Algorithms',
    },
    {
        name: 'COMPSCI 165',
        id: 'course_165',
        description: 'Project in Algorithms and Data Structures',
    },
    {
        name: 'COMPSCI 167',
        id: 'course_167',
        description: 'Introduction to Applied Cryptography',
    },
    {
        name: 'COMPSCI 179',
        id: 'course_179',
        description: 'Algorithms for Probabilistic and Deterministic Graphical Models',
    }
  ],
  upper_specialization_Intelligent_Systems_complete:[
    {
        name: 'COMPSCI 171',
        id: 'course_171',
        description: 'Introduction to Artificial Intelligence',
    },
    {
        name: 'COMPSCI 175',
        id: 'course_175',
        description: 'Project in Artificial Intelligence',
    },
    {
        name: 'COMPSCI 178',
        id: 'course_178',
        description: 'Machine Learning and Data-Mining',
    }
  ],
  upper_specialization_Intelligent_Systems_choose:[
    {
        name: 'COMPSCI 116',
        id: 'course_116',
        description: 'Computational Photography and Vision',
    },
    {
        name: 'COMPSCI 121',
        id: 'course_121',
        description: 'Information Retrieval',
    },
    {
        name: 'COMPSCI 125',
        id: 'course_125',
        description: 'Next Generation Search Systems',
    },
    {
        name: 'COMPSCI 162',
        id: 'course_162',
        description: 'Formal Languages and Automata',
    },
    {
        name: 'COMPSCI 163',
        id: 'course_163',
        description: 'Graph Algorithms',
    },
    {
        name: 'COMPSCI 164',
        id: 'course_164',
        description: 'Computational Geometry and Geometric Modeling',
    },
    {
        name: 'COMPSCI 169',
        id: 'course_169',
        description: 'Introduction to Optimization',
    },
    {
        name: 'COMPSCI 177',
        id: 'course_177',
        description: 'Applications of Probability in Computer Science',
    },
    {
        name: 'COMPSCI 179',
        id: 'course_179',
        description: 'Algorithms for Probabilistic and Deterministic Graphical Models',
    }
  ],
  upper_specialization_Networked_Systems_complete:[
    {
        name: 'COMPSCI 132',
        id: 'course_132',
        description: 'Computer Networks',
    },
    {
        name: 'COMPSCI 133',
        id: 'course_133',
        description: 'Advanced Computer Networks',
    },
    {
        name: 'COMPSCI 134',
        id: 'course_134',
        description: 'Computer and Network Security',
    },
    {
        name: 'COMPSCI 143A',
        id: 'course_143A',
        description: 'Principles of Operating Systems',
    }
  ],
  upper_specialization_Systems_and_Software_complete:[
    {
        name: 'COMPSCI 131',
        id: 'course_131',
        description: 'Parallel and Distributed Computing',
    },
    {
        name: 'COMPSCI 141',
        id: 'course_141',
        description: 'Concepts in Programming Languages I',
    },
    {
        name: 'COMPSCI 142A',
        id: 'course_142A',
        description: 'Compilers and Interpreters',
    },
    {
        name: 'COMPSCI 142B',
        id: 'course_142B',
        description: 'Language Processor Construction',
    },
    {
        name: 'COMPSCI 143A',
        id: 'course_143A',
        description: 'Principles of Operating Systems',
    },
    {
        name: 'COMPSCI 143B',
        id: 'course_143B',
        description: 'Project in Operating System Organization',
    }
  ],
  upper_specialization_Visual_Computing_complete:[
    {
        name: 'COMPSCI 111',
        id: 'course_111',
        description: 'Digital Image Processing',
    },
    {
        name: 'COMPSCI 112',
        id: 'course_112',
        description: 'Computer Graphics',
    },
    {
        name: 'COMPSCI 114',
        id: 'course_114',
        description: 'Projects in Advanced 3D Computer Graphics',
    },
    {
        name: 'COMPSCI 116',
        id: 'course_116',
        description: 'Computational Photography and Vision',
    },
    {
        name: 'COMPSCI 117',
        id: 'course_117',
        description: 'Project in Computer Vision',
    },
    {
        name: 'COMPSCI 118',
        id: 'course_118',
        description: 'Introduction to Virtual Reality',
    },
    {
        name: 'I&CSCI 162',
        id: 'course_162',
        description: 'Modeling and World Building',
    }
  ],
}
const specializationMeta = {
  Algorithms: {
    dataKey: 'upper_specialization_algorithm_complete',
    minCourses: 4,
  },
  'Architecture and Embedded Systems': {
    dataKey: 'upper_specialization_architecture_and_embedded_systems_complete',
    minCourses: 4,
  },
  Bioinformatics: {
    dataKey: 'upper_specialization_Bioinformatics_complete',
    chooseKey: 'upper_specialization_Bioinformatics_choose',
    minCourses: 4,
  },
  Information: {
    dataKey: 'upper_specialization_Information_complete',
    chooseKey: 'upper_specialization_Information_choose',
    minCourses: 4,
  },
  'Intelligent Systems': {
    dataKey: 'upper_specialization_Intelligent_Systems_complete',
    chooseKey: 'upper_specialization_Intelligent_Systems_choose',
    minCourses: 4,
  },
  'Networked Systems': {
    dataKey: 'upper_specialization_Networked_Systems_complete',
    minCourses: 4,
  },
  'Systems and Software': {
    dataKey: 'upper_specialization_Systems_and_Software_complete',
    minCourses: 4,
  },
  'Visual Computing': {
    dataKey: 'upper_specialization_Visual_Computing_complete',
    minCourses: 4,
  },
};

export const ComputerScienceBS2 = () => {
  const { state, dispatch } = useCourseContext();
  // const [mainCourses, setMainCourses] = useState<majorDataType[]>([]);
  // const [chooseCourses, setChooseCourses] = useState<majorDataType[]>([]);

  useEffect(() => {
    //assume user render this page ==> data update needed
    dispatch({type: 'UPDATE_NEEDED', payload: 1})
    // only one time run,
    if (state.save_flag === 0) { //save! only one time
      dispatch({type:"SAVE_ONE_TIME", payload:1})
      const purpose:string[] = ['ADD_NEED_COMPLETE', 'ADD_NEED_COMPLETE', 'ADD_NEED_COMPLETE'
      ,  'ADD_NEED_OTHERS', 'ADD_NEED_PROJECT' ];

      savingMajorData(major_data, dispatch, purpose);
    }
  }, []);

  const handleAddTaken = (course: string) => {
    dispatch({ type: 'ADD_TAKEN', payload: course });
  };
  const handleRemoveTaken = (course: string) => {
    dispatch({ type: 'REMOVE_TAKEN', payload: course });
  };
  const isSpecializationActive = (specialization: string) => {
    return state.specialization === specialization;
  };
  

  const handleToggleSpecialization = (specialization: string) => {

    dispatch({ type: 'TOGGLE_SPECIALIZATION', payload: specialization });
    
    const meta = specializationMeta[specialization as keyof typeof specializationMeta];
    const [main, choose] = [
      specializations[meta.dataKey] || [],
      'chooseKey' in meta ? specializations[meta.chooseKey] || [] : []
    ];

    // Save both main and choose courses together
    savingMajorData(main, dispatch, ['ADD_NEED_SPECIALIZATION']);
    savingMajorData(choose, dispatch, ['ADD_NEED_SPECIALIZATION_ELECTIVE']);
  };

  const handleCheckboxClick = (courseName: string) => {
    if (state.taken.has(courseName)) {
      handleRemoveTaken(courseName);
    } else {
      handleAddTaken(courseName);
    }
  };
  
  return (
    <div className="whole">
      <div className="main_container">
        <h2 id="Step-1">Course Selection - Step 1: select courses you've already taken</h2>
        <div className="sub_container">
        {
          Object.entries(major_data).map(([sectionName, courseList], index) => (
            <div key={sectionName}>
              {major_comment_group[index]?.map((comment, cIndex) => (
                <p key={`comment-${index}-${cIndex}`}>{comment}{`comment-${index}-${cIndex}`}</p>
              ))}
              {courseList.map((course) => (
                <label key={course.id} className="clickable-box" htmlFor={course.id}>
                  <input
                    type="checkbox"
                    id={course.id}
                    className="custom-checkbox"
                    checked={state.taken.has(course.name)}
                    onChange={() => handleCheckboxClick(course.name)}
                  />
                  <span className="checkbox-text name">{course.name}</span>
                  <div className="vertical-line"></div>
                  <span className="checkbox-text description">{course.description}</span>
                </label>
              ))}
            </div>
          ))
        }
        </div>
        
        <div className='sub_container'>
          <div className="upper_div_specialization_list">
            {Object.keys(specializationMeta).map((spec) => (
              <button key={spec} onClick={() => handleToggleSpecialization(spec)}>
                {spec}
              </button>
            ))}
          </div>
          
          {Object.entries(specializationMeta).map(([specName, meta]) => {
            if (!isSpecializationActive(specName)) return null;

            const mainCourses:majorDataType[] = specializations[meta.dataKey] || [];
            let chooseCourses:majorDataType[] = []
            if ('chooseKey' in meta) { //checking 'key' in object of key (=value)
              chooseCourses = specializations[meta.chooseKey];
            }

            return (
              <div key={specName}>
                <hr />
                <h3>{specName}:</h3>
                <div className="sub_container2">
                  {mainCourses.map((course) => (
                    <label key={course.id} className="clickable-box" htmlFor={course.id}>
                      <input
                        type="checkbox"
                        id={course.id}
                        className="custom-checkbox"
                        checked={state.taken.has(course.name)}
                        onChange={() => handleCheckboxClick(course.name)}
                      />
                      <span className="checkbox-text name">{course.name}</span>
                      <div className="vertical-line"></div>
                      <span className="checkbox-text description">{course.description}</span>
                    </label>
                  ))}
                  <hr />
                  {chooseCourses.length !== 0 && (
                    <h4>Select at least {meta.minCourses} courses</h4>
                  )}
                  {chooseCourses.map((course) => (
                    <label key={course.id} className="clickable-box" htmlFor={course.id}>
                      <input
                        type="checkbox"
                        id={course.id}
                        className="custom-checkbox"
                        checked={state.taken.has(course.name)}
                        onChange={() => handleCheckboxClick(course.name)}
                      />
                      <span className="checkbox-text name">{course.name}</span>
                      <div className="vertical-line"></div>
                      <span className="checkbox-text description">{course.description}</span>
                    </label>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
