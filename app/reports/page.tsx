"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency } from "@/lib/utils";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">التقارير</h1>

      <Tabs defaultValue="averages" dir="rtl">
        <TabsList>
          <TabsTrigger value="averages">المتوسطات</TabsTrigger>
          <TabsTrigger value="detailed">تقارير مفصلة</TabsTrigger>
        </TabsList>

        <TabsContent value="averages" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>المتوسط الشهري</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(0)}</div>
                <p className="text-sm text-muted-foreground">متوسط المصروفات الشهرية خلال السنة</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>المتوسط الأسبوعي</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(0)}</div>
                <p className="text-sm text-muted-foreground">متوسط المصروفات الأسبوعية خلال الشهر</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="detailed">
          <Card>
            <CardHeader>
              <CardTitle>التقارير المفصلة</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">قريبًا: تقارير مفصلة حسب الفترة الزمنية والفئات</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
