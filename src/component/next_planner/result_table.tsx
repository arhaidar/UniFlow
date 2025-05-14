import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"

  // You can adjust this logic as needed
function getPriorityLabel(idx: number, total: number) {
    if (idx < total / 3) return "High";
    if (idx < (2 * total) / 3) return "Medium";
    return "Low";
  }
  
  export function ResultTable({ nextavilable }: { nextavilable: string[] }) {
    return (
      <Table className="caption-top border-2 ">
        <TableCaption className="text-xl font-semibold text-black mb-3  p-1 text-left">Possible Courses to Take</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Course</TableHead>
            <TableHead>Priority</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
        {nextavilable.map((course, idx) => (
          <TableRow key={course}>
            <TableCell>{course}</TableCell>
            <TableCell>
              <span
                className={
                  getPriorityLabel(idx, nextavilable.length) === "High"
                    ? "text-green-600 font-bold"
                    : getPriorityLabel(idx, nextavilable.length) === "Medium"
                    ? "text-yellow-600 font-semibold"
                    : "text-red-600"
                }
              >
                {getPriorityLabel(idx, nextavilable.length)}
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      </Table>
    );
  }