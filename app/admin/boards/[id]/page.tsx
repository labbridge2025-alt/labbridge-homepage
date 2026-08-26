"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useRouter,
} from "next/navigation";

import {
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

import {
  db,
  storage,
} from "@/lib/firebase";

const categories = [
  "원료자료",
  "가이드라인",
  "트렌드자료",
  "공지사항",
  "FAQ",
  "기타",
];

type SlideInput = {
  imageUrl: string;
  imageFile: File | null;
  previewUrl: string;
  title: string;
  description: string;
};

const createEmptySlide =
  (): SlideInput => ({
    imageUrl: "",
    imageFile: null,
    previewUrl: "",
    title: "",
    description: "",
  });

export default function AdminBoardEditPage() {
  const router = useRouter();
  const params = useParams();

  const id = params.id as string;

  const [category, setCategory] =
    useState("원료자료");

  const [title, setTitle] =
    useState("");

  const [summary, setSummary] =
    useState("");

  const [keywords, setKeywords] =
    useState("");

  const [
    isPublished,
    setIsPublished,
  ] = useState(true);

  const [slides, setSlides] =
    useState<SlideInput[]>([]);

  const [
    existingFiles,
    setExistingFiles,
  ] = useState<any[]>([]);

  const [files, setFiles] =
    useState<File[]>([]);

  const [
    originalContent,
    setOriginalContent,
  ] = useState("");

  const [loading, setLoading] =
    useState(false);

  const [
    pageLoading,
    setPageLoading,
  ] = useState(true);

  /* ------------------------------
     기존 게시글 불러오기
  ------------------------------ */

  useEffect(() => {
    const loadBoard = async () => {
      if (!id) return;

      try {
        const snap = await getDoc(
          doc(db, "boards", id)
        );

        if (!snap.exists()) {
          alert(
            "게시글을 찾을 수 없습니다."
          );

          router.push(
            "/admin/boards"
          );

          return;
        }

        const data: any =
          snap.data();

        setCategory(
          data.category ||
            "원료자료"
        );

        setTitle(
          data.title || ""
        );

        setSummary(
          data.summary || ""
        );

        setKeywords(
          (data.keywords || []).join(
            ", "
          )
        );

        setIsPublished(
          data.isPublished ?? true
        );

        setExistingFiles(
          data.files || []
        );

        setOriginalContent(
          data.content || ""
        );

        /* 기존 slides가 있으면 불러오기 */

        if (
          Array.isArray(
            data.slides
          ) &&
          data.slides.length > 0
        ) {
          setSlides(
            data.slides.map(
              (slide: any) => ({
                imageUrl:
                  slide.imageUrl ||
                  "",
                imageFile: null,
                previewUrl:
                  slide.imageUrl ||
                  "",
                title:
                  slide.title || "",
                description:
                  slide.description ||
                  "",
              })
            )
          );
        } else {
          /*
            기존 에디터 방식 게시물은
            일단 빈 카드 1개 제공.
            기존 content는 삭제하지 않고
            그대로 보존한다.
          */

          setSlides([
            createEmptySlide(),
          ]);
        }
      } catch (error) {
        console.error(
          "게시글 불러오기 실패:",
          error
        );

        alert(
          "게시글을 불러오지 못했습니다."
        );
      } finally {
        setPageLoading(false);
      }
    };

    loadBoard();
  }, [id, router]);

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

  const removeSlide = (
    index: number
  ) => {
    if (slides.length === 1) {
      alert(
        "카드는 최소 1개가 필요합니다."
      );
      return;
    }

    setSlides((prev) =>
      prev.filter(
        (_, i) => i !== index
      )
    );
  };

  /* ------------------------------
     카드 수정
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
     이미지 변경
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
     기존 첨부 삭제
  ------------------------------ */

  const removeExistingFile = (
    index: number
  ) => {
    setExistingFiles((prev) =>
      prev.filter(
        (_, i) => i !== index
      )
    );
  };

  /* ------------------------------
     저장
  ------------------------------ */

  const handleSubmit = async () => {
    if (!title.trim()) {
      alert(
        "제목을 입력해주세요."
      );
      return;
    }

    if (!summary.trim()) {
      alert(
        "한줄 설명을 입력해주세요."
      );
      return;
    }

    const usableSlides =
      slides.filter(
        (slide) =>
          slide.imageUrl ||
          slide.imageFile
      );

    /*
      새 카드가 하나라도 작성됐다면
      제목까지 확인
    */

    for (const slide of usableSlides) {
      if (!slide.title.trim()) {
        alert(
          "각 카드의 제목을 입력해주세요."
        );
        return;
      }
    }

    setLoading(true);

    try {
      const uploadedSlides = [];

      for (
        let i = 0;
        i < usableSlides.length;
        i++
      ) {
        const slide =
          usableSlides[i];

        let imageUrl =
          slide.imageUrl;

        /* 새 이미지가 선택됐다면 업로드 */

        if (slide.imageFile) {
          const imageRef = ref(
            storage,
            `boards/slides/${Date.now()}-${i}-${slide.imageFile.name}`
          );

          await uploadBytes(
            imageRef,
            slide.imageFile
          );

          imageUrl =
            await getDownloadURL(
              imageRef
            );
        }

        uploadedSlides.push({
          imageUrl,
          title:
            slide.title.trim(),
          description:
            slide.description.trim(),
        });
      }

      /* 새 첨부파일 */

      const uploadedFiles = [];

      for (const file of files) {
        const fileRef = ref(
          storage,
          `boards/files/${Date.now()}-${file.name}`
        );

        await uploadBytes(
          fileRef,
          file
        );

        const url =
          await getDownloadURL(
            fileRef
          );

        uploadedFiles.push({
          name: file.name,
          url,
        });
      }

      /* Firestore 수정 */

      await updateDoc(
        doc(db, "boards", id),
        {
          category,

          title:
            title.trim(),

          summary:
            summary.trim(),

          slides:
            uploadedSlides,

          /*
            기존 HTML 본문은 보존.
            기존 게시물 호환용.
          */
          content:
            originalContent,

          keywords: keywords
            .split(",")
            .map((v) =>
              v.trim()
            )
            .filter(Boolean),

          isPublished,

          files: [
            ...existingFiles,
            ...uploadedFiles,
          ],

          updatedAt:
            serverTimestamp(),
        }
      );

      alert(
        "게시글이 수정되었습니다."
      );

      router.push(
        "/admin/boards"
      );
    } catch (error) {
      console.error(
        "게시글 수정 실패:",
        error
      );

      alert(
        "수정 중 오류가 발생했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="py-20 text-gray-400">
        게시글을 불러오는 중입니다.
      </div>
    );
  }

  return (
    <div>

      {/* 제목 */}

      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          게시글 수정
        </h1>

        <p className="mt-2 text-gray-500">
          이미지와 설명을 카드별로
          수정합니다.
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
                setCategory(
                  e.target.value
                )
              }
              className="w-full rounded-xl border border-gray-300 p-3"
            >
              {categories.map(
                (item) => (
                  <option key={item}>
                    {item}
                  </option>
                )
              )}
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
                setTitle(
                  e.target.value
                )
              }
              className="w-full rounded-xl border border-gray-300 p-3"
            />
          </div>

          {/* 요약 */}

          <div>
            <label className="mb-2 block font-semibold">
              한줄 설명 *
            </label>

            <input
              value={summary}
              onChange={(e) =>
                setSummary(
                  e.target.value
                )
              }
              className="w-full rounded-xl border border-gray-300 p-3"
            />
          </div>

          {/* 카드 */}

          <div className="border-t border-gray-200 pt-8">

            <div className="mb-6 flex items-center justify-between">

              <div>
                <h2 className="text-xl font-bold">
                  카드 콘텐츠
                </h2>

                <p className="mt-1 text-sm text-gray-400">
                  이미지와 오른쪽에
                  표시되는 설명을
                  수정합니다.
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

                    <div className="mb-5 flex items-center justify-between">

                      <h3 className="text-lg font-bold">
                        카드{" "}
                        {String(
                          index + 1
                        ).padStart(
                          2,
                          "0"
                        )}
                      </h3>

                      {slides.length >
                        1 && (
                        <button
                          type="button"
                          onClick={() =>
                            removeSlide(
                              index
                            )
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
                        이미지
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

                        {slide.previewUrl
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
                        카드 제목
                      </label>

                      <input
                        value={
                          slide.title
                        }
                        onChange={(e) =>
                          updateSlide(
                            index,
                            "title",
                            e.target.value
                          )
                        }
                        className="w-full rounded-xl border border-gray-300 p-3"
                      />

                    </div>

                    {/* 설명 */}

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

            {existingFiles.length >
              0 && (
              <div className="mb-3 space-y-2">

                {existingFiles.map(
                  (file, index) => (
                    <div
                      key={`${file.url}-${index}`}
                      className="flex items-center justify-between rounded-xl border px-4 py-3 text-sm"
                    >

                      <a
                        href={file.url}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline"
                      >
                        {file.name}
                      </a>

                      <button
                        type="button"
                        onClick={() =>
                          removeExistingFile(
                            index
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

          </div>

          {/* 키워드 */}

          <div>

            <label className="mb-2 block font-semibold">
              키워드
            </label>

            <input
              value={keywords}
              onChange={(e) =>
                setKeywords(
                  e.target.value
                )
              }
              className="w-full rounded-xl border border-gray-300 p-3"
            />

          </div>

          {/* 공개 */}

          <label className="flex items-center gap-2 font-semibold">

            <input
              type="checkbox"
              checked={
                isPublished
              }
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
              onClick={
                handleSubmit
              }
              disabled={loading}
              className="rounded-xl bg-black px-7 py-3 font-semibold text-white disabled:bg-gray-400"
            >
              {loading
                ? "수정 중..."
                : "수정하기"}
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