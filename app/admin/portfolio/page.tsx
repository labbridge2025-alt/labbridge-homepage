"use client";

export default function AdminProfilesPage() {
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
              className="block px-4 py-3 rounded-xl text-sm font-semibold text-gray-300 hover:bg-white/10"
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
        <h1 className="text-4xl font-bold mb-8">내 정보</h1>

        <div className="bg-white border rounded-2xl p-8">
          <p className="text-gray-500">내 정보 페이지 준비 중입니다.</p>
        </div>
      </section>
    </main>
  );
}