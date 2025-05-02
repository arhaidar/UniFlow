import { Link } from 'react-router-dom';
import { FaMoon, FaSun } from "react-icons/fa";
import { 
  ChevronDown, 
  GraduationCap, 
  Calendar, 
  Route, 
  GitFork,
  Network,
  Settings,
  School
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"

type AppSidebarProps = {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
};

export const AppSidebar: React.FC<AppSidebarProps> = ({ darkMode, setDarkMode }) => {
  const handleDarkModeChange = () => {
    setDarkMode(!darkMode);
  };

  return (
    <Sidebar variant="floating">
      <SidebarHeader className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-2 p-4">
          <School className="h-6 w-6 text-yellow-400 shrink-0" />
          {/* <DegreeFlowLogo className="h-8 w-8 text-yellow-400" /> */}
          <div className="sidebar-expanded-only overflow-hidden">
            <h2 className="uci-title text-2xl font-bold truncate">
              DEGREE<span>FLOW</span>
            </h2>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/main/progress" className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    <span className="sidebar-expanded-only">Major Progress</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <Collapsible defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span className="sidebar-expanded-only">Quarter Planner</span>
                      </div>
                      <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180 sidebar-expanded-only" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuButton asChild>
                          <Link to="/main/nextplanner" className="flex items-center gap-2 pl-6">
                            <Calendar className="h-4 w-4" />
                            <span className="sidebar-expanded-only">Auto</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuButton asChild>
                          <Link to="/main/customplanner" className="flex items-center gap-2 pl-6">
                            <Calendar className="h-4 w-4" />
                            <span className="sidebar-expanded-only">Custom</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              <Collapsible defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span className="sidebar-expanded-only">Path Finder</span>
                      </div>
                      <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180 sidebar-expanded-only" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuButton asChild>
                          <Link to="/main/entireplanner" className="flex items-center gap-2 pl-6">
                            <Calendar className="h-4 w-4" />
                            <span className="sidebar-expanded-only">Manual</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuButton asChild>
                          <Link to="/main/test" className="flex items-center gap-2 pl-6">
                            <Calendar className="h-4 w-4" />
                            <span className="sidebar-expanded-only">Auto</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu> 
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="mt-auto border-t">
        <SidebarGroup>
          <SidebarGroupLabel className="sidebar-expanded-only">Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleDarkModeChange} className="flex items-center gap-2">
                  {darkMode ? <FaSun className="h-4 w-4" /> : <FaMoon className="h-4 w-4" />}
                  <span className="sidebar-expanded-only">{darkMode ? "Light Mode" : "Dark Mode"}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
}; 