import { Line } from 'rc-progress';

export const UserProgress = ({state}:any) => {

    const renderBox = (title: string, selected: number, total:number,list: Set<string>) => (
        <div className="flex flex-col  border rounded-xl p-4 relative shadow-md bg-white w-[25%] mx-[0.1%] min-w-[50px]">
            <div className='mb-5'>
                <p className="text-base font-semibold mb-2 truncate">{title}</p>
                <Line percent={(selected / total) * 100} strokeWidth={5} strokeColor="#4ade80" className="mb-3" />
                <p>{`${selected} / ${total}`}</p>
            </div>  
            <div className="flex flex-col items-start m-0 p-0">
                {Array.from(list).map((data, idx) => (
                    <div key={idx}>{data}</div>
                ))}
            </div>
    </div>
    );

    return (
        <div className="flex justify-center items-stretch gap-x-2 w-full px-4">
            {renderBox("Major Required List", 4, 27, state.need_complete)}
            {renderBox("Specialization Required List", 0,3, state.need_specilazation )}
            {renderBox("Specialization Elective List", 2,5, state.need_specilazation_elective )}
            {renderBox("Porject Required List", 1,3, state.need_project )}
            {renderBox("Ohter List", 0,20, state.need_others)}
        </div>
    )
}
