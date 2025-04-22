import { DetailDisplay } from './DetailDisplay'
import { UserIntersection } from './UserIntersection'

export const Section1 = () => {
    return (
        <div className="flex flex-col h-full">
            <div className="flex-none h-[25%] overflow-auto">
                <DetailDisplay/>
            </div>
            {/* <button onClick={}></button> */}
            <div className="flex-grow overflow-auto">
                <UserIntersection/>
            </div>
        </div>
    )
}