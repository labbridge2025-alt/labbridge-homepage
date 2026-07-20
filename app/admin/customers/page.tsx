"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { Search, X } from "lucide-react";
import { db } from "@/lib/firebase";

type FirestoreDate =
  | {
      seconds?: number;
    }
  | string
  | null
  | undefined;

type Member = {
  id: string;
  uid?: string;

  name?: string;
  phone?: string;
  email?: string;

  company?: string;
  position?: string;
  brand?: string;
  website?: string;

  role?: string;
  status?: string;
  verified?: boolean;

  createdAt?: FirestoreDate;
  updatedAt?: FirestoreDate;

  agreements?: {
    terms?: boolean;
    privacy?: boolean;
    matching?: boolean;
    noBypass?: boolean;
    age?: boolean;
    emailMarketing?: boolean;
    smsMarketing?: boolean;
    kakaoMarketing?: boolean;
  };
};

function getDateValue(value?: FirestoreDate) {
  if (!value) return 0;

  if (typeof value === "string") {
    const parsed = new Date(value).getTime();
    return Number.isNaN(parsed) ? 0 : parsed;
  }

  if (
    typeof value === "object" &&
    typeof value.seconds === "number"
  ) {
    return value.seconds * 1000;
  }

  return 0;
}

function formatDate(value?: FirestoreDate) {
  const time = getDateValue(value);

  if (!time) return "-";

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(time));
}

function formatPhone(phone?: string) {
  const number = String(phone || "").replace(/\D/g, "");

  if (number.length === 11) {
    return number.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
  }

  return phone || "-";
}

export default function AdminCustomersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  const fetchMembers = async () => {
    try {
      setLoading(true);

      const snapshot = await getDocs(collection(db, "members"));

      const memberList = snapshot.docs.map((memberDoc) => ({
        id: memberDoc.id,
        ...memberDoc.data(),
      })) as Member[];

      memberList.sort(
        (a, b) =>
          getDateValue(b.createdAt) - getDateValue(a.createdAt)
      );

      setMembers(memberList);
    } catch (error) {
      console.error("회원 불러오기 실패:", error);
      alert("회원정보를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const filteredMembers = useMemo(() => {
    const keyword = searchKeyword
      .trim()
      .toLowerCase();

    const phoneKeyword = searchKeyword.replace(/\D/g, "");

    if (!keyword) return members;

    return members.filter((member) => {
      const matchesText = [
        member.name,
        member.email,
        member.company,
        member.position,
        member.brand,
      ].some((value) =>
        String(value || "")
          .toLowerCase()
          .includes(keyword)
      );

      const matchesPhone =
        phoneKeyword.length > 0 &&
        String(member.phone || "")
          .replace(/\D/g, "")
          .includes(phoneKeyword);

      return matchesText || matchesPhone;
    });
  }, [members, searchKeyword]);

  return (
    <div className="min-h-screen bg-[#f7f8fa] p-8">
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-7 flex items-end justify-between gap-5">
          <div>
            <h1 className="text-3xl font-bold text-black">
              고객 관리
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              홈페이지에서 회원가입한 고객만 표시됩니다.
            </p>
          </div>

          <div className="relative w-[360px]">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={searchKeyword}
              onChange={(event) =>
                setSearchKeyword(event.target.value)
              }
              placeholder="이름, 연락처, 이메일 검색"
              className="h-12 w-full rounded-xl border border-gray-300 bg-white pl-11 pr-4 text-sm outline-none focus:border-black"
            />
          </div>
        </div>

        <div className="mb-5 grid grid-cols-3 gap-4">
          <SummaryCard
            label="전체 회원"
            value={members.length}
          />

          <SummaryCard
            label="검색 결과"
            value={filteredMembers.length}
          />

          <SummaryCard
            label="본인인증 완료"
            value={
              members.filter((member) => member.verified).length
            }
          />
        </div>

        <section className="overflow-hidden rounded-2xl border border-gray-300 bg-white">
          {loading ? (
            <div className="p-20 text-center text-gray-500">
              회원정보를 불러오는 중입니다.
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="p-20 text-center text-gray-500">
              가입한 회원이 없습니다.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] border-collapse">
                <thead>
                  <tr className="border-b border-gray-300 bg-gray-50">
                    <th className="px-5 py-4 text-left text-sm font-semibold">
                      가입일
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-semibold">
                      성함
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-semibold">
                      연락처
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-semibold">
                      이메일
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-semibold">
                      회사명
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-semibold">
                      인증
                    </th>

                    <th className="px-5 py-4 text-center text-sm font-semibold">
                      관리
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredMembers.map((member) => (
                    <tr
                      key={member.id}
                      className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50"
                    >
                      <td className="px-5 py-4 text-sm">
                        {formatDate(member.createdAt)}
                      </td>

                      <td className="px-5 py-4 text-sm font-semibold">
                        {member.name || "-"}
                      </td>

                      <td className="px-5 py-4 text-sm">
                        {formatPhone(member.phone)}
                      </td>

                      <td className="px-5 py-4 text-sm">
                        {member.email || "-"}
                      </td>

                      <td className="px-5 py-4 text-sm">
                        {member.company || "-"}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex whitespace-nowrap rounded-lg border px-3 py-1 text-xs font-medium ${
                            member.verified
                              ? "border-green-200 bg-green-50 text-green-600"
                              : "border-gray-200 bg-gray-100 text-gray-500"
                          }`}
                        >
                          {member.verified
                            ? "인증완료"
                            : "미인증"}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-center">
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedMember(member)
                          }
                          className="rounded-lg border border-black px-4 py-2 text-xs font-semibold hover:bg-black hover:text-white"
                        >
                          보기
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {selectedMember && (
        <div className="fixed inset-0 z-50 bg-black/30">
          <aside className="ml-auto h-full w-full max-w-[430px] overflow-y-auto bg-white p-7 shadow-2xl">
            <div className="mb-7 flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                고객 상세 정보
              </h2>

              <button
                type="button"
                onClick={() => setSelectedMember(null)}
                className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-gray-100"
              >
                <X size={22} />
              </button>
            </div>

            <div className="rounded-2xl border border-gray-300 p-5">
              <h3 className="mb-5 text-lg font-bold">
                회원가입 정보
              </h3>

              <div className="space-y-5">
                <InfoRow
                  label="성함"
                  value={selectedMember.name}
                />

                <InfoRow
                  label="연락처"
                  value={formatPhone(selectedMember.phone)}
                />

                <InfoRow
                  label="이메일"
                  value={selectedMember.email}
                />

                <InfoRow
                  label="회사명"
                  value={selectedMember.company}
                />

                <InfoRow
                  label="직책"
                  value={selectedMember.position}
                />

                <InfoRow
                  label="브랜드"
                  value={selectedMember.brand}
                />

                <InfoRow
                  label="홈페이지"
                  value={selectedMember.website}
                />

                <InfoRow
                  label="가입일"
                  value={formatDate(selectedMember.createdAt)}
                />

                <InfoRow
                  label="본인인증"
                  value={
                    selectedMember.verified
                      ? "인증완료"
                      : "미인증"
                  }
                />

                <InfoRow
                  label="회원상태"
                  value={selectedMember.status || "active"}
                />
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-gray-300 p-5">
              <h3 className="mb-5 text-lg font-bold">
                마케팅 수신 동의
              </h3>

              <div className="space-y-4">
                <InfoRow
                  label="이메일"
                  value={
                    selectedMember.agreements?.emailMarketing
                      ? "동의"
                      : "미동의"
                  }
                />

                <InfoRow
                  label="SMS"
                  value={
                    selectedMember.agreements?.smsMarketing
                      ? "동의"
                      : "미동의"
                  }
                />

                <InfoRow
                  label="카카오"
                  value={
                    selectedMember.agreements?.kakaoMarketing
                      ? "동의"
                      : "미동의"
                  }
                />
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-gray-300 bg-white p-5">
      <p className="text-sm text-gray-500">
        {label}
      </p>

      <strong className="mt-2 block text-3xl">
        {value.toLocaleString("ko-KR")}명
      </strong>
    </div>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value?: string;
}) {
  return (
    <div className="grid grid-cols-[90px_1fr] gap-4 text-sm">
      <span className="text-gray-500">
        {label}
      </span>

      <span className="break-all font-medium text-black">
        {value || "-"}
      </span>
    </div>
  );
}