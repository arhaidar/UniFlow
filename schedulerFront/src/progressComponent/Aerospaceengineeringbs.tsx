import React from 'react';
import { useState } from 'react'; // ✅ Add useState here
import { useCourseContext } from '../mainpage';
// import './css/checkbox.css'
import '../css/cs1_ver2.css'
// import './css'

export const AerospaceEngineeringBS = ({major}:any) => {
  const { state, dispatch } = useCourseContext();
    console.log("you are here!!!")
  const handleAddTaken = (course: string) => {
    dispatch({ type: 'ADD_TAKEN', payload: course });
  };
  const handleRemoveTaken = (course: string) => {
    dispatch({ type: 'REMOVE_TAKEN', payload: course });
  };
  const handleAddProject = (course: string) => {
    dispatch({ type: 'ADD_PROJECT', payload: course });
  };
  const handleRemoveProject = (course: string) => {
    dispatch({ type: 'REMOVE_PROJECT', payload: course });
  };
  const handleAddUpper = (course: string) => {
    dispatch({ type: 'ADD_UPPER', payload: course });
  };
  const handleRemoveUpper = (course: string) => {
    dispatch({ type: 'REMOVE_UPPER', payload: course });
  };
  const handleToggleSpecialization = (specialization: string) => {
    dispatch({ type: 'TOGGLE_SPECIALIZATION', payload: specialization });
  };
  const isSpecializationActive = (specialization: string) => {
    return state.specialization === specialization;
  };

 // Generalized handleSelectAll function
 const handleSelectAll = (courseList: { name: string }[], isAllSelected: boolean, setIsAllSelected: React.Dispatch<React.SetStateAction<boolean>>) => {
    if (isAllSelected) {
      courseList.forEach(course => handleRemoveTaken(course.name));
    } else {
      courseList.forEach(course => handleAddTaken(course.name));
    }
    setIsAllSelected(!isAllSelected); // Toggle state
  };
  const [lowerAllSelected, setLowerAllSelected] = useState(false);
  const [upperCoreAllSelected, setUpperCoreAllSelected] = useState(false);
  const [upperElectivesSelected, setUpperElectivesAllSelected] = useState(false);
  const [upperProjectSelected, setUpperProjectAllSelected] = useState(false);
  const [upperSpecializationAlgorithmSelected, selectUpperSpecializationAlgorithmAllSelected] = useState(false);
  const [upperSpecializationArchitectureEmbeddedSysSelected, selectUpperSpecializationArchitectureEmbeddedSysSelected] = useState(false);
  const [upperSpecializationBioInformaticsSelected, selectUpperSpecializationBioInformaticsAllSelected] = useState(false);
  const [upperSpecializationInformationSelected, selectUpperSpecializationInformationAllSelected] = useState(false);
  const [upperSpecializationIntelligentSystemsSelected, selectUpperSpecializationBioIntelligentSystemsAllSelected] = useState(false);
  const [upperSpecializationSystemsSoftwareSelected, selectUpperSpecializationSystemsSoftwareAllSelected] = useState(false);
  const [upperSpecializationVisualComputingSelected, selectUpperSpecializationVisualComputingAllSelected] = useState(false);

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

  const handleCheckboxClick = (courseName: string) => {
    if (state.taken.has(courseName)) {
      handleRemoveTaken(courseName);
      if (projectList.includes(courseName)) handleRemoveProject(courseName);
      if (!lowerList.includes(courseName)) handleRemoveUpper(courseName);
    } else {
      handleAddTaken(courseName);
      if (projectList.includes(courseName)) handleAddProject(courseName);
      if (!lowerList.includes(courseName)) handleAddUpper(courseName);
    }
  };
  

  //This list is only for checbox
  const lower_division_courses:{name:string; id:string; description:string;}[] = [
    {
        name: 'I&C SCI 31',
        id: 'course_31',
        description: 'Introduction to Programming',
    },
    {
        name: 'I&C SCI 32',
        id: 'course_32',
        description: 'Programming with Software Libraries',
    },
    {
        name: 'I&C SCI H32',
        id: 'course_H32',
        description: 'Python Programming and Libraries (Accelerated)',
    },
    {
        name: 'I&C SCI 33',
        id: 'course_33',
        description: 'Intermediate Programming',
    },
    {
        name: 'I&C SCI 45C',
        id: 'course_45C',
        description: 'Programming in C/C++ as a Second Language',
    },
    {
        name: 'I&C SCI 46',
        id: 'course_46',
        description: 'Data Structure Implementation and Analysis',
    },
    {
        name: 'I&C SCI 51',
        id: 'course_51',
        description: 'Introductory Computer Organization',
    },
    {
        name: 'I&C SCI 53',
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
        name: 'I&C SCI 6B',
        id: 'course_6B',
        description: 'Boolean Logic and Discrete Structures',
    },
    {
        name: 'I&C SCI 6D',
        id: 'course_6D',
        description: 'Discrete Mathematics for Computer Science',
    },
    {
        name: 'I&C SCI 6N',
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
      name: 'I&C SCI 139W',
      id: 'course_139W',
      description: 'Critical Writing on Information Technology',
    },
  ];

  const upper_division_electives:{name:string; id:string; description:string;}[] = [
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
        name: 'I&C SCI 162',
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
    }
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
        name: 'I&C SCI 45J',
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
        name: 'I&C SCI 162',
        id: 'course_162',
        description: 'Modeling and World Building',
    }
  ];

  // We remove all references to sliders and create collapsible sections.
  const [showLower, setShowLower] = useState(true);
  const [showUpperCore, setShowUpperCore] = useState(true);
  const [showUpperElectives, setShowUpperElectives] = useState(true);
  const [showProjectCourses, setShowProjectCourses] = useState(true);
  const [showSpecializations, setShowSpecializations] = useState(true);
  

  // * NEW VERSION *
  // ------------------------------
  // Render: split into slides
  // ------------------------------
  return (
    <div className="cs1_container">
      <header className="zot-header">
        <h1 className="zot-title">
          <a href="/" className="zot-title-link">
            <span id="zot-bold">UCI</span> {major}
          </a>
        </h1>
        <div className="zot-underline"></div>
      </header>
      <h2 id="Step-1">Course Selection - Step 1: select courses you've already taken</h2>
      
       {/* Lower-Division Collapsible */}
      <div className="collapsible-container">
        <div className="collapsible-title" onClick={() => setShowLower(!showLower)}>
          <h2>Lower-division</h2>
          <span className="arrow-icon">{showLower ? '▲' : '▼'}</span>
        </div>
        {showLower && (
          <div className="collapsible-content">
            <hr />
            <button
              className="btn liquid"
              onClick={() =>
                handleSelectAll(lower_division_courses, lowerAllSelected, setLowerAllSelected)
              }
            >
              {lowerAllSelected ? "Deselect All" : "Select All"}
            </button>
            <div className="scroll-container">
              {lower_division_courses.map((course) => (
                <label key={course.id} className="clickable-box" htmlFor={course.id}>
                  <input
                    type="checkbox"
                    id={course.id}
                    className="custom-checkbox"
                    checked={state.taken.has(course.name)}
                    onChange={() => handleCheckboxClick(course.name)}
                  />
                  <span className="checkbox-text">{course.name} - {course.description}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
