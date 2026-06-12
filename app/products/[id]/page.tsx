"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useParams } from "next/navigation";
import { db } from "@/lib/firebase";

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    if (!id) return;

    const loadProduct = async () => {
      const snap = await getDoc(doc(db, "products", id));

      if (snap.exists()) {
        setProduct({
          id: snap.id,
          ...snap.data(),
        });
      }
    };

    loadProduct();
  }, [id]);

  if (!product) {
    return (
      <main className="pt-40 text-center">
        불러오는 중...
      </main>
    );
  }

  return (
    <main className="pt-40 pb-32">
      {/* 상단 */}
      <section className="max-w-7xl mx-auto px-10 grid grid-cols-2 gap-20">
        {/* 이미지 */}
        <div className="bg-gray-100 rounded-3xl overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-[620px] object-cover"
          />
        </div>

        {/* 정보 */}
        <div>
          <p className="text-lg text-gray-500 mb-4">
            {product.category}
          </p>

          <h1 className="text-5xl font-bold mb-6">
            {product.name}
          </h1>

          {/* 태그 */}
          {product.tags?.length > 0 && (
            <div className="flex gap-2 flex-wrap mb-8">
              {product.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-3 py-2 rounded-full bg-gray-100 text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* MOQ */}
          <div className="border-t border-b py-8 space-y-5 text-xl">
            <div className="flex justify-between">
              <span className="text-gray-500">
                MOQ
              </span>

              <strong>
                {product.moq}
              </strong>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">
                g당 단가
              </span>

              <strong className="blur-sm select-none">
                {product.unitPrice}원
              </strong>
            </div>
          </div>

          {/* 추가 가능 기능성 */}
          {(product.availableFunctionalTypes?.length > 0 ||
            product.conceptIngredientAvailable !== undefined) && (
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="border rounded-2xl p-5 bg-gray-50">
                <p className="font-bold mb-3">
                  추가 가능한 기능성
                </p>

                <div className="flex flex-wrap gap-2">
                  {product.availableFunctionalTypes?.map(
                    (type: string) => (
                      <span
                        key={type}
                        className="px-3 py-1 rounded-full bg-black text-white text-xs"
                      >
                        {type}
                      </span>
                    )
                  )}
                </div>
              </div>

              <div className="border rounded-2xl p-5 bg-gray-50">
                <p className="font-bold mb-3">
                  컨셉 원료 추가
                </p>

                <span
                  className={`px-3 py-1 rounded-full text-xs ${
                    product.conceptIngredientAvailable
                      ? "bg-black text-white"
                      : "bg-gray-300 text-gray-700"
                  }`}
                >
                  {product.conceptIngredientAvailable
                    ? "가능"
                    : "불가능"}
                </span>
              </div>
            </div>
          )}

          {/* 버튼 */}
          <div className="mt-10 flex gap-4">
            <button className="flex-1 border rounded-2xl py-5 font-bold">
              관심상품 담기
            </button>

            {product.sampleAvailable ? (
              <a
                href={`/estimate?product=${encodeURIComponent(
                  product.name
                )}`}
                className="flex-1 bg-black text-white rounded-2xl py-5 font-bold text-center"
              >
                샘플 의뢰하기
              </a>
            ) : (
              <button
                disabled
                className="flex-1 bg-gray-300 text-white rounded-2xl py-5 font-bold"
              >
                샘플 품절
              </button>
            )}
          </div>

          <p className="mt-6 text-sm text-gray-500">
            g당 단가는 회원 전용 정보입니다.
            로그인 후 확인 가능합니다.
          </p>
        </div>
      </section>

      {/* 하단 상세정보 */}
      <section className="max-w-7xl mx-auto px-10 mt-24">
        <div className="border-t pt-16">

          {product.detailDescription && (
            <div className="mb-20">
              <h2 className="text-3xl font-bold mb-8">
                제품 설명
              </h2>

              <p className="text-gray-700 leading-loose whitespace-pre-wrap">
                {product.detailDescription}
              </p>
            </div>
          )}

          {product.features && (
            <div className="mb-20">
              <h2 className="text-3xl font-bold mb-8">
                제품 특징
              </h2>

              <p className="text-gray-700 leading-loose whitespace-pre-wrap">
                {product.features}
              </p>
            </div>
          )}

          {product.mainIngredients && (
            <div className="mb-20">
              <h2 className="text-3xl font-bold mb-8">
                주요 성분
              </h2>

              <p className="text-gray-700 leading-loose whitespace-pre-wrap">
                {product.mainIngredients}
              </p>
            </div>
          )}

          {product.howToUse && (
            <div className="mb-20">
              <h2 className="text-3xl font-bold mb-8">
                사용방법
              </h2>

              <p className="text-gray-700 leading-loose whitespace-pre-wrap">
                {product.howToUse}
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}