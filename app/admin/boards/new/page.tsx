"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { db, storage } from "@/lib/firebase";

const categories = [
  "원료자료",
  "가이드라인",
  "트렌드자료",
  "공지사항",
  "FAQ",
  "기타",
];

type SlideInput = {
  imageFile: File | null;
  previewUrl: string;
  title: string;
  description: string;
};

const createEmptySlide = (): SlideInput => ({
  imageFile: null,
  previewUrl: "",
  title: "",
  description: "",
});

export default function AdminBoardNewPage() {
  const router = useRouter();

  const [category, setCategory] = useState("원료자료");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [keywords, setKeywords] = useState("");
  const [isPublished, setIsPublished] = useState(true);

  const [slides, setSlides] = useState<SlideInput[]>([
    createEmptySlide(),
  ]);

  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
const [thumbnailPreview, setThumbnailPreview] = useState("");

  /* ------------------------------
     카드 추가
  ------------------------------ */

  const addSlide = () => {
    setSlides((prev) => [
      ...prev,
      createEmptySlide(),
    ]);
  };

  /* ------------------------------
     카드 삭제
  ------------------------------ */

  const removeSlide = (index: number) => {
    if (slides.length === 1) {
      alert("카드는 최소 1개가 필요합니다.");
      return;
    }

    setSlides((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  /* ------------------------------
     카드 내용 수정
  ------------------------------ */

  const updateSlide = (
    index: number,
    field: keyof SlideInput,
    value: any
  ) => {
    setSlides((prev) =>
      prev.map((slide, i) =>
        i === index
          ? {
              ...slide,
              [field]: value,
            }
          : slide
      )
    );
  };

  /* ------------------------------
     이미지 선택
  ------------------------------ */

  const handleImageChange = (
    index: number,
    file: File
  ) => {
    const previewUrl =
      URL.createObjectURL(file);

    setSlides((prev) =>
      prev.map((slide, i) =>
        i === index
          ? {
              ...slide,
              imageFile: file,
              previewUrl,
            }
          : slide
      )
    );
  };

  /* ------------------------------
     저장
  ------------------------------ */

  const handleSubmit = async () => {
    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    if (!summary.trim()) {
      alert("한줄 설명을 입력해주세요.");
      return;
    }
if (!thumbnailFile) {
  alert("목록 대표 이미지를 등록해주세요.");
  return;
}
    const invalidSlide = slides.find(
      (slide) =>
        !slide.imageFile ||
        !slide.title.trim()
    );

    if (invalidSlide) {
      alert(
        "각 카드의 이미지와 카드 제목을 입력해주세요."
      );
      return;
    }

    setLoading(true);

    try {
      /* 카드 이미지 업로드 */
const thumbnailRef = ref(
  storage,
  `boards/thumbnails/${Date.now()}-${thumbnailFile.name}`
);

await uploadBytes(thumbnailRef, thumbnailFile);

const thumbnailUrl = await getDownloadURL(thumbnailRef);
      const uploadedSlides = [];

      for (let i = 0; i < slides.length; i++) {
        const slide = slides[i];

        if (!slide.imageFile) continue;

        const imageRef = ref(
          storage,
          `boards/slides/${Date.now()}-${i}-${slide.imageFile.name}`
        );

        await uploadBytes(
          imageRef,
          slide.imageFile
        );

        const imageUrl =
          await getDownloadURL(imageRef);

        uploadedSlides.push({
          imageUrl,
          title: slide.title.trim(),
          description:
            slide.description.trim(),
        });
      }

      /* 첨부파일 업로드 */

      const uploadedFiles = [];

      for (const file of files) {
        const fileRef = ref(
          storage,
          `boards/files/${Date.now()}-${file.name}`
        );

        await uploadBytes(fileRef, file);

        const url =
          await getDownloadURL(fileRef);

        uploadedFiles.push({
          name: file.name,
          url,
        });
      }

      /* Firestore 저장 */

await addDoc(
  collection(db, "boards"),
  {
    category,
    title: title.trim(),
    summary: summary.trim(),

    thumbnailUrl,

    slides: uploadedSlides,

    content: "",

          keywords: keywords
            .split(",")
            .map((v) => v.trim())
            .filter(Boolean),

          isPublished,

          files: uploadedFiles,

          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }
      );

      alert("게시글이 등록되었습니다.");

      router.push("/admin/boards");
    } catch (error) {
      console.error(
        "게시글 등록 실패:",
        error
      );

      alert(
        "게시글 등록 중 오류가 발생했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* 제목 */}

      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          게시글 등록
        </h1>

        <p className="mt-2 text-gray-500">
          이미지와 설명으로 구성된 콘텐츠를
          등록합니다.
        </p>
      </div>

      <div className="max-w-5xl rounded-2xl border border-black bg-white p-8">

        <div className="space-y-7">

          {/* 카테고리 */}

          <div>
            <label className="mb-2 block font-semibold">
              카테고리
            </label>

            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
              className="w-full rounded-xl border border-gray-300 p-3"
            >
              {categories.map((item) => (
                <option key={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* 제목 */}

          <div>
            <label className="mb-2 block font-semibold">
              제목 *
            </label>

            <input
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              placeholder="예: 브랜드명 상표등록 가이드"
              className="w-full rounded-xl border border-gray-300 p-3"
            />
          </div>

          {/* 한줄 설명 */}

          <div>
            <label className="mb-2 block font-semibold">
              한줄 설명 *
            </label>

            <input
              value={summary}
              onChange={(e) =>
                setSummary(e.target.value)
              }
              placeholder="예: 1분만에 끝내는 브랜드 상표등록 가이드"
              className="w-full rounded-xl border border-gray-300 p-3"
            />
          </div>
{/* 목록 대표 이미지 */}

<div>
  <label className="mb-2 block font-semibold">
    목록 대표 이미지 *
  </label>

  <p className="mb-4 text-sm leading-6 text-gray-400">
    LAB MEMBERS 게시물 목록에 노출되는 이미지입니다.
    <br />
    권장 사이즈: 1200 × 1500px (4:5 비율)
    <br />
    최소 800 × 1000px 이상을 권장합니다.
    <br />
    상세페이지 카드 이미지는 아래에서 별도로 등록해주세요.
  </p>

  {thumbnailPreview && (
    <div className="mb-4 w-full max-w-[320px] overflow-hidden rounded-xl bg-gray-100">
      <img
        src={thumbnailPreview}
        alt="대표 이미지 미리보기"
        className="aspect-[4/5] w-full object-cover"
      />
    </div>
  )}

  <label className="flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-gray-300 p-6 text-sm text-gray-500 hover:bg-gray-50">
    {thumbnailFile ? "대표 이미지 변경" : "+ 대표 이미지 선택"}

    <input
      type="file"
      accept="image/*"
      className="hidden"
      onChange={(e) => {
        const file = e.target.files?.[0];

        if (file) {
          setThumbnailFile(file);
          setThumbnailPreview(URL.createObjectURL(file));
        }
      }}
    />
  </label>
</div>
          {/* 카드뉴스 */}

          <div className="border-t border-gray-200 pt-8">

            <div className="mb-6 flex items-center justify-between">

              <div>
                <h2 className="text-xl font-bold">
                  카드 콘텐츠
                </h2>

                <p className="mt-1 text-sm text-gray-400">
                  이미지마다 오른쪽에 표시될
                  제목과 설명을 입력해주세요.
                </p>
              </div>

              <button
                type="button"
                onClick={addSlide}
                className="rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white"
              >
                + 카드 추가
              </button>

            </div>

            <div className="space-y-6">

              {slides.map(
                (slide, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-gray-300 p-6"
                  >

                    {/* 카드 헤더 */}

                    <div className="mb-5 flex items-center justify-between">

                      <h3 className="text-lg font-bold">
                        카드{" "}
                        {String(
                          index + 1
                        ).padStart(2, "0")}
                      </h3>

                      {slides.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            removeSlide(index)
                          }
                          className="text-sm text-red-500"
                        >
                          카드 삭제
                        </button>
                      )}

                    </div>

                    {/* 이미지 */}

                    <div className="mb-5">

                      <label className="mb-2 block text-sm font-semibold">
                        이미지 *
                      </label>

                      {slide.previewUrl && (
                        <div className="mb-4 overflow-hidden rounded-xl bg-gray-100">

                          <img
                            src={
                              slide.previewUrl
                            }
                            alt=""
                            className="mx-auto max-h-[450px] w-full object-contain"
                          />

                        </div>
                      )}

                      <label className="flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-gray-300 p-6 text-sm text-gray-500 hover:bg-gray-50">

                        {slide.imageFile
                          ? "이미지 변경"
                          : "+ 이미지 선택"}

                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file =
                              e.target
                                .files?.[0];

                            if (file) {
                              handleImageChange(
                                index,
                                file
                              );
                            }
                          }}
                        />

                      </label>

                    </div>

                    {/* 카드 제목 */}

                    <div className="mb-5">

                      <label className="mb-2 block text-sm font-semibold">
                        카드 제목 *
                      </label>

                      <input
                        value={slide.title}
                        onChange={(e) =>
                          updateSlide(
                            index,
                            "title",
                            e.target.value
                          )
                        }
                        placeholder="예: 브랜드명을 정했다면"
                        className="w-full rounded-xl border border-gray-300 p-3"
                      />

                    </div>

                    {/* 카드 설명 */}

                    <div>

                      <label className="mb-2 block text-sm font-semibold">
                        카드 설명
                      </label>

                      <textarea
                        value={
                          slide.description
                        }
                        onChange={(e) =>
                          updateSlide(
                            index,
                            "description",
                            e.target.value
                          )
                        }
                        rows={6}
                        placeholder={
                          "예: 가장 먼저 국내 상표가 이미 등록되어 있는지 확인해야 합니다.\n\n동일하거나 유사한 상표가 등록되어 있다면 추후 문제가 발생할 수 있습니다."
                        }
                        className="w-full resize-y rounded-xl border border-gray-300 p-4 leading-7"
                      />

                    </div>

                  </div>
                )
              )}

            </div>

          </div>

          {/* 첨부파일 */}

          <div className="border-t border-gray-200 pt-7">

            <label className="mb-3 block font-semibold">
              첨부 파일
            </label>

            <label className="flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-gray-300 p-6 text-gray-500 hover:bg-gray-50">

              + 파일 추가

              <input
                type="file"
                multiple
                className="hidden"
                onChange={(e) => {
                  const selected =
                    Array.from(
                      e.target.files || []
                    );

                  setFiles((prev) => [
                    ...prev,
                    ...selected,
                  ]);
                }}
              />

            </label>

            {files.length > 0 && (
              <div className="mt-3 space-y-2">

                {files.map(
                  (file, index) => (
                    <div
                      key={`${file.name}-${index}`}
                      className="flex items-center justify-between rounded-xl border px-4 py-3 text-sm"
                    >

                      <span>
                        {file.name}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          setFiles((prev) =>
                            prev.filter(
                              (_, i) =>
                                i !== index
                            )
                          )
                        }
                        className="text-red-500"
                      >
                        삭제
                      </button>

                    </div>
                  )
                )}

              </div>
            )}

          </div>

          {/* 키워드 */}

          <div>

            <label className="mb-2 block font-semibold">
              키워드
            </label>

            <input
              value={keywords}
              onChange={(e) =>
                setKeywords(e.target.value)
              }
              placeholder="예: 상표등록, 브랜드, 화장품제조"
              className="w-full rounded-xl border border-gray-300 p-3"
            />

          </div>

          {/* 공개 */}

          <label className="flex items-center gap-2 font-semibold">

            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) =>
                setIsPublished(
                  e.target.checked
                )
              }
            />

            공개

          </label>

          {/* 버튼 */}

          <div className="flex gap-3 border-t border-gray-200 pt-7">

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="rounded-xl bg-black px-7 py-3 font-semibold text-white disabled:bg-gray-400"
            >
              {loading
                ? "등록 중..."
                : "등록하기"}
            </button>

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/admin/boards"
                )
              }
              className="rounded-xl border border-black px-7 py-3 font-semibold"
            >
              취소
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}