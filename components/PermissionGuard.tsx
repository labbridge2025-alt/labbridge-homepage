"use client";

import { useAdminUser } from "@/hooks/useAdminUser";

type PermissionKey =
  | "inquiries"
  | "portfolio"
  | "products"
  | "popup"
  | "guide"
  | "users";

export default function PermissionGuard({
  permission,
  children,
}: {
  permission: PermissionKey;
  children: React.ReactNode;
}) {
  const { adminUser, loading } = useAdminUser();

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        불러오는 중...
      </main>
    );
  }

  if (!adminUser?.permissions?.[permission]) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#f4f6f8]">
        <div className="bg-white border rounded-2xl p-10 text-center">
          <h1 className="text-2xl font-bold mb-3">접근 권한이 없습니다</h1>
          <p className="text-gray-500">최고관리자에게 권한을 요청해주세요.</p>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}