"use client";

import { useEffect } from "react";
import { useUsersStore } from "@/lib/store/users-store";
import { UsersHeader } from "./users-header";
import { UsersTable } from "./users-table";

export function UsersPageClient({ initialUsers }: { initialUsers: any[] }) {
  const setUsers = useUsersStore((s) => s.setUsers);

  useEffect(() => {
    setUsers(initialUsers);
  }, [initialUsers, setUsers]);

  return (
    <div className="space-y-6 md:p-6">
      <UsersHeader />
      <UsersTable />
    </div>
  );
}
