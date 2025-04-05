import React, { useEffect, useState } from 'react';
import { useCourseContext } from "../mainpage";

// Define types for the course data
interface Course {
  id: string;
  name: string;
  prerequisites: string[];
}

interface Position {
  x: number;
  y: number;
}

interface SvgSize {
  width: number;
  height: number;
}

export const GraphVisualizer = () => {

  const { state, dispatch } = useCourseContext();
  
  // Sample course data with prerequisites
  const [courses, setCourses] = useState<Course[]>([
    { id: 'CS101', name: 'Introduction to Programming', prerequisites: [] },
    { id: 'CS201', name: 'Data Structures', prerequisites: ['CS101'] },
    { id: 'CS202', name: 'Algorithms', prerequisites: ['CS201'] },
    { id: 'CS301', name: 'Database Systems', prerequisites: ['CS201'] },
    { id: 'CS302', name: 'Operating Systems', prerequisites: ['CS201'] },
    { id: 'CS401', name: 'Machine Learning', prerequisites: ['CS202', 'MATH201'] },
    { id: 'CS402', name: 'Computer Networks', prerequisites: ['CS302'] },
    { id: 'MATH101', name: 'Calculus I', prerequisites: [] },
    { id: 'MATH201', name: 'Linear Algebra', prerequisites: ['MATH101'] },
  ]);

  const copy_state = state; //get copy of it (don't touch original)
  const combineStateToJSON = (graduationDate?: string): object => {
    return {
      taken: Array.from(copy_state.taken),
      need_complete: Array.from(copy_state.need_complete),
      need_elective: Array.from(copy_state.need_elective),
      need_project: Array.from(copy_state.need_project),
      need_others: Array.from(copy_state.need_others),
      major: 'computer_science',
      prefer: copy_state.prefer,
      num_total: copy_state.num_total,
      num_project: copy_state.num_project,
      graduation_date: graduationDate,
    };
  };
  // API CALL to get 1) tree data 2) next class data
  const getGraphData = async (wholeList: object) => {
    try {
      const response = await fetch('http://localhost:3000/process/graphdata', {
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
  const renderGraphData = async () => {
    const combinedData = combineStateToJSON();
    try {
      const backendgraphdata = await getGraphData(combinedData);
      const graphdata = backendgraphdata.graphdata;
      console.log("SAVING....", graphdata)
      setCourses(graphdata);
    }
    catch(error) {
      console.error("Error fetching data from the backend:", error);
      alert("An error occurred while fetching data.");
    }
  }


  // Positions for rendering nodes
  const [positions, setPositions] = useState<Record<string, Position>>({});
  const [svgSize, setSvgSize] = useState<SvgSize>({ width: 1200, height: 800 });

  // Determine levels of each course (how deep in prerequisite chain)
  useEffect(() => {
    const determinePositions = (): void => {
      const levels: Record<string, number> = {};
      const visited = new Set<string>();
      
      const findLevel = (courseId: string): number => {
        if (levels[courseId] !== undefined) return levels[courseId];
        
        const course = courses.find(c => c.id === courseId);
        if (!course) return 0;
        
        if (visited.has(courseId)) {
          // Cycle detected, which shouldn't happen in a DAG
          console.error(`Cycle detected involving ${courseId}`);
          return 0;
        }
        
        visited.add(courseId);
        
        if (course.prerequisites.length === 0) {
          levels[courseId] = 0;
          return 0;
        }
        
        const prereqLevels = course.prerequisites.map(prereq => findLevel(prereq));
        levels[courseId] = Math.max(...prereqLevels) + 1;
        
        visited.delete(courseId);
        return levels[courseId];
      };
      
      // Find levels for all courses
      courses.forEach(course => {
        findLevel(course.id);
      });
      
      // Group courses by level
      const coursesByLevel: Record<number, string[]> = {};
      Object.keys(levels).forEach(courseId => {
        const level = levels[courseId];
        if (!coursesByLevel[level]) coursesByLevel[level] = [];
        coursesByLevel[level].push(courseId);
      });
      
      // Calculate positions
      const newPositions: Record<string, Position> = {};
      const levelWidth = svgSize.width * 0.8;
      const levelHeight = svgSize.height * 0.9;
      const margin = { x: svgSize.width * 0.05, y: svgSize.height * 0.1 };
      const maxLevel = Math.max(...Object.keys(coursesByLevel).map(Number));
      
      Object.keys(coursesByLevel).forEach(levelStr => {
        const level = Number(levelStr);
        const coursesInLevel = coursesByLevel[level];
        const levelY = margin.y + (levelHeight * level / (maxLevel || 1));
        
        coursesInLevel.forEach((courseId, index) => {
          const levelX = margin.x + (levelWidth * index / (coursesInLevel.length || 1));
          newPositions[courseId] = { x: levelX, y: levelY };
        });
      });
      
      setPositions(newPositions);
    };
    
    determinePositions();
  }, [courses, svgSize]);

  const renderArrow = (x1: number, y1: number, x2: number, y2: number): JSX.Element => {
    // Calculate the angle of the line
    const angle = Math.atan2(y2 - y1, x2 - x1);
    
    // Calculate the coordinates of the arrowhead points
    const arrowSize = 8;
    const arrowPoint1X = x2 - arrowSize * Math.cos(angle - Math.PI / 6);
    const arrowPoint1Y = y2 - arrowSize * Math.sin(angle - Math.PI / 6);
    const arrowPoint2X = x2 - arrowSize * Math.cos(angle + Math.PI / 6);
    const arrowPoint2Y = y2 - arrowSize * Math.sin(angle + Math.PI / 6);

    return (
      <g key={`${x1}-${y1}-${x2}-${y2}`}>
        <line 
          x1={x1} 
          y1={y1} 
          x2={x2} 
          y2={y2}
          stroke="#555" 
          strokeWidth="2"
        />
        <polygon 
          points={`${x2},${y2} ${arrowPoint1X},${arrowPoint1Y} ${arrowPoint2X},${arrowPoint2Y}`}
          fill="#555"
        />
      </g>
    );
  };

  // const addCourse = (): void => {
  //   const id = prompt("Enter course ID (e.g., CS501):");
  //   if (!id) return;
    
  //   const name = prompt("Enter course name:");
  //   if (!name) return;
    
  //   const prereqInput = prompt("Enter prerequisites (comma-separated IDs):");
  //   const prerequisites = prereqInput ? prereqInput.split(',').map(p => p.trim()) : [];
    
  //   setCourses([...courses, { id, name, prerequisites }]);
  // };

  // const removeCourse = (courseId: string): void => {
  //   if (window.confirm(`Remove ${courseId}?`)) {
  //     // Remove the course
  //     const newCourses = courses.filter(c => c.id !== courseId);
      
  //     // Remove this course from prerequisites lists
  //     const updatedCourses = newCourses.map(course => ({
  //       ...course,
  //       prerequisites: course.prerequisites.filter(p => p !== courseId)
  //     }));
      
  //     setCourses(updatedCourses);
  //   }
  // };

  return (
    <div className="flex flex-col items-center w-full max-w-6xl mx-auto bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Course Prerequisite Structure</h2>
      
      {/* <div className="flex justify-between w-full mb-4">
        <button 
          onClick={addCourse}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Add Course
        </button>
      </div> */}
      <button onClick={renderGraphData}>Generate the graph</button>
      <div className="w-full overflow-auto border border-gray-200 rounded-lg">
        <svg width={svgSize.width} height={svgSize.height} className="bg-gray-50">
          {/* Draw edges first so they appear behind nodes */}
          {courses.flatMap(course => 
            course.prerequisites.map(prereqId => {
              if (positions[course.id] && positions[prereqId]) {
                return renderArrow(
                  positions[prereqId].x, 
                  positions[prereqId].y-25, 
                  positions[course.id].x, 
                  positions[course.id].y-52
                );
              }
              return null;
            }).filter(Boolean)
          )}
          
          {/* Draw nodes */}
          {courses.map(course => {
            const pos = positions[course.id];
            if (!pos) return null;
            
            return (
              // <g key={course.id} className="cursor-pointer" onClick={() => removeCourse(course.id)}>
              <g key={course.id} className="cursor-pointer">
                <rect
                  x={pos.x - 50}
                  y={pos.y - 50}
                  width={100}
                  height={25}
                  rx={10} // Optional: for rounded corners
                  fill={course.prerequisites.length === 0 ? "#4ade80" : "#60a5fa"}
                  stroke="#1e3a8a"
                  strokeWidth="2"
                />
                <text 
                  x={pos.x} 
                  y={pos.y - 36}  // optional tweak for vertical alignment
                  textAnchor="middle" 
                  dominantBaseline="middle"
                  fill="white"
                  fontWeight="bold"
                >
                  {course.id}
                </text>
                <text 
                  x={pos.x} 
                  y={pos.y + 10} 
                  textAnchor="middle" 
                  dominantBaseline="middle"
                  fill="#1e3a8a"
                  fontSize="12"
                >
                  {/* {course.name.length > 20 ? `${course.name.substring(0, 30)}...` : course.name} */}
                  
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      
      {/* <div className="mt-4 w-full">
        <h3 className="text-lg font-semibold mb-2">Course List</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">ID</th>
              <th className="border p-2 text-left">Name</th>
              <th className="border p-2 text-left">Prerequisites</th>
            </tr>
          </thead>
          <tbody>
            {courses.map(course => (
              <tr key={course.id} className="hover:bg-gray-50">
                <td className="border p-2">{course.id}</td>
                <td className="border p-2">{course.name}</td>
                <td className="border p-2">{course.prerequisites.join(', ') || 'None'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> */}
    </div>
  );
};
