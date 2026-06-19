"use client";

import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";

const menus = [
  { name: "대시보드", href: "/admin", permission: null },
  { name: "문의 관리", href: "/admin/inquiries", permission: "inquiries" },
  { name: "가이드 배너", href: "/admin/guide", permission: "guide" },
  { name: "포트폴리오", href: "/admin/portfolio", permission: "portfolio" },
  { name: "팝업 관리", href: "/admin/popup", permission: "popup" },
  { name: "상품 관리", href: "/admin/products", permission: "products" },
  { name: "직원 관리", href: "/admin/users", permission: "users" },
];

type Props = {
  permissions: any;
  role?: "admin" | "staff";
};

export default function AdminSidebar({ permissions, role }: Props) {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/admin-login");
  };

  return (
    <aside className="w-64 bg-[#0f172a] text-white p-6 hidden lg:flex flex-col">
      <div className="mb-10">
        <h1 className="text-2xl font-bold">LABBRIDGE</h1>
        <p className="text-sm text-gray-400">ADMIN</p>
      </div>

      <nav className="space-y-2 flex-1">
        {menus.map((menu) => {
          const isAdmin = role === "admin";

          if (menu.permission && !isAdmin && !permissions?.[menu.permission]) {
            return null;
          }

          return (
            <a
              key={menu.href}
              href={menu.href}
              className="block px-5 py-4 rounded-xl text-sm font-semibold text-gray-300 hover:bg-white/10"
            >
              {menu.name}
            </a>
          );
        })}
      </nav>

      <div className="space-y-2 mt-6">
        <a
          href="/admin/profile"
          className="block border border-white/20 rounded-xl px-5 py-4 text-sm text-gray-300 hover:bg-white/10"
        >
          내 정보 / 비밀번호 변경
        </a>

        <button
          onClick={handleLogout}
          className="w-full text-left border border-white/20 rounded-xl px-5 py-4 text-sm text-gray-300 hover:bg-white/10"
        >
          로그아웃
        </button>

        <a
          href="/"
          className="block border border-white/20 rounded-xl px-5 py-4 text-sm text-gray-300 hover:bg-white/10"
        >
          사이트 이동 →
        </a>
      </div>
    </aside>
  );
}