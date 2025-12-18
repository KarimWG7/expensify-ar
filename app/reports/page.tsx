import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AveragesTab from "@/components/reports/averages-tab";
import DetailedTab from "@/components/reports/detaild-report-tab";
import { YearlyExpensesTab } from "@/components/reports/yearly-expenses-tab";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">التقارير</h1>

      <Tabs defaultValue="averages" dir="rtl">
        <TabsList>
          <TabsTrigger value="averages">المتوسطات</TabsTrigger>
          <TabsTrigger value="detailed">تقارير مفصلة</TabsTrigger>
          <TabsTrigger value="print">طباعة تقرير سنوي</TabsTrigger>
        </TabsList>

        <TabsContent value="averages" className="space-y-4">
          <AveragesTab />
        </TabsContent>

        <TabsContent value="detailed">
          <DetailedTab />
        </TabsContent>
        <TabsContent value="print">
          <YearlyExpensesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
