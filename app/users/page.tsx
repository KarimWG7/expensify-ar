import { getUsers } from "@/actions/users";
import { UsersPageClient } from "@/components/users/users-page";

export default async function UsersPage() {
  try {
    const users = await getUsers();
    return <UsersPageClient initialUsers={users || []} />;
  } catch (error: any) {
    if (error?.message === "Forbidden" || error?.message === "Unauthorized") {
      return (
        <div className="flex items-center justify-center h-[70vh]">
          <p className="text-xl text-muted-foreground">
            غير مصرح لك بالوصول إلى هذه الصفحة
          </p>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center h-[70vh]">
        <p className="text-xl text-destructive">حدث خطأ أثناء تحميل البيانات</p>
      </div>
    );
  }
}
