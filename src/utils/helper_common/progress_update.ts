import { useCourseContext } from '../../mainpage';

//this helper functions is used to update the progress of user major progress from "progress_compoenent.tsx" file
const { state, dispatch } = useCourseContext();

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

const completeCourseCount = () => {
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

// this one simply checks the list data of differnet major
// and check with 'takenlist' and dynamic list and save whatever is not taken into 'need_to_take'
// now we need to set general list for need

export function progress_upadate(): void {
    //check if user did change anything from 'progress page' by checking 'state.change' (boolean)
    //if not, just return (no action needed)

    if (state.update_flag === 0) {
      return;
    }
    else if(state.update_flag !== 1) {
      return;
    }

    // if user did change anything from 'progress page', update the progress data by calling the function
    // go over state.need_complete (set<string)
    // check if that is in 'state.taken' (string[]) -> thinking to change into Set<string> if it is better for permformance
    // if data in state.taken, skip, others (not in) add into

    //user not taken anything
    // here these lists
    state.need_complete
    state.need_elective
    state.need_others
    state.need_project
    state.need_take



    // it does not really need to check size just simply add everything
    // because all those list are 'SET' so it should be handy to use 

    //reset to 0
    dispatch({type: 'UPDATE_NEEDED', payload: 0})
}
  