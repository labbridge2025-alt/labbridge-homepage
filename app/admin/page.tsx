const inquiries = [
  ["(주)스킨랩", "정은희", "010-1234-5678", "OEM문의", "신규", "2026-06-12"],
  ["더하애", "김민수", "010-2345-6789", "견적문의", "상담중", "2026-06-12"],
  ["몽뤼르", "박지영", "010-3456-7890", "ODM문의", "견적발송", "2026-06-11"],
  ["클린포엘", "이소연", "010-4567-8901", "OEM문의", "계약완료", "2026-06-11"],
];

const menus = [
  ["대시보드", "/admin"],
  ["문의 관리", "/admin/inquiries"],
  ["게시판 관리", "/admin/boards"],
  ["상세페이지 관리", "/admin/pages"],
  ["상품 관리", "/admin/products"],
  ["팝업 관리", "/admin/popup"],
  ["배너 관리", "/admin/banners"],
  ["포트폴리오 관리", "/admin/portfolio"],
  ["회원 관리", "/admin/users"],
  ["설정", "/admin/settings"],
];

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex">
      <aside className="w-72 bg-[#0f1b2d] text-white p-6 flex flex-col">
        <div className="mb-10">
          <h1 className="text-2xl font-bold">LABBRIDGE</h1>
          <p className="text-sm text-gray-400">ADMIN</p>
        </div>

        <nav className="space-y-2 flex-1">
          {menus.map(([name, href], index) => (
            <a
              key={name}
              href={href}
              className={`block px-5 py-4 rounded-xl text-sm font-semibold ${
                index === 0
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-white/10"
              }`}
            >
              {name}
            </a>
          ))}
        </nav>

        <a
          href="/"
          className="mt-8 border border-white/20 rounded-xl px-5 py-4 text-sm text-gray-300 hover:bg-white/10"
        >
          사이트 바로가기 →
        </a>
      </aside>

      <section className="flex-1 p-10">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-4xl font-bold">대시보드</h2>
          <div className="text-sm text-gray-500">정은희 님</div>
        </div>

        <div className="grid grid-cols-4 gap-6 mb-8">
          {[
            ["오늘 문의", "12건", "어제보다 3건 ↑"],
            ["이번달 문의", "37건", "지난달보다 8건 ↑"],
            ["진행중 견적", "7건", "전체 견적의 35%"],
            ["활성 팝업", "1개", "사용중"],
          ].map(([title, value, desc]) => (
            <div key={title} className="bg-white rounded-2xl border p-7 shadow-sm">
              <p className="text-gray-500 font-semibold mb-4">{title}</p>
              <h3 className="text-4xl font-bold mb-3">{value}</h3>
              <p className="text-sm text-gray-400">{desc}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-[1.4fr_1fr] gap-6 mb-8">
          <div className="bg-white rounded-2xl border p-7 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">최근 문의 내역</h3>
              <a href="/admin/inquiries" className="text-sm text-gray-500">
                더보기 →
              </a>
            </div>

            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-gray-500">
                  <th className="py-4 text-left">회사명</th>
                  <th className="py-4 text-left">담당자</th>
                  <th className="py-4 text-left">연락처</th>
                  <th className="py-4 text-left">문의 유형</th>
                  <th className="py-4 text-left">상태</th>
                  <th className="py-4 text-left">문의일</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.map((row) => (
                  <tr key={row[0]} className="border-b last:border-b-0">
                    {row.map((cell, idx) => (
                      <td key={idx} className="py-4">
                        {idx === 4 ? <StatusBadge status={cell} /> : cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-white rounded-2xl border p-7 shadow-sm">
            <h3 className="text-2xl font-bold mb-6">상품 관리 현황</h3>

            {[
              ["전체 상품", "28개"],
              ["스킨케어", "15개"],
              ["헤어", "6개"],
              ["바디", "5개"],
              ["색조", "2개"],
            ].map(([name, count]) => (
              <div
                key={name}
                className="flex justify-between items-center border-b last:border-b-0 py-4"
              >
                <div>
                  <p className="font-semibold">{name}</p>
                  <p className="text-sm text-gray-400">{count}</p>
                </div>
                <a
                  href="/admin/products"
                  className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50"
                >
                  관리하기
                </a>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-8">
          <AdminCard title="디자인 관리 현황">
            {[
              ["팝업 현황", "1개 사용중", "/admin/popup"],
              ["배너 현황", "3개 사용중", "/admin/banners"],
              ["포트폴리오 현황", "12개 등록됨", "/admin/portfolio"],
            ].map(([title, desc, href]) => (
              <div key={title} className="flex justify-between items-center py-4 border-b last:border-b-0">
                <div>
                  <p className="font-bold">{title}</p>
                  <p className="text-sm text-gray-400">{desc}</p>
                </div>
                <a href={href} className="px-4 py-2 border rounded-lg text-sm">
                  관리하기
                </a>
              </div>
            ))}
          </AdminCard>

          <AdminCard title="상세페이지 관리 현황">
            {["회사소개", "서비스 소개", "진행절차", "포트폴리오"].map((name) => (
              <div key={name} className="flex justify-between items-center py-4 border-b last:border-b-0">
                <div>
                  <p className="font-bold">{name}</p>
                  <p className="text-sm text-gray-400">수정일 2026-06-12</p>
                </div>
                <a href="/admin/pages" className="px-4 py-2 border rounded-lg text-sm">
                  관리하기
                </a>
              </div>
            ))}
          </AdminCard>

          <AdminCard title="게시판 문의 현황">
            {[
              ["OEM 견적 문의드립니다.", "답변대기"],
              ["샘플 제작 기간 문의", "답변완료"],
              ["MOQ 관련 문의드립니다.", "답변대기"],
              ["패키지 최소 수량 문의", "답변완료"],
            ].map(([title, status]) => (
              <div key={title} className="flex justify-between items-center py-4 border-b last:border-b-0">
                <p className="font-semibold">{title}</p>
                <StatusBadge status={status} />
              </div>
            ))}
          </AdminCard>
        </div>
      </section>
    </main>
  );
}

function AdminCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border p-7 shadow-sm">
      <h3 className="text-2xl font-bold mb-6">{title}</h3>
      {children}
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
      : status === "계약완료" || status === "답변완료"
      ? "bg-purple-50 text-purple-600 border-purple-200"
      : "bg-yellow-50 text-yellow-600 border-yellow-200";

  return (
    <span className={`inline-block px-3 py-1 rounded-lg border text-xs font-bold ${color}`}>
      {status}
    </span>
  );
}