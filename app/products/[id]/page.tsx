"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useParams } from "next/navigation";
import { db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [product, setProduct] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
const [selectedImage, setSelectedImage] = useState("");
  useEffect(() => {
    if (!id) return;

    const loadProduct = async () => {
      const snap = await getDoc(doc(db, "products", id));

      if (snap.exists()) {
        const data: any = snap.data();

setProduct({
  id: snap.id,
  ...data,
});

setSelectedImage(data.image || "");
      }
    };

    loadProduct();
  }, [id]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });

    return () => unsubscribe();
  }, []);

  if (!product) {
    return <main className="pt-32 text-center">불러오는 중...</main>;
  }

  return (
    <main className="pt-28 lg:pt-40 pb-24 lg:pb-32">
      {/* 상단 */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-[760px_520px] gap-12 items-start">
          {/* 이미지 갤러리 */}
<div className="flex gap-4">
  <div className="flex flex-col gap-4 w-20 lg:w-24">
    {[product.image, ...(product.detailImages || [])].map(
      (img: string, index: number) => (
        <button
          key={`${img}-${index}`}
          type="button"
          onClick={() => setSelectedImage(img)}
          className={`w-20 h-20 lg:w-24 lg:h-24 rounded-2xl overflow-hidden border ${
            selectedImage === img ? "border-black" : "border-transparent"
          }`}
        >
          <img
            src={img}
            alt={`${product.name} 썸네일 ${index + 1}`}
            className="w-full h-full object-cover"
          />
        </button>
      )
    )}
  </div>

<div className="w-[600px] bg-gray-100 rounded-3xl overflow-hidden">
  <img
    src={selectedImage || product.image}
    alt={product.name}
    className="w-full aspect-square object-cover hover:scale-105 transition duration-300"
  />
</div>
</div>

          {/* 정보 */}
          <div>
            <p className="text-sm lg:text-lg text-gray-500 mb-3 lg:mb-4">
              {product.category}
            </p>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-5 lg:mb-6 leading-tight">
              {product.name}
            </h1>

            {product.tags?.length > 0 && (
              <div className="flex gap-2 flex-wrap mb-6 lg:mb-8">
                {product.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 lg:py-2 rounded-full bg-gray-100 text-xs lg:text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <div className="border-t border-b py-6 lg:py-8 space-y-4 lg:space-y-5 text-base lg:text-xl">
              <div className="flex justify-between">
                <span className="text-gray-500">MOQ</span>
                <strong>{product.moq}</strong>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">g당 단가</span>
                {isLoggedIn ? (
                  <strong>{product.unitPrice}원</strong>
                ) : (
                  <strong className="blur-sm select-none">
                    {product.unitPrice}원
                  </strong>
                )}
              </div>
            </div>

            {(product.availableFunctionalTypes?.length > 0 ||
              product.conceptIngredientAvailable !== undefined) && (
              <div className="mt-6 lg:mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
                <div className="border rounded-2xl p-4 lg:p-5 bg-gray-50">
                  <p className="font-bold mb-3 text-sm lg:text-base">
                    추가 가능한 기능성
                  </p>

                  {product.availableFunctionalTypes?.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {product.availableFunctionalTypes.map((type: string) => (
                        <span
                          key={type}
                          className="px-3 py-1 rounded-full bg-black text-white text-xs"
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">-</p>
                  )}
                </div>

                <div className="border rounded-2xl p-4 lg:p-5 bg-gray-50">
                  <p className="font-bold mb-3 text-sm lg:text-base">
                    컨셉 원료 추가
                  </p>

                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      product.conceptIngredientAvailable
                        ? "bg-black text-white"
                        : "bg-gray-300 text-gray-700"
                    }`}
                  >
                    {product.conceptIngredientAvailable ? "가능" : "불가능"}
                  </span>
                </div>
              </div>
            )}

            <div className="mt-8 lg:mt-10 grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
              <button
  type="button"
  onClick={() => {
    const saved = localStorage.getItem("labbridge-wish");
    const current: string[] = saved ? JSON.parse(saved) : [];

    if (!current.includes(product.id)) {
      const next = [...current, product.id];
      localStorage.setItem("labbridge-wish", JSON.stringify(next));
      alert("관심상품에 담겼습니다.");
    } else {
      alert("이미 관심상품에 담긴 제품입니다.");
    }
  }}
  className="border rounded-2xl py-4 lg:py-5 font-bold"
>
  관심상품 담기
</button>

              {product.sampleAvailable ? (
                <button
  type="button"
  onClick={() => {
    const saved = localStorage.getItem("labbridge-wish");
    const current: string[] = saved ? JSON.parse(saved) : [];

    const next = current.includes(product.id)
      ? current
      : [...current, product.id];

    localStorage.setItem("labbridge-wish", JSON.stringify(next));

    window.location.href = "/estimate";
  }}
  className="bg-black text-white rounded-2xl py-4 lg:py-5 font-bold text-center"
>
  샘플 의뢰하기
</button>
              ) : (
                <button
                  disabled
                  className="bg-gray-300 text-white rounded-2xl py-4 lg:py-5 font-bold"
                >
                  샘플 품절
                </button>
              )}
            </div>

            {!isLoggedIn && (
              <p className="mt-5 lg:mt-6 text-xs lg:text-sm text-gray-500 leading-relaxed">
                g당 단가는 회원 전용 정보입니다. 로그인 후 확인 가능합니다.
              </p>
            )}
          </div>
        </div>
      </section>



      {/* 하단 상세정보 */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 mt-16 lg:mt-24">
        <div className="border-t pt-10 lg:pt-16">
          {product.detailDescription && (
            <div className="mb-14 lg:mb-20">
              <h2 className="text-2xl lg:text-3xl font-bold mb-5 lg:mb-8">
                제품 설명
              </h2>

              <p className="text-sm lg:text-base text-gray-700 leading-loose whitespace-pre-wrap">
                {product.detailDescription}
              </p>
            </div>
          )}

          {product.features && (
            <div className="mb-14 lg:mb-20">
              <h2 className="text-2xl lg:text-3xl font-bold mb-5 lg:mb-8">
                제품 특징
              </h2>

              <p className="text-sm lg:text-base text-gray-700 leading-loose whitespace-pre-wrap">
                {product.features}
              </p>
            </div>
          )}

          {product.mainIngredients && (
            <div className="mb-14 lg:mb-20">
              <h2 className="text-2xl lg:text-3xl font-bold mb-5 lg:mb-8">
                주요 성분
              </h2>

              <p className="text-sm lg:text-base text-gray-700 leading-loose whitespace-pre-wrap">
                {product.mainIngredients}
              </p>
            </div>
          )}

          {product.howToUse && (
            <div className="mb-14 lg:mb-20">
              <h2 className="text-2xl lg:text-3xl font-bold mb-5 lg:mb-8">
                사용방법
              </h2>

              <p className="text-sm lg:text-base text-gray-700 leading-loose whitespace-pre-wrap">
                {product.howToUse}
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}