import { DetailDisplay } from './DetailDisplay'
import { UserIntersection } from './UserIntersection'

export const Section1 = () => {
    return (
        <div className="flex flex-col h-full">
            <div className="flex-none h-[25%] ">
                <DetailDisplay/>
            </div>
            {/* <button onClick={}></button> */}
            <div className="flex-grow">
                <UserIntersection/>
            </div>
        </div>
    )
}