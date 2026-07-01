"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useParams } from "next/navigation";
import { db } from "@/lib/firebase";

export default function ContainerDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [container, setContainer] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [recommendedProducts, setRecommendedProducts] = useState<any[]>([]);

  useEffect(() => {
    if (!id) return;

    const loadContainer = async () => {
      const snap = await getDoc(doc(db, "containers", id));

      if (snap.exists()) {
        const data: any = snap.data();

        setContainer({
          id: snap.id,
          ...data,
        });

        setSelectedImage(data.imageUrl || "");

        if (data.recommendProducts?.length > 0) {
          const productSnaps = await Promise.all(
            data.recommendProducts.map((productId: string) =>
              getDoc(doc(db, "products", productId))
            )
          );

          const products = productSnaps
            .filter((productSnap) => productSnap.exists())
            .map((productSnap) => ({
              id: productSnap.id,
              ...productSnap.data(),
            }));

          setRecommendedProducts(products);
        }
      }
    };

    loadContainer();
  }, [id]);

  if (!container) {
    return <main className="pt-32 text-center">불러오는 중...</main>;
  }

  const images = [container.imageUrl, ...(container.detailImages || [])].filter(
    Boolean
  );

  return (
    <main className="pt-28 lg:pt-40 pb-24 lg:pb-32">
      <section className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-[760px_520px] gap-12 items-start">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
            <div className="hidden lg:flex flex-col gap-4 w-24">
              {images.map((img: string, index: number) => (
                <button
                  key={`${img}-${index}`}
                  type="button"
                  onClick={() => setSelectedImage(img)}
                  className={`w-24 h-24 rounded-2xl overflow-hidden border ${
                    selectedImage === img ? "border-black" : "border-transparent"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            <div className="flex-1 max-w-[760px] bg-gray-100 rounded-3xl overflow-hidden">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt={container.name}
                  className="w-full aspect-square object-cover"
                />
              ) : (
                <div className="w-full aspect-square flex items-center justify-center text-gray-400">
                  이미지 없음
                </div>
              )}
            </div>

            <div className="flex lg:hidden gap-2 overflow-x-auto pt-2 pb-1 w-fit max-w-full">
              {images.map((img: string, index: number) => (
                <button
                  key={`${img}-${index}`}
                  type="button"
                  onClick={() => setSelectedImage(img)}
                  className={`shrink-0 w-14 h-14 rounded-xl overflow-hidden border ${
                    selectedImage === img ? "border-black" : "border-transparent"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm lg:text-lg text-gray-500 mb-3 lg:mb-4">
              {container.categoryName}
            </p>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-5 lg:mb-6 leading-tight">
              {container.name}
            </h1>

            {container.tags?.length > 0 && (
              <div className="flex gap-2 flex-wrap mb-6 lg:mb-8">
                {container.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 lg:py-2 rounded-full bg-gray-100 text-xs lg:text-sm"
                  >
                    {tag.startsWith("#") ? tag : `#${tag}`}
                  </span>
                ))}
              </div>
            )}

            <div className="border-t border-b py-6 lg:py-8 space-y-4 lg:space-y-5 text-base lg:text-xl">
              <div className="flex justify-between">
                <span className="text-gray-500">용량</span>
                <strong>{container.volume || "-"}</strong>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">MOQ</span>
                <strong>{container.moq || "-"}</strong>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">재질</span>
                <strong>{container.material || "-"}</strong>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">인쇄</span>
                <strong>{container.print || "-"}</strong>
              </div>
            </div>

            <div className="mt-8 lg:mt-10 grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
              <button
                type="button"
                onClick={() => {
                  const saved = localStorage.getItem("labbridge-wish");
                  const current: string[] = saved ? JSON.parse(saved) : [];

                  if (!current.includes(container.id)) {
                    const next = [...current, container.id];
                    localStorage.setItem("labbridge-wish", JSON.stringify(next));
                    alert("관심상품에 담겼습니다.");
                  } else {
                    alert("이미 관심상품에 담긴 항목입니다.");
                  }
                }}
                className="border rounded-2xl py-4 lg:py-5 font-bold"
              >
                관심상품 담기
              </button>

              <button
                type="button"
                onClick={() => {
                  const saved = localStorage.getItem("labbridge-wish");
                  const current: string[] = saved ? JSON.parse(saved) : [];
                  const next = current.includes(container.id)
                    ? current
                    : [...current, container.id];

                  localStorage.setItem("labbridge-wish", JSON.stringify(next));
                  window.location.href = "/estimate";
                }}
                className="bg-black text-white rounded-2xl py-4 lg:py-5 font-bold text-center"
              >
                문의하기
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 mt-16 lg:mt-24">
        <div className="border-t pt-10 lg:pt-16">
          {container.description && (
            <div className="mb-14 lg:mb-20">
              <h2 className="text-2xl lg:text-3xl font-bold mb-5 lg:mb-8">
                용기 설명
              </h2>

              <p className="text-sm lg:text-base text-gray-700 leading-loose whitespace-pre-wrap">
                {container.description}
              </p>
            </div>
          )}

          {recommendedProducts.length > 0 && (
            <div className="mb-14 lg:mb-20">
              <h2 className="text-2xl lg:text-3xl font-bold mb-5 lg:mb-8">
                추천 제형
              </h2>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {recommendedProducts.map((item) => (
                  <a
                    key={item.id}
                    href={`/products/${item.id}`}
                    className="border rounded-2xl overflow-hidden bg-white hover:shadow-xl transition block"
                  >
                    <div className="aspect-square bg-gray-100">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>

                    <div className="p-4">
                      <p className="text-xs text-gray-500 mb-1">
                        {item.category}
                      </p>
                      <h3 className="font-bold line-clamp-2">{item.name}</h3>
                      <p className="text-xs text-gray-500 mt-2">
                        MOQ {item.moq}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}