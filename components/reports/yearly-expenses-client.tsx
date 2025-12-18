"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { generatePDF } from "@/lib/generate-pdf";
import { ExpensesPrintReport } from "./expenses-print-report";
import { YearSelector } from "./year-selector";

export function YearlyExpensesClient(props: any) {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const params = useSearchParams();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <YearSelector />
        <Button
          onClick={() =>
            generatePDF(ref as React.RefObject<HTMLDivElement>, props.year)
          }
        >
          تحميل PDF
        </Button>
      </div>

      {/* Visible */}
      <ExpensesPrintReport {...props} />

      {/* Hidden print copy */}
      <div className="fixed left-[-9999px] top-0">
        <div ref={ref}>
          <ExpensesPrintReport {...props} />
        </div>
      </div>
    </div>
  );
}
