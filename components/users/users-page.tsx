"use client";

import { useUsersStore } from "@/lib/store/users-store";
import { UsersHeader } from "./users-header";
import { UsersTable } from "./users-table";

export function UsersPageClient({ usersResource }: { usersResource: any }) {
  const setUsers = useUsersStore((s) => s.setUsers);
  const users = usersResource.read(); // suspends if not ready

  setUsers(users);

  return (
    <div className="space-y-6 md:p-6">
      <UsersHeader />
      <UsersTable />
    </div>
  );
}
