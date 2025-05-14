// Updated pathFinderManual component
import { Section1 } from './section1';
import { Section2 } from './section2';

import { PathFinderProvider, usePathFinder } from './PathFinderContext';

//data update
import { useCourseContext,  } from '../../../mainpage';
import { useEffect, useState } from 'react';
import { progress_upadate } from '../../../utils/helper_common/progress_update';


import { Separator } from '@radix-ui/react-separator';
import { StartPathFinder } from './StartPathFinder';

export const PathFinderManual = () => {
    const { plannerStatus } = usePathFinder();
    const [loading, setLoading] = useState(false); // Adding loading state
    //data update
    const { state, dispatch } = useCourseContext();
    useEffect(() => {
        progress_upadate(dispatch,state)
        setLoading(false); // Set loading to false once data is updated
    }, []);

  return (

    <div className="h-screen">
      {plannerStatus ? (
        <div className='h-full flex flex-row'>
          <div className="w-[16%]">
            <Section2 />
          </div>
          <Separator className="my-4" />
          <div className="w-[84%]">
            <Section1 />
          </div>
        </div>
      ) : (
          <StartPathFinder />
      )}
      </div>
  );
};

export const PathFinderContainer = () => {
  return (
    <PathFinderProvider>
      <PathFinderManual />
    </PathFinderProvider>
  );
};


// <ResizablePanelGroup direction="horizontal" className="h-full">
//           <ResizablePanel defaultSize={25}>
//             <div className="h-full">
//               <Section2 />
//             </div>
//           </ResizablePanel>

//           <ResizableHandle withHandle />

//           <ResizablePanel defaultSize={75}>
//             <div className="h-full">
//               <Section1 />
//             </div>
//           </ResizablePanel>
//        </ResizablePanelGroup>