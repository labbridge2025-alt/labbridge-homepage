"use client";

import { useState } from "react";
import { updatePassword, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import AdminSidebar from "@/components/AdminSidebar";
import { useAdminUser } from "@/hooks/useAdminUser";

export default function AdminProfilePage() {
  const router = useRouter();
  const { adminUser, firebaseUser, loading } = useAdminUser();
  const [newPassword, setNewPassword] = useState("");

  const handleChangePassword = async () => {
    if (!firebaseUser) return;

    if (newPassword.length < 6) {
      alert("비밀번호는 6자리 이상 입력해주세요.");
      return;
    }

    try {
      await updatePassword(firebaseUser, newPassword);
      alert("비밀번호가 변경되었습니다.");
      setNewPassword("");
    } catch (error) {
      console.error(error);
      alert("오래 로그인된 상태라 다시 로그인 후 변경해야 할 수 있습니다.");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/admin-login");
  };

  if (loading) return <div>불러오는 중...</div>;
  if (!adminUser) return null;

  return (
    <main className="min-h-screen bg-[#f4f6f8] flex">
      <AdminSidebar permissions={adminUser.permissions} />

      <section className="flex-1 p-6 lg:p-10">
        <div className="max-w-2xl bg-white border rounded-2xl p-8">
          <h1 className="text-3xl font-bold mb-8">내 정보</h1>

          <div className="space-y-5 mb-10">
            <Info label="이름" value={adminUser.name} />
            <Info label="이메일" value={adminUser.email} />
            <Info
              label="권한"
              value={adminUser.role === "admin" ? "최고관리자" : "직원"}
            />
          </div>

          <div className="border-t pt-8">
            <h2 className="text-xl font-bold mb-4">비밀번호 변경</h2>

            <input
              type="password"
              placeholder="새 비밀번호"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border rounded-xl px-4 py-4 mb-4"
            />

            <button
              onClick={handleChangePassword}
              className="w-full bg-black text-white rounded-xl py-4 font-bold"
            >
              비밀번호 변경
            </button>
          </div>

          <button
            onClick={handleLogout}
            className="w-full mt-4 border rounded-xl py-4 font-bold"
          >
            로그아웃
          </button>
        </div>
      </section>
    </main>
  );
}

function Info({ label, value }: { label: string; value?: string }) {
  return (
    <div className="grid grid-cols-[100px_1fr] gap-4">
      <p className="font-bold text-gray-500">{label}</p>
      <p>{value || "-"}</p>
    </div>
  );
}