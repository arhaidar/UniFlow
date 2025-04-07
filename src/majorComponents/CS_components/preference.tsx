import React, { useEffect, useState} from 'react';
import { useCourseContext } from '../../mainpage';
// import '../css/checkbox.css'

// import Slider from 'react-slick';

// Import the slick CSS

// import '../css/cs1_ver2.css'; //it will apply both page 1 and 2


export const Preference = () => {
  const { state, dispatch } = useCourseContext();

  const handleAddPrefer = (course: string) => {
    dispatch({ type: 'ADD_PREFER', payload: course });
  };
    
  const handleRemovePrefer = (course: string) => {
    dispatch({ type: 'REMOVE_PREFER', payload: course });
  };

  const handleToggleSpecialization = (specialization: string) => {
    dispatch({ type: 'TOGGLE_SPECIALIZATION', payload: specialization });
  };

  const isSpecializationActive = (specialization: string) => {
    return state.specialization === specialization; // 현재 전공과 비교
  };

  const handleAddComplete = (list: Set<string>) => {
    dispatch({ type: 'ADD_COMPLETE', payload: list });
  };
  const handleAddElective = (list: Set<string>) => {
    dispatch({ type: 'ADD_ELECTIVE', payload: list });
  };
  const handleAddProject = (list: Set<string>) => {
    dispatch({ type: 'ADD_NEED_PROJECT', payload: list });
  };
  const handleAddOthers = (list: Set<string>) => {
    dispatch({ type: 'ADD_OTHERS', payload: list });
  };

  //updating data
  const completeCourseCount = () => {
    console.log("RUN UPDATE FUNC\n")
    const specializationCompleteList:string|null = state.specialization; //string
    let completeCourses: { name: string; id: string; description: string; }[] = []; //we just need name... but upper_specialization_algorithm_complete list has this kind of structure...
    let electiveCourses: { name: string; id: string; description: string; }[] = []; //we just need name...
  
    switch (specializationCompleteList) {
      case 'Algorithms':
          completeCourses = upper_specialization_algorithm_complete;
          electiveCourses = [];
          break;
      case 'Architecture and Embedded Systems':
          completeCourses = upper_specialization_architecture_and_embedded_systems_complete;
          electiveCourses = [];
          break;
      case 'Bioinformatics':
          completeCourses = upper_specialization_Bioinformatics_complete; // Bioinformatics 전공 완료 목록
          electiveCourses = upper_specialization_Bioinformatics_choose;
          break;
      case 'Information':
          completeCourses = upper_specialization_Information_complete; // Information 전공 완료 목록
          electiveCourses = upper_specialization_Information_choose;
          break;
      case 'Intelligent Systems':
          completeCourses = upper_specialization_Intelligent_Systems_complete; // Intelligent Systems 전공 완료 목록
          electiveCourses = upper_specialization_Intelligent_Systems_choose;
          break;
      case 'Networked Systems':
          completeCourses = upper_specialization_Networked_Systems_complete; // Networked Systems 전공 완료 목록
          electiveCourses = [];
          break;
      case 'Systems and Software':
          completeCourses = upper_specialization_Systems_and_Software_complete; // Systems and Software 전공 완료 목록
          electiveCourses = [];
          break;
      case 'Visual Computing':
          completeCourses = upper_specialization_Visual_Computing_complete; // Visual Computing 전공 완료 목록
          electiveCourses = [];
          break;
      default:
          completeCourses = [];
          electiveCourses = [];
    }

    //check the completeCourses & lower_division_courses & upper_core is in the list, 'taken' if not, call 'handleAddComplete'
    //check the electiveCourses is in the list, 'taken' if not, call 'handleAddElective'
    //check the projectCourses is in the list, 'taken' if not, call 'handleAddProject'
    //check the upper_project_courses is in the list, 'taken' if not, call 'handleAddOthers'
    const takenCourses = state.taken || []; // 이수한 과목 목록 가져오기

    const newCompleteCourses: Set<string> = new Set(
      completeCourses
          .filter(course => !takenCourses.has(course.name)) // 이수하지 않은 과목만 필터링
          .map(course => course.name) // 과목 이름만 추출
    );
    const newCompleteCourses2: Set<string> = new Set(
      lower_division_courses
          .filter(course => !takenCourses.has(course.name)) // 이수하지 않은 과목만 필터링
          .map(course => course.name) // 과목 이름만 추출
    );
    const newCompleteCourses3: Set<string> = new Set(
      upper_core
          .filter(course => !takenCourses.has(course.name)) // 이수하지 않은 과목만 필터링
          .map(course => course.name) // 과목 이름만 추출
    );
    const combinedCompleteCourses: Set<string> = new Set([
      ...newCompleteCourses,
      ...newCompleteCourses2,
      ...newCompleteCourses3
    ]);


    const newElectiveCourses: Set<string> = new Set(
      electiveCourses
          .filter(course => !takenCourses.has(course.name)) // 이수하지 않은 과목만 필터링
          .map(course => course.name) // 과목 이름만 추출
    );

    const newProjectCourses: Set<string> = new Set(
      upper_project_courses
          .filter(course => !takenCourses.has(course.name)) // 이수하지 않은 과목만 필터링
          .map(course => course.name) // 과목 이름만 추출
    );

    const newOthersCourses: Set<string> = new Set(
      upper_division_electives
          .filter(course => !takenCourses.has(course.name)) // 이수하지 않은 과목만 필터링
          .map(course => course.name) // 과목 이름만 추출
    );

    if (combinedCompleteCourses.size > 0) {
      handleAddComplete(combinedCompleteCourses); // 전체 완료 과목 추가
    }
    if (newElectiveCourses.size > 0) {
      handleAddElective(newElectiveCourses); // 전체 선택 과목 추가
    }
    if (newProjectCourses.size > 0) {
      handleAddProject(newProjectCourses); // 전체 선택 과목 추가
    }
    if (newOthersCourses.size > 0) {
      handleAddOthers(newOthersCourses); // 전체 선택 과목 추가
    }


  };

  // const projectList: string[] = [
  //   "COMPSCI 113",
  //   "COMPSCI 114",
  //   "COMPSCI 117",
  //   "COMPSCI 118",
  //   "COMPSCI 122B",
  //   "COMPSCI 122C",
  //   "COMPSCI 122D",
  //   "COMPSCI 125",
  //   "COMPSCI 133",
  //   "COMPSCI 142B",
  //   "COMPSCI 143B",
  //   "COMPSCI 145",
  //   "COMPSCI 147",
  //   "COMPSCI 153",
  //   "COMPSCI 154",
  //   "COMPSCI 165",
  //   "COMPSCI 175",
  //   "COMPSCI 180A",
  //   "COMPSCI 180B",
  //   "COMPSCI 189",
  //   "IN4MATX 117",
  //   "IN4MATX 134"
  // ];

  // const lowerList: string[] = [
  //   'I&C SCI 31',
  //   'I&C SCI 32',
  //   'I&C SCI H32',
  //   'I&C SCI 33',
  //   'I&C SCI 45C',
  //   'I&C SCI 46',
  //   'I&C SCI 51',
  //   'I&C SCI 53',
  //   'IN4MATX 43',
  //   'MATH 2A',
  //   'MATH 2B',
  //   'I&C SCI 6B',
  //   'I&C SCI 6D',
  //   'I&C SCI 6N',
  //   'MATH 3A',
  //   'STATS 67'
  // ];

  // const handleCheckboxClick = (courseName: string, checkboxId: string) => {
  //   const checkbox = document.getElementById(checkboxId) as HTMLInputElement | null;
  //   if (checkbox) {
  //     const isChecked = !checkbox.checked;
  //     checkbox.checked = isChecked;

  //     if (isChecked) {
  //       handleAddPrefer(courseName);
  //       // if(projectList.includes(courseName))
  //       //   handleAddProject(courseName);
  //       // if(!lowerList.includes(courseName))
  //       //   handleAddUpper(courseName);
  //     } else {
  //       handleRemovePrefer(courseName);
  //       // if(projectList.includes(courseName))
  //       //   handleRemoveProject(courseName);
  //       // if(!lowerList.includes(courseName))
  //       //   handleRemoveUpper(courseName);
  //     }
  //   }
  // };

  //This list is only for checbox
  //This list is only for checbox
  //This list is only for checbox
  const lower_division_courses:{name:string; id:string; description:string;}[] = [
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
  ];
  const upper_core:{name:string; id:string; description:string;}[] = [
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
  ];

  const upper_division_electives:{name:string; id:string; description:string;}[] = [
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
  ];

  const upper_project_courses:{name:string; id:string; description:string;}[] = [
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
  ];

  const upper_specialization_algorithm_complete: { name: string; id: string; description: string; }[] = [
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
  ];
  const upper_specialization_architecture_and_embedded_systems_complete: { name: string; id: string; description: string; }[] = [
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
  ];

  const upper_specialization_Bioinformatics_complete: { name: string; id: string; description: string; }[] = [
    {
        name: 'COMPSCI 184A',
        id: 'course_184A',
        description: 'Artificial Intelligence in Biology and Medicine',
    }
  ];
  const upper_specialization_Bioinformatics_choose: { name: string; id: string; description: string; }[] = [
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
  ];

  const upper_specialization_Information_complete: { name: string; id: string; description: string; }[] = [
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
  ];
  const upper_specialization_Information_choose: { name: string; id: string; description: string; }[] = [
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
  ];

  const upper_specialization_Intelligent_Systems_complete: { name: string; id: string; description: string; }[] = [
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
  ];
  const upper_specialization_Intelligent_Systems_choose: { name: string; id: string; description: string; }[] = [
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
  ];

  const upper_specialization_Networked_Systems_complete: { name: string; id: string; description: string; }[] = [
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
  ];
  const upper_specialization_Systems_and_Software_complete: { name: string; id: string; description: string; }[] = [
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
  ];
  const upper_specialization_Visual_Computing_complete: { name: string; id: string; description: string; }[] = [
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
  ];


   // 🔹 Define state for "Select All"
  const [allSelected, setAllSelected] = useState(false);

  const handleRemoveUpper = (course: string) => {
    dispatch({ type: 'REMOVE_UPPER', payload: course });
  };

  const handleSelectAll = () => {
    if (allSelected) {
      // Uncheck all courses
      lower_division_courses.forEach(course => {
        if(!state.taken.has(course.name))
          handleRemovePrefer(course.name);
      });
    } else {
      // Check all courses
      lower_division_courses.forEach(course => {
        if(!state.taken.has(course.name))
          handleAddPrefer(course.name);
      });
    }
    setAllSelected(!allSelected); // Toggle state
  };

  const projectList: string[] = [
    "COMPSCI 113",
    "COMPSCI 114",
    "COMPSCI 117",
    "COMPSCI 118",
    "COMPSCI 122B",
    "COMPSCI 122C",
    "COMPSCI 122D",
    "COMPSCI 125",
    "COMPSCI 133",
    "COMPSCI 142B",
    "COMPSCI 143B",
    "COMPSCI 145",
    "COMPSCI 147",
    "COMPSCI 153",
    "COMPSCI 154",
    "COMPSCI 165",
    "COMPSCI 175",
    "COMPSCI 180A",
    "COMPSCI 180B",
    "COMPSCI 189",
    "IN4MATX 117",
    "IN4MATX 134"
  ];
  const lowerList: string[] = [
    'I&C SCI 31',
    'I&C SCI 32',
    'I&C SCI H32',
    'I&C SCI 33',
    'I&C SCI 45C',
    'I&C SCI 45J',
    'I&C SCI 46',
    'I&C SCI 51',
    'I&C SCI 53',
    'IN4MATX 43',
    'MATH 2A',
    'MATH 2B',
    'I&C SCI 6B',
    'I&C SCI 6D',
    'I&C SCI 6N',
    'MATH 3A',
    'STATS 67',
    'COMPSCI 161',
    'I&C SCI 139W',
  ];
  const handleCheckboxClick = (courseName: string, courseid:string) => {
    if (state.prefer.has(courseName)) {
      handleRemovePrefer(courseName);
      // if (projectList.includes(courseName)) handleRemovePrefer(courseName);
      // if (!lowerList.includes(courseName)) handleRemoveUpper(courseName);
    } else {
      handleAddPrefer(courseName);
      // if (projectList.includes(courseName)) handleAddPrefer(courseName);
      // if (!lowerList.includes(courseName)) handleAddPrefer(courseName);
    }
  };

  useEffect(() => {
    completeCourseCount();
  },[]);

  return (
    <div className="whole">

      {/* <header className="zot-header">
        <h1 className="zot-title">
          <a href="/" className="zot-title-link">
              <span id="zot-bold">UCI</span> Auto Planner
          </a>
        </h1>
        <div className="zot-underline"></div>
      </header> */}
      <div className='main_container'>

        <h2 id="Step-1">Course Selection - Step 2: select courses you prefer or are interested in:</h2>
        <div className="sub_container">
          <h2>Lower-division:</h2>
          <hr />
          <div className="sub_container2">
            {lower_division_courses.filter(course=>!state.taken.has(course.name)).map((course) => (
              <label key={course.id} className="clickable-box" htmlFor={course.id}>
                <input
                  type="checkbox"
                  id={course.id}
                  className="custom-checkbox"
                  checked={state.taken.has(course.name)}
                  onChange={() => handleCheckboxClick(course.name, course.id)} 
                />
                <span className="checkbox-text name">{course.name}</span>
                <div className="vertical-line"></div>
                <span className="checkbox-text description">{course.description}</span>
              </label>
            ))}
          </div>
        </div>

        <div className='upper_div'>
          <h2>Upper-division</h2>

          <hr/>
          <h3>A. Core</h3>
          <div className='upper_core'>
            {upper_core.filter(course=>!state.taken.has(course.name)).map(course => (
              <div
                key={course.id}
                className="clickable-box"
                onClick={() => handleCheckboxClick(course.name, course.id)} // 함수 호출
              >
                <input
                  type="checkbox"
                  id={course.id}
                  className="sr-only" // 체크박스를 화면에서 숨김
                  checked={state.prefer.has(course.name)} // 체크 상태를 state로 관리
                  readOnly
                />
                <label htmlFor={course.id} className="ml-2">
                  {course.name} - {course.description}
                </label>
              </div>
            ))}
          </div>

          <hr/>
          <h3>B. Upper-division electives: Select 11 upper-division courses from the list below. Sections B-1 and B-2 must be completed as part of the 11 upper-division electives.</h3>
          <p>Currently selected: {state.num_total} classes</p>
          <div className='upper_division_electives'>
            {upper_division_electives.filter(course=>!state.taken.has(course.name)).map(course => (
              <div
                key={course.id}
                className="clickable-box"
                onClick={() => handleCheckboxClick(course.name, course.id)} // 함수 호출
              >
                <input
                  type="checkbox"
                  id={course.id}
                  className="sr-only" // 체크박스를 화면에서 숨김
                  checked={state.prefer.has(course.name)} // 체크 상태를 state로 관리
                  readOnly
                />
                <label htmlFor={course.id} className="ml-2">
                  {course.name} - {course.description}
                </label>
              </div>
            ))}
          </div>
          
          <hr/>
          <h3>B-1. Project Courses: Choose at least two projects courses from the following list:</h3>
          <p>Currently selected: <span style={{ fontWeight: state.num_project > 11 ? 'bold' : 'normal' }}>{state.num_project}</span> classes</p>
          <div className='upper_project_courses'>
            {upper_project_courses.filter(course=>!state.taken.has(course.name)).map(course => (
              <div
                key={course.id}
                className="clickable-box"
                onClick={() => handleCheckboxClick(course.name, course.id)} // 함수 호출
              >
                <input
                  type="checkbox"
                  id={course.id}
                  className="sr-only" // 체크박스를 화면에서 숨김
                  checked={state.prefer.has(course.name)} // 체크 상태를 state로 관리
                  readOnly
                />
                <label htmlFor={course.id} className="ml-2">
                  {course.name} - {course.description}
                </label>
              </div>
            ))}
          </div>

          <hr/>
          <div className='upper_div_specialization'>
            <h3>B-2. Specialization: Select and satisfy the requirements for one of the specializations below. (Note: Students may not pursue more than one specialization.)</h3>
            <div className='upper_div_specialization_list'>
              <button onClick={() => handleToggleSpecialization('Algorithms')}>Algorithms</button>
              <button onClick={() => handleToggleSpecialization('Architecture and Embedded Systems')}>Architecture and Embedded Systems</button>
              <button onClick={() => handleToggleSpecialization('Bioinformatics')}>Bioinformatics</button>
              <button onClick={() => handleToggleSpecialization('Information')}>Information</button>
              <button onClick={() => handleToggleSpecialization('Intelligent Systems')}>Intelligent Systems</button>
              <button onClick={() => handleToggleSpecialization('Networked Systems')}>Networked Systems</button>
              <button onClick={() => handleToggleSpecialization('Systems and Software')}>Systems and Software</button>
              <button onClick={() => handleToggleSpecialization('Visual Computing')}>Visual Computing</button>
            </div>

            {isSpecializationActive('Algorithms') && (
            <>
              <h3>Algorithms: Four courses from the following list:</h3>
              {upper_specialization_algorithm_complete.filter(course=>!state.taken.has(course.name)).map(course => (
                <div
                  key={course.id}
                  className="clickable-box"
                  onClick={() => handleCheckboxClick(course.name, course.id)} // 함수 호출
                >
                  <input
                    type="checkbox"
                    id={course.id}
                    className="sr-only" // 체크박스를 화면에서 숨김
                    checked={state.prefer.has(course.name)} // 체크 상태를 state로 관리
                    readOnly
                  />
                  <label htmlFor={course.id} className="ml-2">
                    {course.name} - {course.description}
                  </label>
                </div>
              ))}
            </>)}

            {isSpecializationActive('Architecture and Embedded Systems') && (
            <>
              <h3>Architecture and Embedded Systems: four courses from the following list:</h3>
              {upper_specialization_architecture_and_embedded_systems_complete.filter(course=>!state.taken.has(course.name)).map(course => (
                <div
                  key={course.id}
                  className="clickable-box"
                  onClick={() => handleCheckboxClick(course.name, course.id)} // 함수 호출
                >
                  <input
                    type="checkbox"
                    id={course.id}
                    className="sr-only" // 체크박스를 화면에서 숨김
                    checked={state.prefer.has(course.name)} // 체크 상태를 state로 관리
                    readOnly
                  />
                  <label htmlFor={course.id} className="ml-2">
                    {course.name} - {course.description}
                  </label>
                </div>
              ))}
            </>)}

            {isSpecializationActive('Bioinformatics') && (
            <>
              <h3>Bioinformatics: complete</h3>
              {upper_specialization_Bioinformatics_complete.filter(course=>!state.taken.has(course.name)).map(course => (
                <div
                  key={course.id}
                  className="clickable-box"
                  onClick={() => handleCheckboxClick(course.name, course.id)} // 함수 호출
                >
                  <input
                    type="checkbox"
                    id={course.id}
                    className="sr-only" // 체크박스를 화면에서 숨김
                    checked={state.prefer.has(course.name)} // 체크 상태를 state로 관리
                    readOnly
                  />
                  <label htmlFor={course.id} className="ml-2">
                    {course.name} - {course.description}
                  </label>
                </div>
              ))}

              <h3>and three courses from the following list:</h3>
              {upper_specialization_Bioinformatics_choose.filter(course=>!state.taken.has(course.name)).map(course => (
                <div
                  key={course.id}
                  className="clickable-box"
                  onClick={() => handleCheckboxClick(course.name, course.id)} // 함수 호출
                >
                  <input
                    type="checkbox"
                    id={course.id}
                    className="sr-only" // 체크박스를 화면에서 숨김
                    checked={state.prefer.has(course.name)} // 체크 상태를 state로 관리
                    readOnly
                  />
                  <label htmlFor={course.id} className="ml-2">
                    {course.name} - {course.description}
                  </label>
                </div>
              ))}
            </>)}

            {isSpecializationActive('Information') && (
            <>
              <h3>Information: complete</h3>
              {upper_specialization_Information_complete.filter(course=>!state.taken.has(course.name)).map(course => (
                <div
                  key={course.id}
                  className="clickable-box"
                  onClick={() => handleCheckboxClick(course.name, course.id)} // 함수 호출
                >
                  <input
                    type="checkbox"
                    id={course.id}
                    className="sr-only" // 체크박스를 화면에서 숨김
                    checked={state.prefer.has(course.name)} // 체크 상태를 state로 관리
                    readOnly
                  />
                  <label htmlFor={course.id} className="ml-2">
                    {course.name} - {course.description}
                  </label>
                </div>
              ))}

              <h3>and four courses from:</h3>
              {upper_specialization_Information_choose.filter(course=>!state.taken.has(course.name)).map(course => (
                <div
                  key={course.id}
                  className="clickable-box"
                  onClick={() => handleCheckboxClick(course.name, course.id)} // 함수 호출
                >
                  <input
                    type="checkbox"
                    id={course.id}
                    className="sr-only" // 체크박스를 화면에서 숨김
                    checked={state.prefer.has(course.name)} // 체크 상태를 state로 관리
                    readOnly
                  />
                  <label htmlFor={course.id} className="ml-2">
                    {course.name} - {course.description}
                  </label>
                </div>
              ))}
            </>)}
            
            {isSpecializationActive('Intelligent Systems') && (
            <>
              <h3>Intelligent Systems: complete</h3>
              {upper_specialization_Intelligent_Systems_complete.filter(course=>!state.taken.has(course.name)).map(course => (
                <div
                  key={course.id}
                  className="clickable-box"
                  onClick={() => handleCheckboxClick(course.name, course.id)} // 함수 호출
                >
                  <input
                    type="checkbox"
                    id={course.id}
                    className="sr-only" // 체크박스를 화면에서 숨김
                    checked={state.prefer.has(course.name)} // 체크 상태를 state로 관리
                    readOnly
                  />
                  <label htmlFor={course.id} className="ml-2">
                    {course.name} - {course.description}
                  </label>
                </div>
              ))}
              <h3>and at least three courses from:</h3>
              {upper_specialization_Intelligent_Systems_choose.filter(course=>!state.taken.has(course.name)).map(course => (
                <div
                  key={course.id}
                  className="clickable-box"
                  onClick={() => handleCheckboxClick(course.name, course.id)} // 함수 호출
                >
                  <input
                    type="checkbox"
                    id={course.id}
                    className="sr-only" // 체크박스를 화면에서 숨김
                    checked={state.prefer.has(course.name)} // 체크 상태를 state로 관리
                    readOnly
                  />
                  <label htmlFor={course.id} className="ml-2">
                    {course.name} - {course.description}
                  </label>
                </div>
              ))}
            </>)}
            
            {isSpecializationActive('Networked Systems') && (
            <>
              <h3>Networked Systems</h3>
              {upper_specialization_Networked_Systems_complete.filter(course=>!state.taken.has(course.name)).map(course => (
                <div
                  key={course.id}
                  className="clickable-box"
                  onClick={() => handleCheckboxClick(course.name, course.id)} // 함수 호출
                >
                  <input
                    type="checkbox"
                    id={course.id}
                    className="sr-only" // 체크박스를 화면에서 숨김
                    checked={state.prefer.has(course.name)} // 체크 상태를 state로 관리
                    readOnly
                  />
                  <label htmlFor={course.id} className="ml-2">
                    {course.name} - {course.description}
                  </label>
                </div>
              ))}
            </>)}
            
            {isSpecializationActive('Systems and Software') && (
            <>
              <h3>Systems and Software: three courses from the following list:</h3>
              {upper_specialization_Systems_and_Software_complete.filter(course=>!state.taken.has(course.name)).map(course => (
                <div
                  key={course.id}
                  className="clickable-box"
                  onClick={() => handleCheckboxClick(course.name, course.id)} // 함수 호출
                >
                  <input
                    type="checkbox"
                    id={course.id}
                    className="sr-only" // 체크박스를 화면에서 숨김
                    checked={state.prefer.has(course.name)} // 체크 상태를 state로 관리
                    readOnly
                  />
                  <label htmlFor={course.id} className="ml-2">
                    {course.name} - {course.description}
                  </label>
                </div>
              ))}
            </>)}

            {isSpecializationActive('Visual Computing') && (
            <>
              <h3>Visual Computing: four courses from the following list:</h3>
              {upper_specialization_Visual_Computing_complete.filter(course=>!state.taken.has(course.name)).map(course => (
                <div
                  key={course.id}
                  className="clickable-box"
                  onClick={() => handleCheckboxClick(course.name, course.id)} // 함수 호출
                >
                  <input
                    type="checkbox"
                    id={course.id}
                    className="sr-only" // 체크박스를 화면에서 숨김
                    checked={state.prefer.has(course.name)} // 체크 상태를 state로 관리
                    readOnly
                  />
                  <label htmlFor={course.id} className="ml-2">
                    {course.name} - {course.description}
                  </label>
                </div>
              ))}
            </>)}

          </div>

        </div>
      </div>
    </div>
  );
};
