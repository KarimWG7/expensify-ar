// "use client";

// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardDescription,
//   CardContent,
// } from "@/components/ui/card";
// import {
//   PieChart,
//   Pie,
//   Cell,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";

// interface PieChartCardProps {
//   data: any[];
// }

// export function PieChartCard({ data }: PieChartCardProps) {
//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>المصروفات حسب الفئة</CardTitle>
//         <CardDescription>نسبة المصروفات حسب الفلاتر</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <ResponsiveContainer width="100%" height={300}>
//           <PieChart>
//             <Pie
//               data={data}
//               cx="50%"
//               cy="50%"
//               labelLine={false}
//               label={(entry) => entry.name}
//               dataKey="value"
//             >
//               {data.map((entry, index) => (
//                 <Cell key={`cell-${index}`} fill={entry.color} />
//               ))}
//             </Pie>
//             <Tooltip />
//             <Legend />
//           </PieChart>
//         </ResponsiveContainer>
//       </CardContent>
//     </Card>
//   );
// }
//////////////////////////////////////////////////////////////////////////

"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

interface Props {
  categoryData: { name: string; value: number; color?: string }[];
}

export default function ExpensesPieChart({ categoryData }: Props) {
  if (!categoryData || categoryData.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>المصروفات حسب الفئة</CardTitle>
        <CardDescription>نسبة المصروفات حسب الفلاتر</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(entry) => entry.name}
              outerRadius={80}
              dataKey="value"
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color || "#8884d8"} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
