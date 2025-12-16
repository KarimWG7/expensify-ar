"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AddUserDialog } from "./add-user-dialog";

export function UsersHeader() {
  return (
    <div className="flex justify-between items-center">
      <h1 className="md:text-3xl font-bold">المستخدمين</h1>
      <AddUserDialog>
        <Button>
          <Plus className="h-4 w-4" />
          إضافة مستخدم
        </Button>
      </AddUserDialog>
    </div>
  );
}
