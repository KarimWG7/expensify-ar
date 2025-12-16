"use client";

import { useEffect, useState } from "react";
import { getDashboardData } from "@/actions/dashboard";
import { DashboardClient } from "@/components/dashboard/dashboard-client";
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    getDashboardData()
      .then(setData)
      .catch(() => setError(true));
  }, []);

  if (!data && !error) return <DashboardSkeleton />;
  if (error) return <div>خطأ في تحميل البيانات</div>;

  return <DashboardClient data={data} />;
}
