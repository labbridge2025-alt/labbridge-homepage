"use client";

import { useState } from "react";

export default function AiBuilderPage() {
  const [product, setProduct] = useState("");
  const [concept, setConcept] = useState("");
  const [result, setResult] = useState(false);
const [imageUrl, setImageUrl] = useState("");
const [loading, setLoading] = useState(false);
const generateImage = async () => {
  setLoading(true);
  setResult(true);

  const res = await fetch("/api/ai-builder", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      product,
      concept,
    }),
  });

  const data = await res.json();

  if (data.success && data.imageUrl) {
  setImageUrl(data.imageUrl);
} else {
console.log("AI 응답:", data);
alert(data.error || "이미지 생성 실패");
}
  setLoading(false);
};
  return (
    <main className="min-h-screen bg-[#f8f6f2] pt-40 px-6">
      <div className="max-w-7xl mx-auto">

        <div className="mb-16">
          <p className="text-sm tracking-[0.3em] text-gray-500 font-semibold">
            LABBRIDGE AI PACKAGE
          </p>

          <h1 className="text-5xl font-bold mt-4 leading-tight">
            AI로 화장품 브랜드를
            <br />
            기획해보세요
          </h1>

          <p className="mt-6 text-gray-600 text-lg">
            제품과 컨셉만 입력하면 AI가 브랜드 컨셉을 제안합니다.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">

          <div className="bg-white rounded-3xl p-8 shadow-sm border">

            <h2 className="text-2xl font-bold mb-8">
              AI 패키지 만들기
            </h2>

            <div className="mb-6">
              <label className="font-semibold block mb-2">
                제품 선택
              </label>

              <select
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                className="w-full border rounded-xl p-4"
              >
                <option value="">선택해주세요</option>
                <option value="앰플">앰플</option>
                <option value="크림">크림</option>
                <option value="클렌징폼">클렌징폼</option>
                <option value="토너">토너</option>
                <option value="립제품">립제품</option>
              </select>
            </div>

            <div className="mb-8">
              <label className="font-semibold block mb-2">
                브랜드 컨셉
              </label>

              <textarea
                value={concept}
                onChange={(e) => setConcept(e.target.value)}
                placeholder="예) 비건, 프리미엄, 수분광, 블루컬러"
                className="w-full h-40 border rounded-xl p-4"
              />
            </div>

            <button
  onClick={generateImage}
              className="w-full bg-black text-white py-4 rounded-xl font-semibold"
            >
           {loading ? "이미지 생성중..." : "AI 생성하기"}
            </button>

          </div>

          <div className="bg-black text-white rounded-3xl p-8">

            <h2 className="text-2xl font-bold mb-8">
              생성 결과
            </h2>

            {!result ? (
              <p className="text-gray-400">
                왼쪽 정보를 입력하고 AI 생성 버튼을 눌러주세요.
              </p>
            ) : (
              <div className="space-y-8">
                {imageUrl && (
  <img
    src={imageUrl}
    alt="AI 패키지 이미지"
    className="mb-8 w-full rounded-3xl"
  />
)}
<div className="mb-8 flex justify-center">
  <div className="w-56 h-80 rounded-3xl bg-gradient-to-b from-blue-100 to-blue-500 p-6 flex flex-col justify-between shadow-2xl">
    <div className="text-black text-sm font-bold tracking-widest">
      LAIN
    </div>

    <div>
      <p className="text-black text-xs mb-2">HYALURON AMPOULE</p>
      <h3 className="text-black text-2xl font-bold leading-tight">
        Deep Ocean
        <br />
        Hydration
      </h3>
    </div>

    <div className="text-black text-xs">
      LABBRIDGE COSMETIC
    </div>
  </div>
</div>
                <div>
                  <p className="text-gray-400 text-sm">
                    브랜드명
                  </p>

                  <h3 className="text-4xl font-bold">
                    MARINA
                  </h3>
                </div>

                <div>
                  <p className="text-gray-400 text-sm">
                    제품명
                  </p>

                  <h3 className="text-2xl font-semibold">
                    {product} Deep Ocean Hydration
                  </h3>
                </div>

                <div>
                  <p className="text-gray-400 text-sm">
                    컨셉
                  </p>

                  <p>
                    {concept}
                  </p>
                </div>

                <div className="bg-white/10 rounded-2xl p-6">
                  심해 미네랄과 수분 에너지를
                  담은 프리미엄 스킨케어 컨셉
                </div>

                <a
                  href="/estimate"
                  className="inline-block bg-white text-black px-8 py-4 rounded-xl font-bold"
                >
                  이 컨셉으로 제조 문의하기
                </a>

              </div>
            )}

          </div>

        </div>

      </div>
    </main>
  );
}