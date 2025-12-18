"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { getYearlyExpensesReport } from "@/actions/reports";
import { Button } from "@/components/ui/button";
import { ExpensesPrintReport } from "./expenses-print-report";
import { YearSelector } from "./year-selector";
import { generatePDF } from "@/lib/generate-pdf";

export function YearlyExpensesTab() {
  const currentYear = new Date().getFullYear();

  const [year, setYear] = useState(currentYear);
  const [data, setData] = useState<any>(null);
  const [isPending, startTransition] = useTransition();
  const [isGenerating, setIsGenerating] = useState(false);

  const printRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    startTransition(async () => {
      const report = await getYearlyExpensesReport(year);
      setData(report);
    });
  }, [year]);

  if (!data) return null;

  const handleGeneratePdf = async () => {
    setIsGenerating(true);
    try {
      await generatePDF(printRef as React.RefObject<HTMLDivElement>, year);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <YearSelector value={year} onChange={setYear} />
        <Button onClick={handleGeneratePdf} disabled={isGenerating}>
          {isGenerating ? "جاري التحميل..." : "تحميل PDF"}
        </Button>
      </div>

      <ExpensesPrintReport ref={printRef} {...data} />
    </div>
  );
}
