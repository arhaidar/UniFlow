// contexts/PathFinderContext.tsx
import React, { createContext, useContext, useState } from 'react';
// import { CourseData } from '../../../types'; // Adjust import path as needed

//this will be in types file
export interface CourseNode {
  value: string;
  children: string[];
  rank?: number;
}
export interface CourseData {
  [key: string]: CourseNode;
}
export interface GraduationOption {
  label: string;
  value: string;
};
//====================


type PathFinderState = {
  nextToTake: string[][];
  nextList: Set<string>;
  selected_tree1: string;
  selected_tree2: string;
  tree: CourseData | undefined;
  takenListForTree: string[];
  nextListForTree: string[];
  plannerStatus: boolean;
  userGraduationDate: GraduationOption[] | undefined;
};

type PathFinderContextType = PathFinderState & {
  setNextToTake: React.Dispatch<React.SetStateAction<string[][]>>;
  setNextList: React.Dispatch<React.SetStateAction<Set<string>>>;
  setSelected1: React.Dispatch<React.SetStateAction<string>>;
  setSelected2: React.Dispatch<React.SetStateAction<string>>;
  setTree: React.Dispatch<React.SetStateAction<CourseData | undefined>>;
  setTakenListForTree: React.Dispatch<React.SetStateAction<string[]>>;
  setNextListForTree: React.Dispatch<React.SetStateAction<string[]>>;
  setPlannerStatus: React.Dispatch<React.SetStateAction<boolean>>;
  setUserGraduationDate: React.Dispatch<React.SetStateAction<GraduationOption[]|undefined>>;
};

const PathFinderContext = createContext<PathFinderContextType | null>(null);

export const PathFinderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [nextToTake, setNextToTake] = useState<string[][]>([]);
  const [nextList, setNextList] = useState<Set<string>>(new Set());
  const [selected_tree1, setSelected1] = useState<string>("");
  const [selected_tree2, setSelected2] = useState<string>("");
  const [tree, setTree] = useState<CourseData | undefined>(undefined);
  const [takenListForTree, setTakenListForTree] = useState<string[]>([]);
  const [nextListForTree, setNextListForTree] = useState<string[]>([]);
  const [plannerStatus, setPlannerStatus] = useState<boolean>(false);
  const [userGraduationDate, setUserGraduationDate] = useState<GraduationOption[] | undefined>(undefined);

  return (
    <PathFinderContext.Provider value={{
      nextToTake,
      nextList,
      selected_tree1,
      selected_tree2,
      tree,
      takenListForTree,
      nextListForTree,
      plannerStatus,
      userGraduationDate,
      setNextToTake,
      setNextList,
      setSelected1,
      setSelected2,
      setTree,
      setTakenListForTree,
      setNextListForTree,
      setPlannerStatus,
      setUserGraduationDate,
    }}>
      {children}
    </PathFinderContext.Provider>
  );
};

export const usePathFinder = () => {
  const context = useContext(PathFinderContext);
  if (!context) {
    throw new Error('usePathFinder must be used within a PathFinderProvider');
  }
  return context;
};
