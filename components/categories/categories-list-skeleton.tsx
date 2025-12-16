"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface CategoryListSkeletonProps {
  count?: number; // number of skeleton cards to show
}

export function CategoryListSkeleton({ count = 6 }: CategoryListSkeletonProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="flex items-center gap-2">
              <Skeleton className="h-6 w-6 rounded-full" /> {/* icon */}
              <Skeleton className="h-5 w-24" /> {/* category name */}
            </CardTitle>
            <div className="flex gap-1">
              <Skeleton className="h-8 w-8 rounded" /> {/* edit button */}
              <Skeleton className="h-8 w-8 rounded" /> {/* delete button */}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-10" />
              </div>
              <div className="flex justify-between text-sm">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-12" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
