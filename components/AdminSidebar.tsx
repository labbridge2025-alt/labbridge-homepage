"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menus = [
  { name: "대시보드", href: "/admin" },
  { name: "문의 관리", href: "/admin/inquiries" },
  { name: "가이드 배너", href: "/admin/guide-banners" },
  { name: "포트폴리오", href: "/admin/portfolio" },
  { name: "팝업 관리", href: "/admin/popup" },
  { name: "상품 관리", href: "/admin/products" },
  { name: "게시판 관리", href: "/admin/boards" },
  { name: "직원 관리", href: "/admin/users" },
  {
  name: "용기 관리",
  href: "/admin/containers",
  permission: "products",
},
{
  name: "패키지 관리",
  href: "/admin/packages",
  permission: "products",
},
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-50 flex h-screen w-[250px] flex-col bg-[#0f172a] px-5 py-6 text-white">
      <div className="mb-12">
        <div className="text-2xl font-bold">LABBRIDGE</div>
        <div className="text-sm text-gray-300">ADMIN</div>
      </div>

      <nav className="flex flex-1 flex-col gap-2">
        {menus.map((menu) => {
          const active =
  menu.href === "/admin"
    ? pathname === "/admin"
    : pathname === menu.href || pathname.startsWith(menu.href + "/");

          return (
            <Link
              key={menu.href}
              href={menu.href}
              className={`rounded-xl px-4 py-3 font-semibold transition ${
                active
                  ? "bg-blue-600 text-white"
                  : "text-white hover:bg-white/10"
              }`}
            >
              {menu.name}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-2">
        <Link
          href="/admin/profile"
          className="block rounded-xl border border-white/20 px-4 py-3 text-sm"
        >
          내 정보 / 비밀번호 변경
        </Link>

        <button className="w-full rounded-xl border border-white/20 px-4 py-3 text-left text-sm">
          로그아웃
        </button>

        <Link
          href="/"
          className="block rounded-xl border border-white/20 px-4 py-3 text-sm"
        >
          사이트 이동 →
        </Link>
      </div>
    </aside>
  );
}