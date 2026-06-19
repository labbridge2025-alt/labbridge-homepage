"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import AdminSidebar from "@/components/AdminSidebar";
import { useAdminUser } from "@/hooks/useAdminUser";

type Inquiry = {
  id: string;
  company?: string;
  name?: string;
  phone?: string;
  email?: string;
  formula?: string;
  memo?: string;
  status?: string;
  createdAt?: any;
};

export default function AdminPage() {
  const { adminUser, loading } = useAdminUser();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

  useEffect(() => {
    const loadInquiries = async () => {
      const q = query(
        collection(db, "inquiries"),
        orderBy("createdAt", "desc"),
        limit(5)
      );

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Inquiry, "id">),
      }));

      setInquiries(data);
    };

    loadInquiries();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        불러오는 중...
      </main>
    );
  }

  if (!adminUser) return null;

  return (
    <main className="min-h-screen bg-[#f4f6f8] flex">
      <AdminSidebar
  permissions={adminUser.permissions}
  role={adminUser.role}
/>

      <section className="flex-1 p-6 lg:p-10">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">대시보드</h2>
          <p className="text-sm text-gray-500">{adminUser.name} 님</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <DashboardBox
            title="최근 문의"
            value={`${inquiries.length}건`}
            desc="최근 등록된 문의"
          />
          <DashboardBox
            title="신규 문의"
            value={`${
              inquiries.filter((i) => !i.status || i.status === "신규").length
            }건`}
            desc="확인 필요"
          />
          <DashboardBox
            title="상담중"
            value={`${
              inquiries.filter((i) => i.status === "상담중").length
            }건`}
            desc="진행중인 문의"
          />
          <DashboardBox
            title="견적발송"
            value={`${
              inquiries.filter((i) => i.status === "견적발송").length
            }건`}
            desc="견적 발송 완료"
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_1fr] gap-6 mb-6">
          <AdminCard title="최근 문의 내역" href="/admin/inquiries">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-gray-500">
                  <th className="py-3 text-left">회사명</th>
                  <th className="py-3 text-left">담당자</th>
                  <th className="py-3 text-left">연락처</th>
                  <th className="py-3 text-left">문의 유형</th>
                  <th className="py-3 text-left">상태</th>
                  <th className="py-3 text-left">문의일</th>
                </tr>
              </thead>

              <tbody>
                {inquiries.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-400">
                      아직 문의 내역이 없습니다.
                    </td>
                  </tr>
                ) : (
                  inquiries.map((item) => (
                    <tr key={item.id} className="border-b last:border-0">
                      <td className="py-4">{item.company || "-"}</td>
                      <td className="py-4">{item.name || "-"}</td>
                      <td className="py-4">{item.phone || "-"}</td>
                      <td className="py-4">{item.formula || "제조 문의"}</td>
                      <td className="py-4">
                        <StatusBadge status={item.status || "신규"} />
                      </td>
                      <td className="py-4">{formatDate(item.createdAt)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </AdminCard>

          <AdminCard title="바로가기">
            <div className="grid grid-cols-2 gap-3">
              {[
                ["가이드 배너", "/admin/guide", "guide"],
                ["포트폴리오", "/admin/portfolio", "portfolio"],
                ["팝업 관리", "/admin/popup", "popup"],
                ["문의 내역", "/admin/inquiries", "inquiries"],
                ["상품 관리", "/admin/products", "products"],
                ["직원 관리", "/admin/users", "users"],
              ]
                .filter(([, , permission]) => {
                  return adminUser.permissions?.[permission as keyof typeof adminUser.permissions];
                })
                .map(([name, href]) => (
                  <a
                    key={name}
                    href={href}
                    className="border rounded-xl px-4 py-5 font-semibold hover:bg-black hover:text-white transition"
                  >
                    {name} →
                  </a>
                ))}
            </div>
          </AdminCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <AdminCard title="디자인 관리">
            {adminUser.permissions?.guide && (
              <ManageRow title="가이드 배너" desc="메인 슬라이드 관리" href="/admin/guide" />
            )}
            {adminUser.permissions?.popup && (
              <ManageRow title="팝업 관리" desc="팝업 이미지 및 링크" href="/admin/popup" />
            )}
            {adminUser.permissions?.portfolio && (
              <ManageRow title="포트폴리오" desc="브랜드 사례 등록" href="/admin/portfolio" />
            )}
          </AdminCard>

          <AdminCard title="콘텐츠 관리">
            {adminUser.permissions?.products && (
              <ManageRow title="상품 관리" desc="제형/제품 리스트" href="/admin/products" />
            )}
            <ManageRow title="게시판 관리" desc="공지사항/가이드" href="/admin/boards" />
            <ManageRow title="페이지 관리" desc="회사소개/진행절차" href="/admin/pages" />
          </AdminCard>

          <AdminCard title="고객 관리">
            {adminUser.permissions?.inquiries && (
              <ManageRow title="문의 관리" desc="견적 문의 확인" href="/admin/inquiries" />
            )}
            {adminUser.permissions?.users && (
              <ManageRow title="직원 관리" desc="직원 권한 설정" href="/admin/users" />
            )}
            <ManageRow title="내 정보" desc="비밀번호 변경" href="/admin/profile" />
          </AdminCard>
        </div>
      </section>
    </main>
  );
}

function DashboardBox({
  title,
  value,
  desc,
}: {
  title: string;
  value: string;
  desc: string;
}) {
  return (
    <div className="bg-white rounded-2xl border p-6">
      <p className="text-gray-500 text-sm font-semibold mb-3">{title}</p>
      <h3 className="text-3xl font-bold mb-2">{value}</h3>
      <p className="text-xs text-gray-400">{desc}</p>
    </div>
  );
}

function AdminCard({
  title,
  href,
  children,
}: {
  title: string;
  href?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border p-6">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-xl font-bold">{title}</h3>
        {href && (
          <a href={href} className="text-sm text-gray-500">
            더보기 →
          </a>
        )}
      </div>
      {children}
    </div>
  );
}

function ManageRow({
  title,
  desc,
  href,
}: {
  title: string;
  desc: string;
  href: string;
}) {
  return (
    <div className="flex justify-between items-center py-4 border-b last:border-0">
      <div>
        <p className="font-bold">{title}</p>
        <p className="text-sm text-gray-400">{desc}</p>
      </div>

      <a
        href={href}
        className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50"
      >
        관리
      </a>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const color =
    status === "신규"
      ? "bg-blue-50 text-blue-600 border-blue-200"
      : status === "상담중"
      ? "bg-green-50 text-green-600 border-green-200"
      : status === "견적발송"
      ? "bg-orange-50 text-orange-600 border-orange-200"
      : status === "계약완료"
      ? "bg-purple-50 text-purple-600 border-purple-200"
      : "bg-gray-50 text-gray-500 border-gray-200";

  return (
    <span
      className={`inline-block px-3 py-1 rounded-lg border text-xs font-bold ${color}`}
    >
      {status}
    </span>
  );
}

function formatDate(createdAt: any) {
  if (!createdAt) return "-";

  const date = createdAt.toDate ? createdAt.toDate() : new Date(createdAt);

  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}