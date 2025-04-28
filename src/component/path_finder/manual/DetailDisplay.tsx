
// import { useCourseContext } from '../../../mainpage'; //sharing data
// import { Graduation } from './Graduation';
import { UserProgress } from './UserProgress'
import { useCourseContext } from '../../../mainpage'; //sharing data

export const DetailDisplay = () => {
    const { state } = useCourseContext();
    
    return (
        <div className="flex flex-col h-full">
            <UserProgress state={state} />
        </div>
    )
}