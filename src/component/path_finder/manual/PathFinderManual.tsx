// Updated pathFinderManual component
import { Section1 } from './section1';
import { Section2 } from './section2';

import { PathFinderProvider } from './PathFinderContext';

//data update
import { useCourseContext } from '../../../mainpage';
import { useEffect } from 'react';
import { progress_upadate } from '../../../utils/helper_common/progress_update';

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

export const PathFinderManual = () => {
    
    //data update
    const { state, dispatch } = useCourseContext();
    useEffect(() => {
        progress_upadate(dispatch,state)
    }, []);

  return (
    <PathFinderProvider>
      <div className="h-screen">
      <PanelGroup direction="horizontal" className="h-full">
        <Panel defaultSize={70} minSize={20} className="p-2 bg-gray-50">
          <Section1 />
        </Panel>

        <PanelResizeHandle className="w-2 flex items-center justify-center group cursor-col-resize">
          <div className="w-1 h-20 bg-gray-300 rounded group-hover:bg-gray-500 transition-all duration-200" />
        </PanelResizeHandle>

        <Panel defaultSize={70} minSize={20} className="p-2 bg-gray-100">
          <Section2 />
        </Panel>
      </PanelGroup>
    </div>
    </PathFinderProvider>
  );
};
