import { Suspense } from "react";
import { fetchUsersResource } from "@/components/users/users-resource";
import { UsersTableSkeleton } from "@/components/users/users-list-skeleton";
import { UsersPageClient } from "@/components/users/users-page";

export default function UsersPage() {
  const usersResource = fetchUsersResource();

  return (
    <Suspense fallback={<UsersTableSkeleton />}>
      <UsersPageClient usersResource={usersResource} />
    </Suspense>
  );
}
