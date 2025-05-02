// import { Link } from 'react-router-dom';

// export const Sidebar = () => (
//     <nav className="sidebar">
//         <h5 className='logo-container'>
//             <Link className='home-btn' to="/UniFlow" >
//             UCI 
//             <span>Planner</span>
//             </Link>
//             <div className="zot-underline"></div>
//         </h5>
//         <ul className='link-container'>
//             {/* <li><Link to={"/UniFlow/main/dashboard"}>DashBoard</Link></li> */}
//             <li><Link to={"/UniFlow/main/progress"}>Classes Completed</Link></li>
//             {/* <li><Link to={"/UniFlow/main/preference"}>Class Preference</Link></li> */}
//             <li><Link to={"/UniFlow/main/nextplanner"}>Next Quarter Planner</Link></li>
//             {/* <li><Link to={"/main/alterfinder"}>Alternative Class Finder</Link></li> */}
//             <li><Link to={"/UniFlow/main/customplanner"}>Custom Planner</Link></li>
//             <li><Link to={"/UniFlow/main/entireplanner"}>Path Finder</Link></li>
//             <li><Link to={"/UniFlow/main/majortree"}>PREREQ TREE</Link></li>
//             <li><Link to={"/UniFlow/main/majorgraph"}>PREREQ Graph</Link></li>
//             <li><Link to={"/UniFlow/main/test"}>PREREQ TREE TEST</Link></li>
//             <li><Link to={"/UniFlow/main/result"}>Results</Link></li>
//         </ul>
//     </nav>
//   );
  

import { useState } from 'react';
import { Link } from 'react-router-dom';

// NOTE: THIS IS FOR ThE NEW SLIDING SIDEBAR
import { FaBars } from "react-icons/fa";
import { MdHome } from "react-icons/md"; // Example icon for the "UCI" logo
import { FaMoon, FaSun } from "react-icons/fa";




import { Calendar, Home, Inbox, Search, Settings } from "lucide-react"

import {
  Sidebar as SidebarUI,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"


// Menu items.
const items = [
  {
    title: "Home",
    url: "#",
    icon: Home,
  },
  {
    title: "Inbox",
    url: "#",
    icon: Inbox,
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
]

// Expanding seidebar
// export const Sidebar = () => {
//     const [isOpen, setIsOpen] = useState(true); // entire sidebar open vs. collapsed
//     const [isQuarterOpen, setIsQuarterOpen] = useState(false); // Quarter Planner dropdown
//     const [isPathOpen, setIsPathOpen] = useState(false);       // Path Finder dropdown
  
//     // entire sidebar
//     const toggleSidebar = () => {
//       setIsOpen((prev) => !prev);
//       setIsQuarterOpen(false);
//       setIsPathOpen(false);
//     };
  
//     // Toggle dropdown submenus
//     const toggleQuarterDropdown = () => setIsQuarterOpen((prev) => !prev);
//     const togglePathDropdown = () => setIsPathOpen((prev) => !prev);
  
//     return (
//       <nav className={`sidebar ${isOpen ? "open" : "collapsed"}`}>
//         <div className="sidebar-header">
//           <button className="burger-btn" onClick={toggleSidebar}>
//             <FaBars />
//           </button>
//           {isOpen && (
//             <h2 className="uci-title">
//               DEGREE<span>FLOW</span>
//             </h2>
//           )}
//         </div>
//         <ul className="nav-list">
//           <li>
//             <Link to="/UniFlow/main/progress">
//               {isOpen ? "Major Requirement" : <span className="icon-only">MR</span>}
//             </Link>
//           </li>
//           <li>
//             <Link to="/UniFlow/main/progress">
//               {isOpen ? "Major Progress" : <span className="icon-only">MP</span>}
//             </Link>
//           </li>
  
//           <li className="dropdown">
//             <div className="dropdown-parent" onClick={toggleQuarterDropdown}>
//               {isOpen ? (
//                 <>
//                   Quarter Planner{" "}
//                   <span className="arrow">{isQuarterOpen ? "▲" : "▼"}</span>
//                 </>
//               ) : (
//                 <span className="icon-only">QP</span>
//               )}
//             </div>
//             {isQuarterOpen && isOpen && (
//               <ul className="dropdown-list">
//                 <li>
//                   <Link to="/UniFlow/main/customplanner">Custom</Link>
//                 </li>
//                 <li>
//                   <Link to="/UniFlow/main/nextplanner">Auto</Link>
//                 </li>
//               </ul>
//             )}
//           </li>
  
//           {/* Path Finder with dropdown */}
//           <li className="dropdown">
//             <div className="dropdown-parent" onClick={togglePathDropdown}>
//               {isOpen ? (
//                 <>
//                   Path Finder{" "}
//                   <span className="arrow">{isPathOpen ? "▲" : "▼"}</span>
//                 </>
//               ) : (
//                 <span className="icon-only">PF</span>
//               )}
//             </div>
//             {isPathOpen && isOpen && (
//               <ul className="dropdown-list">
//                 <li>
//                   <Link to="/UniFlow/main/entireplanner">Auto Mode</Link>
//                 </li>
//                 <li>
//                   <Link to="/UniFlow/main/test">Manual Mode</Link>
//                 </li>
//               </ul>
//             )}
//           </li>
  
//           <li>
//             <Link to="/UniFlow/main/majortree">
//               {isOpen ? "PREREQ TREE" : <span className="icon-only">PT</span>}
//             </Link>
//           </li>
//           <li>
//             <Link to="/UniFlow/main/majorgraph">
//               {isOpen ? "PREREQ Graph" : <span className="icon-only">PG</span>}
//             </Link>
//           </li>
//           <li>
//             <Link to="/UniFlow/main/test">
//               {isOpen ? "PREREQ TREE TEST" : <span className="icon-only">PTT</span>}
//             </Link>
//           </li>
//           <li>
//             <Link to="/UniFlow/main/result">
//               {isOpen ? "Results" : <span className="icon-only">RS</span>}
//             </Link>
//           </li>
//         </ul>
//       </nav>
//     );
//   }




type SidebarProps = {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
};

export const Sidebar: React.FC<SidebarProps> = ({ darkMode, setDarkMode }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isQuarterOpen, setIsQuarterOpen] = useState(false);
  const [isPathOpen, setIsPathOpen] = useState(false);

  // entire sidebar
  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
    setIsQuarterOpen(false);
    setIsPathOpen(false);
  };

  // Toggle dropdown submenus
  const toggleQuarterDropdown = () => setIsQuarterOpen(!isQuarterOpen);
  const togglePathDropdown = () => setIsPathOpen(!isPathOpen);

  // Toggle dark mode
  const handleDarkModeChange = () => {
    setDarkMode(!darkMode);
  };

  // return (

  //   <nav className={`sidebar ${isOpen ? "open" : "collapsed"}`}>
  //     <div className="sidebar-header">
  //       <button className="burger-btn" onClick={toggleSidebar}>
  //         <FaBars />
  //       </button>
  //       {isOpen && (
  //         <h2 className="uci-title">
  //           DEGREE<span>FLOW</span>
  //         </h2>
  //       )}
  //     </div>

  //     <ul className="nav-list">
  //       <li>
  //         <Link to="/UniFlow/main/progress">
  //           {isOpen ? "Major Requirement" : <span className="icon-only">MR</span>}
  //         </Link>
  //       </li>
  //       <li>
  //         <Link to="/UniFlow/main/progress">
  //           {isOpen ? "Major Progress" : <span className="icon-only">MP</span>}
  //         </Link>
  //       </li>

  //       <li className="dropdown">
  //         <div className="dropdown-parent" onClick={toggleQuarterDropdown}>
  //           {isOpen ? (
  //             <>
  //               Quarter Planner <span className="arrow">{isQuarterOpen ? "▲" : "▼"}</span>
  //             </>
  //           ) : (
  //             <span className="icon-only">QP</span>
  //           )}
  //         </div>
  //         {isQuarterOpen && isOpen && (
  //           <ul className="dropdown-list">
  //             <li>
  //               <Link to="/UniFlow/main/customplanner">Custom</Link>
  //             </li>
  //             <li>
  //               <Link to="/UniFlow/main/nextplanner">Auto</Link>
  //             </li>
  //           </ul>
  //         )}
  //       </li>

  //       <li className="dropdown">
  //         <div className="dropdown-parent" onClick={togglePathDropdown}>
  //           {isOpen ? (
  //             <>
  //               Path Finder <span className="arrow">{isPathOpen ? "▲" : "▼"}</span>
  //             </>
  //           ) : (
  //             <span className="icon-only">PF</span>
  //           )}
  //         </div>
  //         {isPathOpen && isOpen && (
  //           <ul className="dropdown-list">
  //             <li>
  //               <Link to="/UniFlow/main/entireplanner">Auto Mode</Link>
  //             </li>
  //             <li>
  //               <Link to="/UniFlow/main/test">Manual Mode</Link>
  //             </li>
  //           </ul>
  //         )}
  //       </li>

  //       {/* <li>
  //         <Link to="/UniFlow/main/majortree">
  //           {isOpen ? "PREREQ TREE" : <span className="icon-only">PT</span>}
  //         </Link>
  //       </li>
  //       <li>
  //         <Link to="/UniFlow/main/majorgraph">
  //           {isOpen ? "PREREQ Graph" : <span className="icon-only">PG</span>}
  //         </Link>
  //       </li>
  //       <li>
  //         <Link to="/UniFlow/main/test">
  //           {isOpen ? "PREREQ TREE TEST" : <span className="icon-only">PTT</span>}
  //         </Link>
  //       </li>
  //       <li>
  //         <Link to="/UniFlow/main/result">
  //           {isOpen ? "Results" : <span className="icon-only">RS</span>}
  //         </Link>
  //       </li> */}
  //     </ul>

  //     <div className="sidebar-footer">
  //       <div className="toggle-container">
  //         <input
  //           type="checkbox"
  //           className="checkbox"
  //           id="dark-mode-checkbox"
  //           checked={darkMode}
  //           onChange={handleDarkModeChange}
  //         />
  //         <label htmlFor="dark-mode-checkbox" className="checkbox-label">
  //           {/* If you're using Font Awesome via react-icons, you can replace these <i> with <FaMoon /> / <FaSun /> */}
  //           <FaMoon />
  //           <FaSun />
  //           <span className="ball"></span>
  //         </label>
  //       </div>
  //     </div>
  //   </nav>
  // );
  return (
    <SidebarUI>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </SidebarUI>
  )
};