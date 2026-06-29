"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useParams } from "next/navigation";
import { db, storage } from "@/lib/firebase";

export default function ProductDetailAdminPage() {
  const params = useParams();
  const id = params.id as string;

  const [productImage, setProductImage] = useState("");
  const [productName, setProductName] = useState("");

  const [detailImages, setDetailImages] = useState<string[]>([]);
  const [detailDescription, setDetailDescription] = useState("");
  const [features, setFeatures] = useState("");
  const [mainIngredients, setMainIngredients] = useState("");
  const [howToUse, setHowToUse] = useState("");
  const [uploading, setUploading] = useState(false);

  const [availableFunctionalTypes, setAvailableFunctionalTypes] = useState<string[]>([]);
  const [conceptIngredientAvailable, setConceptIngredientAvailable] = useState(false);
  const [sampleAvailable, setSampleAvailable] = useState(true);

  const availableFunctionalOptions = [
    "미백",
    "주름개선",
    "자외선차단",
    "여드름성 피부 완화",
    "탈모 증상 완화",
  ];

  useEffect(() => {
    const load = async () => {
      const snap = await getDoc(doc(db, "products", id));

      if (snap.exists()) {
        const data: any = snap.data();

        setProductImage(data.image || "");
        setProductName(data.name || "");
        setDetailImages(data.detailImages || []);
        setDetailDescription(data.detailDescription || "");
        setFeatures(data.features || "");
        setMainIngredients(data.mainIngredients || "");
        setHowToUse(data.howToUse || "");
        setAvailableFunctionalTypes(data.availableFunctionalTypes || []);
        setConceptIngredientAvailable(data.conceptIngredientAvailable || false);
        setSampleAvailable(data.sampleAvailable ?? true);
      }
    };

    if (id) load();
  }, [id]);

  const uploadDetailImages = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      const uploadedUrls: string[] = [];

      for (const file of Array.from(files)) {
        const fileRef = ref(
          storage,
          `products/${id}/detail-images/${Date.now()}-${file.name}`
        );

        await uploadBytes(fileRef, file);
        const url = await getDownloadURL(fileRef);

        uploadedUrls.push(url);
      }

      setDetailImages((prev) => [...prev, ...uploadedUrls]);
    } catch (error) {
      console.error(error);
      alert("이미지 업로드 중 오류가 발생했습니다.");
    } finally {
      setUploading(false);
    }
  };

  const removeDetailImage = (index: number) => {
    setDetailImages((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleAvailableFunctionalType = (type: string) => {
    if (availableFunctionalTypes.includes(type)) {
      setAvailableFunctionalTypes(
        availableFunctionalTypes.filter((item) => item !== type)
      );
    } else {
      setAvailableFunctionalTypes([...availableFunctionalTypes, type]);
    }
  };

  const saveDetail = async () => {
    await updateDoc(doc(db, "products", id), {
      detailImages,
      detailDescription,
      features,
      mainIngredients,
      howToUse,
      availableFunctionalTypes,
      conceptIngredientAvailable,
      sampleAvailable,
      detailUpdatedAt: serverTimestamp(),
    });

    alert("상세정보가 저장되었습니다.");
  };

  return (
    <section className="p-6 lg:p-10">
      <div className="flex flex-col xl:flex-row xl:justify-between xl:items-center gap-5 mb-8">
        <div className="flex items-center gap-5">
          {productImage && (
            <img
              src={productImage}
              alt={productName}
              className="w-24 h-24 object-cover rounded-2xl border"
            />
          )}

          <div>
            <p className="text-gray-500 mb-2">상품 상세관리</p>

            <h1 className="text-4xl font-bold">
              {productName ? `${productName} 상세관리` : "상품 상세관리"}
            </h1>

            <p className="text-gray-500 mt-2">
              이 페이지는 선택한 상품 1개에만 적용됩니다.
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <a
            href={`/products/${id}`}
            target="_blank"
            className="border px-5 py-3 rounded-xl bg-white"
          >
            제품 페이지 보기
          </a>

          <a
            href="/admin/products"
            className="border px-5 py-3 rounded-xl bg-white"
          >
            목록으로
          </a>
        </div>
      </div>

      <div className="bg-white border rounded-2xl p-8 shadow-sm max-w-5xl">
        <label className="block font-bold mb-2">상세 이미지</label>

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => uploadDetailImages(e.target.files)}
          className="w-full border rounded-xl px-4 py-3 mb-4"
        />

        {uploading && (
          <p className="text-sm text-gray-500 mb-4">이미지 업로드 중...</p>
        )}

        {detailImages.length > 0 && (
          <div className="flex gap-3 flex-wrap mb-6">
            {detailImages.map((img, index) => (
              <div key={`${img}-${index}`} className="relative">
                <img
                  src={img}
                  alt={`상세 이미지 ${index + 1}`}
                  className="w-24 h-24 object-cover rounded-xl border"
                />

                <button
                  type="button"
                  onClick={() => removeDetailImage(index)}
                  className="absolute -right-2 -top-2 bg-black text-white rounded-full w-6 h-6 text-xs"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <label className="block font-bold mb-2">상세설명</label>
        <textarea
          value={detailDescription}
          onChange={(e) => setDetailDescription(e.target.value)}
          className="w-full border rounded-xl px-4 py-3 h-36 mb-6"
          placeholder="제품 상세 설명을 입력해주세요"
        />

        <label className="block font-bold mb-2">제품 특징</label>
        <textarea
          value={features}
          onChange={(e) => setFeatures(e.target.value)}
          className="w-full border rounded-xl px-4 py-3 h-28 mb-6"
          placeholder="예: 피지 흡착 / 딥클렌징 / 저자극"
        />

        <label className="block font-bold mb-2">주요 성분</label>
        <textarea
          value={mainIngredients}
          onChange={(e) => setMainIngredients(e.target.value)}
          className="w-full border rounded-xl px-4 py-3 h-28 mb-6"
          placeholder="예: 가지추출물, 카올린, 벤토나이트"
        />

        <label className="block font-bold mb-2">사용방법</label>
        <textarea
          value={howToUse}
          onChange={(e) => setHowToUse(e.target.value)}
          className="w-full border rounded-xl px-4 py-3 h-28 mb-6"
          placeholder="사용방법을 입력해주세요"
        />

        <label className="block font-bold mb-3">추가 가능한 기능성</label>
        <div className="flex flex-wrap gap-2 mb-8">
          {availableFunctionalOptions.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => toggleAvailableFunctionalType(type)}
              className={`px-4 py-2 rounded-lg border text-sm font-bold ${
                availableFunctionalTypes.includes(type)
                  ? "bg-black text-white"
                  : "bg-white text-gray-600"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <label className="block font-bold mb-3">컨셉 원료 추가 가능 여부</label>

        <div className="flex gap-3 mb-8">
          <button
            type="button"
            onClick={() => setConceptIngredientAvailable(true)}
            className={`px-5 py-2 rounded-lg border font-bold ${
              conceptIngredientAvailable
                ? "bg-black text-white"
                : "bg-white text-gray-600"
            }`}
          >
            가능
          </button>

          <button
            type="button"
            onClick={() => setConceptIngredientAvailable(false)}
            className={`px-5 py-2 rounded-lg border font-bold ${
              !conceptIngredientAvailable
                ? "bg-black text-white"
                : "bg-white text-gray-600"
            }`}
          >
            불가능
          </button>
        </div>

        <label className="flex items-center gap-2 font-bold mb-8">
          <input
            type="checkbox"
            checked={sampleAvailable}
            onChange={(e) => setSampleAvailable(e.target.checked)}
          />
          샘플 의뢰 가능
        </label>

        <button
          type="button"
          onClick={saveDetail}
          className="w-full bg-black text-white py-5 rounded-xl font-bold"
        >
          상세정보 저장
        </button>
      </div>
    </section>
  );
}