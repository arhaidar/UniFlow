
// =============== Major component ===============
import { ComputerScienceBS } from '../../majorComponents/CS_components/progress'
import { BioscienceBS } from '../../majorComponents/BIO_components/progress'
import { MechanicalEngineeringBS } from '../../majorComponents/MEENG_components/progress'

import { Error404 } from '../../component/error/error404';
import React from 'react';

//NOTE!!:     const { state, dispatch } = useCourseContext(); 
//        ==> this one, 'useCourseContext' was outside :: not in side the <useCourseContext> </useCourseContext> in mainpage.tsx
export const getMajorComponents = (userMajor: string,dispatch: React.Dispatch<any>): React.ReactElement => {

  dispatch({ type: 'SET_MAJOR', payload: userMajor });

  switch (userMajor) {
    case "cs":
      return <ComputerScienceBS />;
    case "ae":
      return <BioscienceBS />;
    case "me":
      return <MechanicalEngineeringBS />;
    case "other majors...":
      return <ComputerScienceBS />; // Placeholder for other majors
    default:
      return <Error404 />;
  }
};
