import { useState } from 'react';
import { DetailDisplay } from './DetailDisplay'
import { UserIntersection } from './UserIntersection'

export const Section1 = () => {
    const [topHeight, setTopHeight] = useState('15%');

    // const handleExpandClick = () => {
    //     setTopHeight(topHeight === '10%' ? '40%' : '10%'); // Toggle between 10% and 30%
    // };
    return (
        <div className="flex flex-col h-full">
            <div className="flex-none" style={{ height: topHeight }}>
                <DetailDisplay/>
            </div>
            <div className="flex justify-end mt-2">
            </div>
            {/* <button onClick={}></button> */}
            <div className="flex-grow">
                <UserIntersection/>
            </div>
        </div>
    )
}