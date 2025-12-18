// components/reports/year-selector.tsx
"use client";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

export function YearSelector({
  value,
  onChange,
}: {
  value: number;
  onChange: (year: number) => void;
}) {
  const years = Array.from(
    { length: 6 },
    (_, i) => new Date().getFullYear() - i
  );

  return (
    <Select value={String(value)} onValueChange={(y) => onChange(Number(y))}>
      <SelectTrigger className="w-[140px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {years.map((y) => (
          <SelectItem key={y} value={String(y)}>
            {y}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
