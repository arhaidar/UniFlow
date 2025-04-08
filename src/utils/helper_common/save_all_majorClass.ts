


import { useCourseContext } from '../../mainpage';

//this helper functions is used to update the progress of user major progress from "progress_compoenent.tsx" file
const { state, dispatch } = useCourseContext();

type Course = {
    name: string;
    id: string;
    description: string;
};

// input: major_data
export function savingMajorData(major_data:Object): void {

    Object.keys(major_data).forEach((key) => {
        const courses = major_data[key as keyof typeof major_data];

        if (Array.isArray(courses)) {
            const courseNames: Set<string> = new Set(courses.map((course: Course) => course.name))
            // savingMajorData(courseNames); // Save one array of names at a time
            dispatch({type:'ADD_COMPLETE', payload:courseNames})
        }
    });
}