export default function ContactPage() {
  return (
    <main className="pt-40 px-20">
      <h1 className="text-8xl font-bold mb-20">
        CONTACT
      </h1>

      <form className="max-w-4xl space-y-8">
        <input
          className="w-full border p-6"
          placeholder="회사명"
        />

        <input
          className="w-full border p-6"
          placeholder="담당자명"
        />

        <input
          className="w-full border p-6"
          placeholder="연락처"
        />

        <textarea
          className="w-full border p-6 h-60"
          placeholder="문의내용"
        />

        <button className="bg-black text-white px-10 py-5">
          문의하기
        </button>
      </form>
    </main>
  );
}