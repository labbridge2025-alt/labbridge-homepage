export default function ProductsPage() {
  return (
    <main className="pt-40 px-20">
      <h1 className="text-8xl font-bold mb-20">
        SERVICE
      </h1>

      <div className="grid grid-cols-3 gap-10">
        <div className="border p-10">제형</div>
        <div className="border p-10">용기</div>
        <div className="border p-10">부자재</div>
        <div className="border p-10">원료</div>
        <div className="border p-10">임상</div>
        <div className="border p-10">인허가</div>
      </div>
    </main>
  );
}