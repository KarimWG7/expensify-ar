import { getDashboardData } from "@/actions/dashboard";
import { DashboardClient } from "@/components/dashboard/dashboard-client";

export default async function DashboardPage() {
  try {
    const data = await getDashboardData();
    return <DashboardClient data={data} />;
  } catch (error) {
    return <div>خطأ في تحميل البيانات</div>;
  }
}
