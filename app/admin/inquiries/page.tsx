
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
  fileName?: string;
  fileUrl?: string;
  filePath?: string;
};

type Staff = {
  id: string;
  name?: string;
  email?: string;
};

const statuses = [
  "전체",
  "신규",
  "상담중",
  "견적발송",
  "계약완료",
  "상담종료",
];

const editableStatuses = statuses.filter(
  (status) => status !== "전체"
);

export default function AdminInquiriesPage() {
  const [items, setItems] = useState<Inquiry[]>([]);
  const [selected, setSelected] = useState<Inquiry | null>(null);
  const [statusFilter, setStatusFilter] = useState("전체");
  const [search, setSearch] = useState("");
  const [adminMemo, setAdminMemo] = useState("");
  const [staffs, setStaffs] = useState<Staff[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadInquiries = async () => {
    const q = query(
      collection(db, "inquiries"),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);

    const data = snapshot.docs.map((snapshotDoc) => ({
      id: snapshotDoc.id,
      ...(snapshotDoc.data() as Omit<Inquiry, "id">),
    }));

    setItems(data);
  };

  const loadStaffs = async () => {
    const snapshot = await getDocs(collection(db, "users"));

    setStaffs(
      snapshot.docs.map((snapshotDoc) => ({
        id: snapshotDoc.id,
        ...(snapshotDoc.data() as Omit<Staff, "id">),
      }))
    );
  };

  useEffect(() => {
    const initialize = async () => {
      try {
        await Promise.all([loadInquiries(), loadStaffs()]);
      } catch (error) {
        console.error(error);
        alert("문의 목록을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  useEffect(() => {
    if (!selected) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelected(null);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [selected]);

  const filteredItems = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return items.filter((item) => {
      const status = item.status || "신규";

      const matchStatus =
        statusFilter === "전체" || status === statusFilter;

      const matchSearch =
        !keyword ||
        [
          item.company,
          item.name,
          item.email,
          item.phone,
        ].some((value) =>
          String(value || "").toLowerCase().includes(keyword)
        );

      return matchStatus && matchSearch;
    });
  }, [items, statusFilter, search]);

  const openDetail = (item: Inquiry) => {
    setSelected(item);
    setAdminMemo(item.adminMemo || "");
  };

  const closeDetail = () => {
    if (saving) return;

    if (
      selected &&
      adminMemo !== (selected.adminMemo || "") &&
      !window.confirm("저장하지 않은 메모가 있습니다. 닫을까요?")
    ) {
      return;
    }

    setSelected(null);
  };

  const changeStatus = async (id: string, status: string) => {
    if (saving) return;

    if (
      status === "상담종료" &&
      !window.confirm(
        "이 문의를 상담종료 처리할까요?\n문의 기록은 삭제되지 않습니다."
      )
    ) {
      return;
    }

    setSaving(true);

    try {
      await updateDoc(doc(db, "inquiries", id), { status });

      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status } : item
        )
      );

      setSelected((prev) =>
        prev?.id === id ? { ...prev, status } : prev
      );
    } catch (error) {
      console.error(error);
      alert("상태 변경에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const saveAdminMemo = async () => {
    if (!selected || saving) return;

    setSaving(true);

    try {
      await updateDoc(doc(db, "inquiries", selected.id), {
        adminMemo,
      });

      setItems((prev) =>
        prev.map((item) =>
          item.id === selected.id
            ? { ...item, adminMemo }
            : item
        )
      );

      setSelected((prev) =>
        prev ? { ...prev, adminMemo } : prev
      );

      alert("관리자 메모가 저장되었습니다.");
    } catch (error) {
      console.error(error);
      alert("메모 저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const assignStaff = async (
    inquiryId: string,
    staffName: string
  ) => {
    if (saving) return;

    setSaving(true);

    try {
      await updateDoc(doc(db, "inquiries", inquiryId), {
        assignedTo: staffName,
      });

      setItems((prev) =>
        prev.map((item) =>
          item.id === inquiryId
            ? { ...item, assignedTo: staffName }
            : item
        )
      );

      setSelected((prev) =>
        prev?.id === inquiryId
          ? { ...prev, assignedTo: staffName }
          : prev
      );
    } catch (error) {
      console.error(error);
      alert("담당 직원 변경에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const deleteInquiry = async (id: string) => {
    if (saving) return;

    const ok = window.confirm(
      "정말 이 문의를 삭제할까요?\n삭제된 문의는 복구할 수 없습니다."
    );

    if (!ok) return;

    setSaving(true);

    try {
      await deleteDoc(doc(db, "inquiries", id));

      setItems((prev) =>
        prev.filter((item) => item.id !== id)
      );

      if (selected?.id === id) {
        setSelected(null);
      }

      alert("삭제되었습니다.");
    } catch (error) {
      console.error(error);
      alert("문의 삭제에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <section className="min-w-0">
        <div className="bg-white rounded-2xl border p-4 sm:p-6 lg:p-8">
          {/* 상단 */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold">
                문의 관리
              </h2>
              <p className="text-gray-500 mt-2 text-sm sm:text-base">
                견적 문의 내역을 확인하고 상태와 메모를 관리합니다.
              </p>
            </div>

            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="회사명, 담당자, 이메일, 연락처 검색"
              className="border rounded-xl px-4 py-3 w-full lg:w-[360px] outline-none focus:border-black"
            />
          </div>

          {/* 상태 필터 */}
          <div className="flex gap-2 sm:gap-3 mb-6 overflow-x-auto pb-2">
            {statuses.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`shrink-0 px-4 sm:px-5 py-3 rounded-xl text-sm font-bold border ${
                  statusFilter === status
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-600 hover:border-black"
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <p className="text-sm text-gray-500 mb-4">
            총{" "}
            <span className="font-bold text-black">
              {filteredItems.length}
            </span>
            건의 문의
          </p>

          {loading ? (
            <div className="py-20 text-center text-gray-500">
              문의 내역을 불러오는 중입니다.
            </div>
          ) : (
            <>
              {/* PC 테이블 */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full min-w-[1450px] text-sm">
                  <thead>
                    <tr className="border-y bg-gray-50 text-gray-500">
                      {[
                        "접수일",
                        "회사명",
                        "담당자",
                        "연락처",
                        "상태",
                        "담당 직원",
                        "출고희망일",
                        "제형",
                        "용기",
                        "생산수량",
                        "예산",
                        "판매국가",
                        "관리자 메모",
                        "관리",
                      ].map((heading) => (
                        <th
                          key={heading}
                          className="py-4 px-3 text-left whitespace-nowrap"
                        >
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {filteredItems.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="py-4 px-3 whitespace-nowrap">
                          {formatDate(item.createdAt)}
                        </td>

                        <td className="py-4 px-3 font-semibold min-w-[110px]">
                          {item.company || "-"}
                        </td>

                        <td className="py-4 px-3">
                          {item.name || "-"}
                        </td>

                        <td className="py-4 px-3 whitespace-nowrap">
                          {item.phone || "-"}
                        </td>

                        <td className="py-4 px-3">
                          <StatusBadge
                            status={item.status || "신규"}
                          />
                        </td>

                        <td className="py-4 px-3">
                          {item.assignedTo || "-"}
                        </td>

                        <td className="py-4 px-3 whitespace-nowrap">
                          {item.dueDate || "-"}
                        </td>

                        <td className="py-4 px-3 max-w-[160px]">
                          <p className="line-clamp-2">
                            {item.formula || "-"}
                          </p>
                        </td>

                        <td className="py-4 px-3 max-w-[160px]">
                          <p className="line-clamp-2">
                            {item.container || "-"}
                          </p>
                        </td>

                        <td className="py-4 px-3 whitespace-nowrap">
                          {item.quantity || "-"}
                        </td>

                        <td className="py-4 px-3">
                          {item.budget || "-"}
                        </td>

                        <td className="py-4 px-3">
                          {item.country || "-"}
                        </td>

                        <td className="py-4 px-3 max-w-[180px]">
                          <p className="truncate max-w-[180px]">
                            {item.adminMemo || "-"}
                          </p>
                        </td>

                        <td className="py-4 px-3">
                          <div className="flex items-center gap-2 whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => openDetail(item)}
                              className="border px-4 py-2 rounded-lg font-semibold hover:bg-black hover:text-white"
                            >
                              상세보기
                            </button>

                            <button
                              type="button"
                              disabled={saving}
                              onClick={() => deleteInquiry(item.id)}
                              className="border border-red-300 text-red-500 px-4 py-2 rounded-lg font-semibold hover:bg-red-50 disabled:opacity-50"
                            >
                              삭제
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 모바일 카드 */}
              <div className="lg:hidden space-y-4">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="border rounded-2xl p-4 sm:p-5 bg-white"
                  >
                    <div className="flex justify-between items-start gap-3 mb-4">
                      <div className="min-w-0">
                        <h3 className="font-bold text-lg break-words">
                          {item.company || "회사명 없음"}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          접수일 {formatDate(item.createdAt)}
                        </p>
                      </div>

                      <StatusBadge
                        status={item.status || "신규"}
                      />
                    </div>

                    <div className="grid grid-cols-[85px_1fr] gap-y-2 gap-x-3 text-sm">
                      <span className="text-gray-500">담당자</span>
                      <span>{item.name || "-"}</span>

                      <span className="text-gray-500">연락처</span>
                      <span className="break-all">
                        {item.phone || "-"}
                      </span>

                      <span className="text-gray-500">담당 직원</span>
                      <span>{item.assignedTo || "-"}</span>

                      <span className="text-gray-500">제형</span>
                      <span className="break-words">
                        {item.formula || "-"}
                      </span>

                      <span className="text-gray-500">용기</span>
                      <span className="break-words">
                        {item.container || "-"}
                      </span>

                      <span className="text-gray-500">생산수량</span>
                      <span>{item.quantity || "-"}</span>

                      <span className="text-gray-500">출고희망일</span>
                      <span>{item.dueDate || "-"}</span>
                    </div>

                    <div className="flex gap-2 mt-5">
                      <button
                        type="button"
                        onClick={() => openDetail(item)}
                        className="flex-1 bg-black text-white py-3 rounded-xl font-bold text-sm"
                      >
                        상세보기
                      </button>

                      {item.status !== "상담종료" && (
                        <button
                          type="button"
                          disabled={saving}
                          onClick={() =>
                            changeStatus(item.id, "상담종료")
                          }
                          className="flex-1 border rounded-xl py-3 font-bold text-sm disabled:opacity-50"
                        >
                          상담종료
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {filteredItems.length === 0 && (
                <div className="py-20 text-center text-gray-400">
                  문의 내역이 없습니다.
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* 상세보기 패널 */}
      {selected && (
        <div
          className="fixed inset-0 z-[100] bg-black/50 flex justify-end"
          onClick={closeDetail}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="문의 상세보기"
            onClick={(e) => e.stopPropagation()}
            className="w-full sm:max-w-2xl bg-white h-full flex flex-col shadow-2xl"
          >
            {/* 고정 헤더 */}
            <div className="shrink-0 border-b px-5 sm:px-8 py-4 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <h3 className="text-xl sm:text-2xl font-bold">
                  문의 상세보기
                </h3>
                <p className="text-sm text-gray-500 mt-1 truncate">
                  {selected.company || "회사명 없음"}
                </p>
              </div>

              <button
                type="button"
                onClick={closeDetail}
                aria-label="닫기"
                className="shrink-0 w-10 h-10 border rounded-xl text-2xl hover:bg-gray-50"
              >
                ×
              </button>
            </div>

            {/* 스크롤 내용 */}
            <div className="flex-1 min-h-0 overflow-y-auto px-5 sm:px-8 py-6">
              <div className="space-y-5 text-sm">
                <div className="flex items-center justify-between">
                  <p className="font-bold">현재 상태</p>
                  <StatusBadge
                    status={selected.status || "신규"}
                  />
                </div>

                <div className="border rounded-2xl p-4 space-y-4">
                  <Info label="회사명" value={selected.company} />
                  <Info label="담당자" value={selected.name} />
                  <Info label="연락처" value={selected.phone} />
                  <Info label="이메일" value={selected.email} />
                  <Info
                    label="접수일"
                    value={formatDate(selected.createdAt)}
                  />
                  <Info
                    label="출고희망일"
                    value={selected.dueDate}
                  />
                  <Info label="제형" value={selected.formula} />
                  <Info label="용기" value={selected.container} />
                  <Info
                    label="패키지"
                    value={selected.packageType}
                  />
                  <Info
                    label="생산수량"
                    value={selected.quantity}
                  />
                  <Info label="예산" value={selected.budget} />
                  <Info
                    label="판매국가"
                    value={selected.country}
                  />
                </div>

                <div className="border-t pt-5">
                  <p className="font-bold mb-3">고객 문의사항</p>
                  <p className="text-gray-600 whitespace-pre-wrap break-words leading-relaxed">
                    {selected.memo || "-"}
                  </p>
                </div>

                {/* 첨부파일 */}
                <div className="border-t pt-5">
                  <p className="font-bold mb-3">첨부파일</p>

                  {selected.fileUrl ? (
                    <div className="space-y-4">
                      {selected.fileName &&
                        /\.(jpg|jpeg|png|gif|webp)$/i.test(
                          selected.fileName
                        ) && (
                          <div className="border rounded-xl bg-gray-50 p-3">
                            <img
                              src={selected.fileUrl}
                              alt={selected.fileName}
                              className="w-full max-h-[400px] object-contain rounded-lg"
                            />
                          </div>
                        )}

                      <div className="border rounded-xl p-4 space-y-3">
                        <p className="font-semibold break-all">
                          {selected.fileName || "첨부파일"}
                        </p>

                        <div className="flex flex-wrap gap-2">
                          <a
                            href={selected.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="border px-4 py-2 rounded-lg font-semibold"
                          >
                            파일 열기
                          </a>

                          <a
                            href={selected.fileUrl}
                            download={selected.fileName || true}
                            className="bg-black text-white px-4 py-2 rounded-lg font-semibold"
                          >
                            다운로드
                          </a>
                        </div>
                      </div>
                    </div>
                  ) : selected.fileName ? (
                    <div className="border rounded-xl p-4 bg-gray-50">
                      <p className="font-semibold break-all">
                        {selected.fileName}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        기존 문의는 파일명만 저장되어 있어
                        원본 파일을 확인할 수 없습니다.
                      </p>
                    </div>
                  ) : (
                    <p className="text-gray-400">
                      첨부된 파일이 없습니다.
                    </p>
                  )}
                </div>

                {/* 담당 직원 */}
                <div className="border-t pt-5">
                  <label
                    htmlFor="assigned-staff"
                    className="block font-bold mb-3"
                  >
                    담당 직원
                  </label>

                  <select
                    id="assigned-staff"
                    value={selected.assignedTo || ""}
                    disabled={saving}
                    onChange={(e) =>
                      assignStaff(selected.id, e.target.value)
                    }
                    className="w-full border rounded-xl px-4 py-3 bg-white disabled:opacity-50"
                  >
                    <option value="">담당자 선택</option>

                    {selected.assignedTo &&
                      !staffs.some(
                        (staff) =>
                          (staff.name || staff.email || "") ===
                          selected.assignedTo
                      ) && (
                        <option value={selected.assignedTo}>
                          {selected.assignedTo}
                        </option>
                      )}

                    {staffs.map((staff) => (
                      <option
                        key={staff.id}
                        value={staff.name || staff.email || ""}
                      >
                        {staff.name || staff.email || "이름 없음"}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 상태 변경 */}
                <div className="border-t pt-5">
                  <label
                    htmlFor="inquiry-status"
                    className="block font-bold mb-3"
                  >
                    상태 변경
                  </label>

                  <select
                    id="inquiry-status"
                    value={selected.status || "신규"}
                    disabled={saving}
                    onChange={(e) =>
                      changeStatus(selected.id, e.target.value)
                    }
                    className="w-full border rounded-xl px-4 py-3 bg-white disabled:opacity-50"
                  >
                    {editableStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 관리자 메모 */}
                <div className="border-t pt-5">
                  <label
                    htmlFor="admin-memo"
                    className="block font-bold mb-3"
                  >
                    관리자 메모
                  </label>

                  <textarea
                    id="admin-memo"
                    value={adminMemo}
                    onChange={(e) =>
                      setAdminMemo(e.target.value)
                    }
                    placeholder="상담 내용, 견적 메모, 고객 특이사항 등을 남겨주세요."
                    className="w-full border rounded-xl px-4 py-3 h-40 resize-y outline-none focus:border-black"
                  />
                </div>

                <button
                  type="button"
                  disabled={saving}
                  onClick={() => deleteInquiry(selected.id)}
                  className="w-full border border-red-300 text-red-500 py-4 rounded-xl font-bold hover:bg-red-50 disabled:opacity-50"
                >
                  이 문의 삭제하기
                </button>
              </div>
            </div>

            {/* 고정 하단 버튼 */}
            <div className="shrink-0 border-t bg-white px-5 sm:px-8 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <div className="flex gap-3">
                {selected.status !== "상담종료" && (
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() =>
                      changeStatus(selected.id, "상담종료")
                    }
                    className="flex-1 border border-gray-300 py-3.5 rounded-xl font-bold text-sm disabled:opacity-50"
                  >
                    상담종료
                  </button>
                )}

                <button
                  type="button"
                  disabled={saving}
                  onClick={saveAdminMemo}
                  className="flex-1 bg-black text-white py-3.5 rounded-xl font-bold text-sm disabled:opacity-50"
                >
                  {saving ? "처리 중..." : "메모 저장"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value?: string;
}) {
  return (
    <div className="grid grid-cols-[90px_minmax(0,1fr)] sm:grid-cols-[110px_minmax(0,1fr)] gap-3 sm:gap-4">
      <p className="font-bold text-gray-500">{label}</p>
      <p className="break-words">{value || "-"}</p>
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
      : status === "상담종료"
      ? "bg-gray-100 text-gray-600 border-gray-300"
      : "bg-gray-50 text-gray-500 border-gray-200";

  return (
    <span
      className={`inline-flex items-center whitespace-nowrap px-3 py-1 rounded-lg border text-xs font-bold ${color}`}
    >
      {status}
    </span>
  );
}

function formatDate(createdAt: any) {
  if (!createdAt) return "-";

  const date =
    typeof createdAt.toDate === "function"
      ? createdAt.toDate()
      : new Date(createdAt);

  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}
