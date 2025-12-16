// "use client";

// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import {
//   Table,
//   TableHeader,
//   TableRow,
//   TableHead,
//   TableBody,
//   TableCell,
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { useReportsStore } from "@/lib/store/reports-store";
// import { Spinner } from "@/components/ui/spinner";

// interface ExpensesTableProps {
//   expenses: any[];
//   loading?: boolean;
// }

// export function ExpensesTable({
//   expenses,
//   loading = false,
// }: ExpensesTableProps) {
//   const { page, setPage, pageSize, expenses: allExpenses } = useReportsStore();
//   const totalPages = Math.ceil(allExpenses.length / pageSize);

//   const paginatedExpenses = expenses.slice(
//     (page - 1) * pageSize,
//     page * pageSize
//   );

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>المصروفات</CardTitle>
//       </CardHeader>
//       <CardContent>
//         {loading ? (
//           <div className="flex justify-center p-4">
//             <Spinner />
//           </div>
//         ) : (
//           <>
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>التاريخ</TableHead>
//                   <TableHead>المبلغ</TableHead>
//                   <TableHead>الفئة</TableHead>
//                   <TableHead>ملاحظات</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {paginatedExpenses.length > 0 ? (
//                   paginatedExpenses.map((exp) => (
//                     <TableRow key={exp.id}>
//                       <TableCell>
//                         {new Date(exp.date).toLocaleDateString("ar")}
//                       </TableCell>
//                       <TableCell>{exp.amount}</TableCell>
//                       <TableCell>{exp.category?.name || "-"}</TableCell>
//                       <TableCell>{exp.notes || "-"}</TableCell>
//                     </TableRow>
//                   ))
//                 ) : (
//                   <TableRow>
//                     <TableCell colSpan={4} className="text-center">
//                       لا توجد مصروفات
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>

//             {/* Pagination */}
//             {totalPages > 1 && (
//               <div className="flex justify-end gap-2 mt-4">
//                 <Button
//                   disabled={page === 1}
//                   onClick={() => setPage(page - 1)}
//                   size="sm"
//                 >
//                   السابق
//                 </Button>
//                 <span className="flex items-center">
//                   {page} / {totalPages}
//                 </span>
//                 <Button
//                   disabled={page === totalPages}
//                   onClick={() => setPage(page + 1)}
//                   size="sm"
//                 >
//                   التالي
//                 </Button>
//               </div>
//             )}
//           </>
//         )}
//       </CardContent>
//     </Card>
//   );
// }

///////////////////////////////////////////////////////////////////////////

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

interface Props {
  expenses: any[];
  loading: boolean;
  pageSize?: number;
}

export default function ExpensesTable({
  expenses,
  loading,
  pageSize = 10,
}: Props) {
  const [page, setPage] = useState(1);

  const start = (page - 1) * pageSize;
  const end = page * pageSize;
  const paginated = expenses.slice(start, end);
  const totalPages = Math.ceil(expenses.length / pageSize);

  if (loading) return <Spinner className="mx-auto" />;

  return (
    <Card>
      <CardHeader>
        <CardTitle>تفاصيل المصروفات</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>التاريخ</TableHead>
              <TableHead>المبلغ</TableHead>
              <TableHead>الفئة</TableHead>
              <TableHead>ملاحظات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.map((exp) => (
              <TableRow key={exp.id}>
                <TableCell>{formatDate(exp.date)}</TableCell>
                <TableCell>{formatCurrency(exp.amount)}</TableCell>
                <TableCell>{exp.category_name || "-"}</TableCell>
                <TableCell>{exp.notes || "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-end gap-2 mt-2">
            <Button disabled={page === 1} onClick={() => setPage(page - 1)}>
              السابق
            </Button>
            <span className="flex items-center">
              {page} / {totalPages}
            </span>
            <Button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              التالي
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
