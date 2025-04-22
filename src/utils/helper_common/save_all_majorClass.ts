interface Course {
    name: string;
    id: string;
    description: string;
}

type MajorData = {
    [key: string]: Course[];
};

// input: major_data
// ouput: none
// function: save each one as purpose of each list
export async function savingMajorData(major_data:MajorData|Course[],dispatch: React.Dispatch<any>, purpose:string[]) {
    let index:number = 0;
    
    if (Array.isArray(major_data)) {
        const courses = new Set(major_data.map(course => course.name));
        // console.log("SPECILIZATION::: => ", courses, ' at 0 , ', purpose[0]);
        dispatch({ type: purpose[0], payload: courses });
    } 
    else {
        Object.keys(major_data).forEach((key) => {
            const courseList = major_data[key];
            const courses: Set<string> = new Set(courseList.map((course) => course.name));
            // console.log("CHECKING => ", courses, ' at ', index , ' , ', purpose[index])
            dispatch({type:purpose[index], payload:courses}) //each purposes
            index++;
        });
    }
}
