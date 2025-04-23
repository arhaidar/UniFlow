
import { useCourseContext } from '@/mainpage';
import { Graduation } from './Graduation';
import { Turtorial } from './Tutorial';

export const StartPathFinder = () => {

    const { state } = useCourseContext();

  return (
  <div className="w-full h-full flex justify-center items-center">
    <div className="w-1/4 h-auto flex flex-col justify-center items-center"> {/* 25% width */}
      <Turtorial />
      <Graduation state={state} />
    </div>
  </div>
  );
};