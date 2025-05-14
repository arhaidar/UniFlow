
import { useCourseContext } from '@/mainpage';
import { Graduation } from './Graduation';
import { Turtorial } from './Tutorial';

export const StartPathFinder = () => {

    const { state } = useCourseContext();

  return (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="flex flex-col items-center gap-10 w-full max-w-4xl border border-gray-300 rounded-2xl p-6 shadow-md bg-white">
      <div className="w-full">
        <Turtorial />
      </div>
      <div className="w-full">
        <Graduation state={state} />
      </div>
  </div>
</div>
  );
};