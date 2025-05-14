import { useCourseContext } from '../../mainpage';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const DashBoard = () => {
  // const { state, dispatch } = useCourseContext();

  return (
    <div className="p-6 space-y-6">
      <header className="border-b pb-4">
        <h1 className="text-3xl font-semibold text-gray-800">Student Dashboard</h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground">School (Department)</div>
            <div className="text-lg font-medium">Donald Bren School of ICS</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground">Major</div>
            <div className="text-lg font-medium">Computer Science</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground">GPA</div>
            <div className="text-lg font-medium">3.5</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground">Credits Completed</div>
            <div className="text-lg font-medium">90</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground">Major Specialization</div>
            <div className="text-lg font-medium">Intelligence System</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 space-y-1">
            <div className="text-sm text-muted-foreground">Next Classes</div>
            <div className="text-base">COMPSCI 171</div>
            <div className="text-base">COMPSCI 116</div>
            <div className="text-base">COMPSCI 125</div>
            <div className="text-base">IN4MATX 113</div>
            <Button variant="link" className="px-0 text-blue-500">...see more</Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground">Current Quarter</div>
            <div className="text-lg font-medium">Winter 2025</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground">Yearly Course Availability</div>
            <Button variant="link" className="px-0 text-blue-500">Check details</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
