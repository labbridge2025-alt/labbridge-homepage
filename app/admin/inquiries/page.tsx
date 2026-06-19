"use client";

import { useEffect, useMemo, useState } from "react";
import {
  collection,
  getDocs,
  orderBy,
  query,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

type Inquiry = {
  id: string;
  company?: string;
  name?: string;
  phone?: string;
  email?: string;
  formula?: string;
  container?: string;
  packageType?: string;
  quantity?: string;
  budget?: string;
  dueDate?: string;
  country?: string;
  memo?: string;
  adminMemo?: string;
  status?: string;
  createdAt?: any;
  assignedTo?: string;
};

type Staff = {
  id: string;
  name?: string;
  email?: string;
};

const statuses = ["전체", "신규", "상담중", "견적발송", "계약완료"];

export default function AdminInquiriesPage() {
  const [items, setItems] = useState<Inquiry[]>([]);
  const [selected, setSelected] = useState<Inquiry | null>(null);
  const [statusFilter, setStatusFilter] = useState("전체");
  const [search, setSearch] = useState("");
  const [adminMemo, setAdminMemo] = useState("");
  const [staffs, setStaffs] = useState<Staff[]>([]);

  const loadInquiries = async () => {
    const q = query(collection(db, "inquiries"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Inquiry, "id">),
    }));

    setItems(data);
  };

  const loadStaffs = async () => {
    const snapshot = await getDocs(collection(db, "users"));

    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Staff, "id">),
    }));

    setStaffs(data);
  };

  useEffect(() => {
    loadInquiries();
    loadStaffs();
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const status = item.status || "신규";
      const matchStatus = statusFilter === "전체" || status === statusFilter;
      const keyword = search.toLowerCase();

      const matchSearch =
        !keyword ||
        item.company?.toLowerCase().includes(keyword) ||
        item.name?.toLowerCase().includes(keyword) ||
        item.email?.toLowerCase().includes(keyword) ||
        item.phone?.toLowerCase().includes(keyword);

      return matchStatus && matchSearch;
    });
  }, [items, statusFilter, search]);

  const openDetail = (item: Inquiry) => {
    setSelected(item);
    setAdminMemo(item.adminMemo || "");
  };

  const changeStatus = async (id: string, status: string) => {
    await updateDoc(doc(db, "inquiries", id), { status });
    await loadInquiries();

    if (selected?.id === id) {
      setSelected({ ...selected, status });
    }
  };

  const saveAdminMemo = async () => {
    if (!selected) return;

    await updateDoc(doc(db, "inquiries", selected.id), {
      adminMemo,
    });

    await loadInquiries();
    setSelected({ ...selected, adminMemo });

    alert("관리자 메모가 저장되었습니다.");
  };

  const assignStaff = async (inquiryId: string, staffName: string) => {
    await updateDoc(doc(db, "inquiries", inquiryId), {
      assignedTo: staffName,
    });

    await loadInquiries();

    if (selected) {
      setSelected({
        ...selected,
        assignedTo: staffName,
      });
    }
  };

  const deleteInquiry = async (id: string) => {
    const ok = confirm("정말 이 문의를 삭제할까요?");
    if (!ok) return;

    await deleteDoc(doc(db, "inquiries", id));

    if (selected?.id === id) {
      setSelected(null);
    }

    await loadInquiries();

    alert("삭제되었습니다.");
  };

  return (
    <main className="min-h-screen bg-[#f4f6f8] flex">
      <aside className="w-64 bg-[#0f172a] text-white p-6 hidden lg:flex flex-col">
        <h1 className="text-xl font-bold">LABBRIDGE</h1>
        <p className="text-xs text-gray-400 mb-10">ADMIN</p>

        <nav className="space-y-2 flex-1">
          {[
            ["대시보드", "/admin"],
            ["문의 관리", "/admin/inquiries"],
            ["가이드 배너", "/admin/guide"],
            ["포트폴리오", "/admin/portfolio"],
            ["팝업 관리", "/admin/popup"],
            ["상품 관리", "/admin/products"],
          ].map(([name, href]) => (
            <a
              key={name}
              href={href}
              className={`block px-4 py-3 rounded-xl text-sm font-semibold ${
                href === "/admin/inquiries"
                  ? "bg-blue-600"
                  : "text-gray-300 hover:bg-white/10"
              }`}
            >
              {name}
            </a>
          ))}
        </nav>

        <a
          href="/"
          className="border border-white/20 rounded-xl px-4 py-3 text-sm text-gray-300 hover:bg-white/10"
        >
          사이트 이동 →
        </a>
      </aside>

      <section className="flex-1 p-6 lg:p-10">
        <div className="bg-white rounded-2xl border p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">
            <div>
              <h2 className="text-3xl font-bold">문의 관리</h2>
              <p className="text-gray-500 mt-2">
                견적 문의 내역을 확인하고 상태와 메모를 관리합니다.
              </p>
            </div>

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="회사명, 담당자, 이메일, 연락처 검색"
              className="border rounded-xl px-4 py-3 w-full lg:w-[360px]"
            />
          </div>

          <div className="flex gap-3 mb-6 flex-wrap">
            {statuses.map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-5 py-3 rounded-xl text-sm font-bold border ${
                  statusFilter === status
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-600"
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[1300px]">
              <thead>
                <tr className="border-y bg-gray-50 text-gray-500">
                  <th className="py-4 px-3 text-left">접수일</th>
                  <th className="py-4 px-3 text-left">회사명</th>
                  <th className="py-4 px-3 text-left">담당자</th>
                  <th className="py-4 px-3 text-left">연락처</th>
                  <th className="py-4 px-3 text-left">상태</th>
                  <th className="py-4 px-3 text-left">담당 직원</th>
                  <th className="py-4 px-3 text-left">출고희망일</th>
                  <th className="py-4 px-3 text-left">제형</th>
                  <th className="py-4 px-3 text-left">용기</th>
                  <th className="py-4 px-3 text-left">생산수량</th>
                  <th className="py-4 px-3 text-left">예산</th>
                  <th className="py-4 px-3 text-left">판매국가</th>
                  <th className="py-4 px-3 text-left">관리자 메모</th>
                  <th className="py-4 px-3 text-left">관리</th>
                </tr>
              </thead>

              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-3">{formatDate(item.createdAt)}</td>
                    <td className="py-4 px-3 font-semibold">
                      {item.company || "-"}
                    </td>
                    <td className="py-4 px-3">{item.name || "-"}</td>
                    <td className="py-4 px-3">{item.phone || "-"}</td>
                    <td className="py-4 px-3">
                      <StatusBadge status={item.status || "신규"} />
                    </td>
                    <td className="py-4 px-3">{item.assignedTo || "-"}</td>
                    <td className="py-4 px-3">{item.dueDate || "-"}</td>
                    <td className="py-4 px-3">{item.formula || "-"}</td>
                    <td className="py-4 px-3">{item.container || "-"}</td>
                    <td className="py-4 px-3">{item.quantity || "-"}</td>
                    <td className="py-4 px-3">{item.budget || "-"}</td>
                    <td className="py-4 px-3">{item.country || "-"}</td>
                    <td className="py-4 px-3 max-w-[180px] truncate">
                      {item.adminMemo || "-"}
                    </td>
                    <td className="py-4 px-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openDetail(item)}
                          className="border px-4 py-2 rounded-lg font-semibold hover:bg-black hover:text-white"
                        >
                          보기
                        </button>

                        <button
                          onClick={() => deleteInquiry(item.id)}
                          className="border border-red-300 text-red-500 px-4 py-2 rounded-lg font-semibold hover:bg-red-50"
                        >
                          삭제
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredItems.length === 0 && (
              <div className="py-20 text-center text-gray-400">
                문의 내역이 없습니다.
              </div>
            )}
          </div>
        </div>
      </section>

      {selected && (
        <div className="fixed inset-0 bg-black/40 flex justify-end z-50">
          <div className="w-full max-w-2xl bg-white h-full p-8 overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold">문의 상세보기</h3>
              <button onClick={() => setSelected(null)} className="text-2xl">
                ×
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <Info label="회사명" value={selected.company} />
              <Info label="담당자" value={selected.name} />
              <Info label="연락처" value={selected.phone} />
              <Info label="이메일" value={selected.email} />
              <Info label="접수일" value={formatDate(selected.createdAt)} />
              <Info label="출고희망일" value={selected.dueDate} />
              <Info label="제형" value={selected.formula} />
              <Info label="용기" value={selected.container} />
              <Info label="패키지" value={selected.packageType} />
              <Info label="생산수량" value={selected.quantity} />
              <Info label="예산" value={selected.budget} />
              <Info label="판매국가" value={selected.country} />

              <div className="border-t pt-5">
                <p className="font-bold mb-2">고객 문의사항</p>
                <p className="text-gray-600 whitespace-pre-line">
                  {selected.memo || "-"}
                </p>
              </div>

              <div className="border-t pt-5">
                <p className="font-bold mb-3">담당 직원</p>

                <select
                  value={selected.assignedTo || ""}
                  onChange={(e) => assignStaff(selected.id, e.target.value)}
                  className="w-full border rounded-xl px-4 py-3"
                >
                  <option value="">담당자 선택</option>

                  {staffs.map((staff) => (
                    <option key={staff.id} value={staff.name || staff.email || ""}>
                      {staff.name || staff.email || "이름 없음"}
                    </option>
                  ))}
                </select>
              </div>

              <div className="border-t pt-5">
                <p className="font-bold mb-3">상태 변경</p>

                <select
                  value={selected.status || "신규"}
                  onChange={(e) => changeStatus(selected.id, e.target.value)}
                  className="w-full border rounded-xl px-4 py-3"
                >
                  <option>신규</option>
                  <option>상담중</option>
                  <option>견적발송</option>
                  <option>계약완료</option>
                </select>
              </div>

              <div className="border-t pt-5">
                <p className="font-bold mb-3">관리자 메모</p>

                <textarea
                  value={adminMemo}
                  onChange={(e) => setAdminMemo(e.target.value)}
                  placeholder="상담 내용, 견적 메모, 고객 특이사항 등을 남겨주세요."
                  className="w-full border rounded-xl px-4 py-3 h-36 resize-none"
                />

                <button
                  onClick={saveAdminMemo}
                  className="mt-3 w-full bg-black text-white py-4 rounded-xl font-bold"
                >
                  메모 저장
                </button>
              </div>

              <button
                onClick={() => deleteInquiry(selected.id)}
                className="w-full border border-red-300 text-red-500 py-4 rounded-xl font-bold hover:bg-red-50"
              >
                이 문의 삭제하기
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function Info({ label, value }: { label: string; value?: string }) {
  return (
    <div className="grid grid-cols-[110px_1fr] gap-4">
      <p className="font-bold text-gray-500">{label}</p>
      <p>{value || "-"}</p>
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