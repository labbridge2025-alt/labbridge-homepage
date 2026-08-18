"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

type Slide = {
  imageUrl: string;
  text: string[];
};

export default function BoardDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [board, setBoard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const touchStartX = useRef<number | null>(null);

  /* --------------------------------
     게시글 불러오기
  -------------------------------- */

  useEffect(() => {
    const loadBoard = async () => {
      try {
        const snap = await getDoc(
          doc(db, "boards", id)
        );

        if (!snap.exists()) {
          setLoading(false);
          return;
        }

        setBoard({
          id: snap.id,
          ...snap.data(),
        });
      } catch (error) {
        console.error(
          "게시글 불러오기 실패:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadBoard();
    }
  }, [id]);

  /* --------------------------------
     기존 본문 HTML에서
     이미지 + 설명 자동 분리
  -------------------------------- */

  const parsedSlides = useMemo(() => {
  if (
    !board?.content ||
    typeof window === "undefined"
  ) {
    return [];
  }

  const parser = new DOMParser();

  const html = parser.parseFromString(
    board.content,
    "text/html"
  );

  const elements = Array.from(
    html.body.querySelectorAll(
      "img, h1, h2, h3, h4, p, li, blockquote"
    )
  );

  const slides: Slide[] = [];
  let pendingText: string[] = [];
  let currentSlide: Slide | null = null;

  elements.forEach((element) => {
    const tag = element.tagName.toLowerCase();

    if (tag === "img") {
      const image = element as HTMLImageElement;

      if (currentSlide) {
        slides.push(currentSlide);
      }

      currentSlide = {
        imageUrl: image.src,
        text: [...pendingText],
      };

      pendingText = [];
      return;
    }

    const text = element.textContent?.trim();

    if (!text) return;

    if (currentSlide) {
      currentSlide.text.push(text);
    } else {
      pendingText.push(text);
    }
  });

  if (currentSlide) {
    slides.push(currentSlide);
  }

  return slides;
}, [board]);

  /*
    나중에 관리자에서 slides 배열을
    직접 저장하게 만들어도 바로 대응
  */

  const slides: Slide[] = useMemo(() => {
    if (
      Array.isArray(board?.slides) &&
      board.slides.length > 0
    ) {
      return board.slides
        .filter(
          (slide: any) =>
            slide.imageUrl
        )
        .map((slide: any) => ({
          imageUrl: slide.imageUrl,
          text: [
            slide.title,
            slide.description,
          ].filter(Boolean),
        }));
    }

    return parsedSlides;
  }, [board, parsedSlides]);

  /* --------------------------------
     슬라이드 이동
  -------------------------------- */

  const nextSlide = () => {
    if (!slides.length) return;

    setCurrentIndex(
      (prev) =>
        (prev + 1) % slides.length
    );
  };

  const prevSlide = () => {
    if (!slides.length) return;

    setCurrentIndex(
      (prev) =>
        (prev - 1 + slides.length) %
        slides.length
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  /* --------------------------------
     모바일 스와이프
  -------------------------------- */

  const handleTouchStart = (
    e: React.TouchEvent
  ) => {
    touchStartX.current =
      e.touches[0].clientX;
  };

  const handleTouchEnd = (
    e: React.TouchEvent
  ) => {
    if (touchStartX.current === null) {
      return;
    }

    const endX =
      e.changedTouches[0].clientX;

    const difference =
      touchStartX.current - endX;

    if (Math.abs(difference) > 50) {
      if (difference > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }

    touchStartX.current = null;
  };

  /* --------------------------------
     로딩
  -------------------------------- */

  if (loading) {
    return (
      <main className="min-h-screen bg-white px-6 pt-40">
        <div className="mx-auto max-w-7xl text-sm text-gray-400">
          콘텐츠를 불러오는 중입니다.
        </div>
      </main>
    );
  }

  /* --------------------------------
     게시글 없음
  -------------------------------- */

  if (
    !board ||
    board.isPublished !== true
  ) {
    return (
      <main className="min-h-screen bg-white px-6 pt-40">
        <div className="mx-auto max-w-7xl">
          <p className="text-gray-500">
            게시글을 찾을 수 없습니다.
          </p>

          <button
            type="button"
            onClick={() =>
              router.push("/boards")
            }
            className="mt-6 border-b border-black pb-1 text-sm"
          >
            목록으로 돌아가기
          </button>
        </div>
      </main>
    );
  }

  const currentSlide =
    slides[currentIndex];

  /* --------------------------------
     슬라이드가 없는 기존 게시물
  -------------------------------- */

  if (slides.length === 0) {
    return (
      <main className="min-h-screen bg-white px-6 pb-32 pt-36">
        <div className="mx-auto max-w-4xl">

          <button
            type="button"
            onClick={() =>
              router.push("/boards")
            }
            className="mb-10 text-sm text-gray-400 hover:text-black"
          >
            ← 목록으로
          </button>

          <p className="mb-3 text-xs font-semibold tracking-[0.18em] text-gray-400">
            {board.category}
          </p>

          <h1 className="text-4xl font-semibold tracking-[-0.04em] md:text-5xl">
            {board.title}
          </h1>

          {board.summary && (
            <p className="mt-5 text-lg leading-8 text-gray-500">
              {board.summary}
            </p>
          )}

          <div className="my-10 border-t border-black" />

          <div
            className="
              prose
              prose-neutral
              max-w-none
              whitespace-pre-wrap
              [&_img]:mx-auto
              [&_img]:my-10
              [&_img]:max-w-full
              [&_p]:mb-6
              [&_p]:leading-8
            "
            dangerouslySetInnerHTML={{
              __html:
                board.content ||
                "<p>내용이 없습니다.</p>",
            }}
          />

        </div>
      </main>
    );
  }

  /* --------------------------------
     카드뉴스 상세페이지
  -------------------------------- */

  return (
    <main className="min-h-screen bg-white pb-28 pt-28">

      <div className="mx-auto max-w-[1500px] px-4 md:px-8">

        {/* 상단 */}
        <div className="mb-8 flex items-center justify-between border-b border-gray-200 pb-6">

          <button
            type="button"
            onClick={() =>
              router.push("/boards")
            }
            className="text-sm text-gray-400 transition hover:text-black"
          >
            ← GUIDE
          </button>

          <div className="text-xs tracking-[0.18em] text-gray-400">
            LABBRIDGE
          </div>

        </div>

        {/* 본체 */}
        <div className="grid overflow-hidden border border-gray-200 lg:grid-cols-[1.7fr_0.8fr]">

          {/* -------------------------
              LEFT / 카드뉴스
          ------------------------- */}

          <section className="relative bg-[#f5f4f0]">

            {/* 번호 */}
            <div className="absolute left-6 top-6 z-20 rounded-full bg-white/90 px-4 py-2 text-xs font-medium backdrop-blur md:left-8 md:top-8">
              {String(
                currentIndex + 1
              ).padStart(2, "0")}
              <span className="mx-2 text-gray-300">
                /
              </span>
              {String(
                slides.length
              ).padStart(2, "0")}
            </div>

            {/* 이미지 */}
            <div
              className="relative flex min-h-[520px] items-center justify-center overflow-hidden md:min-h-[700px] lg:min-h-[820px]"
              onTouchStart={
                handleTouchStart
              }
              onTouchEnd={
                handleTouchEnd
              }
            >
              <img
                key={
                  currentSlide.imageUrl
                }
                src={
                  currentSlide.imageUrl
                }
                alt={`${board.title} ${
                  currentIndex + 1
                }`}
                className="
                  max-h-[820px]
                  h-full
                  w-full
                  object-contain
                  transition-opacity
                  duration-300
                "
              />

              {/* 이전 */}
              {slides.length > 1 && (
                <button
                  type="button"
                  onClick={prevSlide}
                  className="
                    absolute
                    left-4
                    top-1/2
                    flex
                    h-12
                    w-12
                    -translate-y-1/2
                    items-center
                    justify-center
                    rounded-full
                    bg-white/95
                    text-2xl
                    shadow-sm
                    transition
                    hover:scale-105
                    md:left-6
                  "
                  aria-label="이전 이미지"
                >
                  ‹
                </button>
              )}

              {/* 다음 */}
              {slides.length > 1 && (
                <button
                  type="button"
                  onClick={nextSlide}
                  className="
                    absolute
                    right-4
                    top-1/2
                    flex
                    h-12
                    w-12
                    -translate-y-1/2
                    items-center
                    justify-center
                    rounded-full
                    bg-white/95
                    text-2xl
                    shadow-sm
                    transition
                    hover:scale-105
                    md:right-6
                  "
                  aria-label="다음 이미지"
                >
                  ›
                </button>
              )}
            </div>

            {/* 하단 점 */}
            {slides.length > 1 && (
              <div className="flex items-center justify-center gap-2 bg-white py-6">

                {slides.map(
                  (_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() =>
                        goToSlide(index)
                      }
                      className={`h-2 rounded-full transition-all ${
                        index ===
                        currentIndex
                          ? "w-6 bg-black"
                          : "w-2 bg-gray-300"
                      }`}
                      aria-label={`${
                        index + 1
                      }번 슬라이드`}
                    />
                  )
                )}

              </div>
            )}

          </section>

          {/* -------------------------
              RIGHT / 설명
          ------------------------- */}

          <aside className="flex min-h-[700px] flex-col bg-white px-7 py-8 md:px-10 md:py-12 lg:min-h-[820px]">

            {/* 카테고리 */}
            <div>
              <p className="mb-5 text-xs font-semibold tracking-[0.16em] text-gray-400">
                {board.category ||
                  "LABBRIDGE GUIDE"}
              </p>

              {/* 제목 */}
              <h1 className="text-[30px] font-semibold leading-[1.25] tracking-[-0.04em] md:text-[38px]">
                {board.title}
              </h1>

              {/* 요약 */}
              {board.summary && (
                <p className="mt-5 border-b border-gray-200 pb-8 text-sm leading-7 text-gray-500">
                  {board.summary}
                </p>
              )}
            </div>

            {/* 현재 카드 설명 */}
            <div className="py-8">

              <div className="mb-6 flex items-center gap-3">
                <span className="text-xs font-semibold text-gray-400">
                  STEP
                </span>

                <span className="text-xs font-semibold">
                  {String(
                    currentIndex + 1
                  ).padStart(2, "0")}
                </span>
              </div>

              {currentSlide.text.length >
              0 ? (
                <div className="space-y-5">

                  {currentSlide.text.map(
                    (text, index) => (
                      <p
                        key={index}
                        className={
                          index === 0
                            ? "text-lg font-semibold leading-8"
                            : "text-[15px] leading-7 text-gray-600"
                        }
                      >
                        {text}
                      </p>
                    )
                  )}

                </div>
              ) : (
                <p className="text-[15px] leading-7 text-gray-500">
                  이미지를 좌우로 넘기며
                  가이드를 확인해보세요.
                </p>
              )}

            </div>

            {/* 아래쪽 고정 영역 */}
            <div className="mt-auto">

              <div className="mb-7 border-t border-gray-200 pt-7">

                <p className="mb-4 text-xs font-semibold tracking-[0.12em] text-gray-400">
                  GUIDE NAVIGATION
                </p>

                <div className="flex items-center justify-between">

                  <button
                    type="button"
                    onClick={prevSlide}
                    disabled={
                      slides.length <= 1
                    }
                    className="text-sm font-medium disabled:text-gray-300"
                  >
                    ← 이전
                  </button>

                  <span className="text-xs text-gray-400">
                    {currentIndex + 1} /{" "}
                    {slides.length}
                  </span>

                  <button
                    type="button"
                    onClick={nextSlide}
                    disabled={
                      slides.length <= 1
                    }
                    className="text-sm font-medium disabled:text-gray-300"
                  >
                    다음 →
                  </button>

                </div>

              </div>

              {/* 관련 서비스 */}
              <div className="grid grid-cols-2 gap-3">

                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      "/products"
                    )
                  }
                  className="border border-gray-300 px-4 py-4 text-sm font-semibold transition hover:border-black"
                >
                  제형 둘러보기 →
                </button>

                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      "/restimate"
                    )
                  }
                  className="bg-black px-4 py-4 text-sm font-semibold text-white transition hover:bg-gray-800"
                >
                  견적 문의하기 →
                </button>

              </div>

            </div>

          </aside>

        </div>

        {/* 첨부파일 */}
        {board.files?.length > 0 && (
          <section className="mt-14 border-t border-gray-200 pt-8">

            <h2 className="mb-5 text-sm font-semibold">
              첨부파일
            </h2>

            <div className="flex flex-col gap-2">

              {board.files.map(
                (
                  file: any,
                  index: number
                ) => (
                  <a
                    key={index}
                    href={file.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-gray-500 underline"
                  >
                    {file.name ||
                      `첨부파일 ${
                        index + 1
                      }`}
                  </a>
                )
              )}

            </div>

          </section>
        )}

      </div>

    </main>
  );
}