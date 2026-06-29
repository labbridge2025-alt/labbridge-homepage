"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";
import { Extension } from "@tiptap/core";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import FontFamily from "@tiptap/extension-font-family";
const FontSize = Extension.create({
  name: "fontSize",

  addOptions() {
    return {
      types: ["textStyle"],
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) => element.style.fontSize || null,
            renderHTML: (attributes) => {
              if (!attributes.fontSize) return {};
              return {
                style: `font-size: ${attributes.fontSize}`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
  return {
    setFontSize:
      (fontSize: string) =>
      ({ chain }: any) => {
        return chain().setMark("textStyle", { fontSize }).run();
      },
  } as any;
},
});
const categories = [
  "원료자료",
  "가이드라인",
  "트렌드자료",
  "공지사항",
  "FAQ",
  "기타",
];

export default function AdminBoardNewPage() {
  const router = useRouter();

  const [category, setCategory] = useState("원료자료");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [keywords, setKeywords] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const editor = useEditor({
    extensions: [
  StarterKit,
  TextStyle,
  FontSize,
  Color,
  Highlight,
  FontFamily,
  Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link.configure({
        openOnClick: false,
      }),
      Image,
      Youtube.configure({
        width: 640,
        height: 360,
      }),
    ],
    content: "",
    editorProps: {
      attributes: {
        class:
          "min-h-[420px] outline-none px-8 py-8 text-[16px] leading-8",
      },
    },
  });

  const uploadImageToEditor = async (file: File) => {
    if (!editor) return;

    const imageRef = ref(storage, `boards/editor/${Date.now()}-${file.name}`);
    await uploadBytes(imageRef, file);
    const url = await getDownloadURL(imageRef);

    editor.chain().focus().setImage({ src: url }).run();
  };

  const addVideo = () => {
    const url = prompt("유튜브 영상 링크를 입력해주세요.");
    if (!url) return;

    editor?.chain().focus().setYoutubeVideo({ src: url }).run();
  };

  const addLink = () => {
    const url = prompt("링크 URL을 입력해주세요.");
    if (!url) return;

    editor?.chain().focus().setLink({ href: url }).run();
  };

  const handleSubmit = async () => {
    const content = editor?.getHTML() || "";

    if (!title || !summary || content === "<p></p>") {
      alert("제목, 한줄 설명, 내용을 입력해주세요.");
      return;
    }

    setLoading(true);

    try {
      const uploadedFiles = [];

      for (const file of files) {
        const fileRef = ref(storage, `boards/files/${Date.now()}-${file.name}`);
        await uploadBytes(fileRef, file);
        const url = await getDownloadURL(fileRef);

        uploadedFiles.push({
          name: file.name,
          url,
        });
      }

      await addDoc(collection(db, "boards"), {
        category,
        title,
        summary,
        content,
        keywords: keywords
          .split(",")
          .map((v) => v.trim())
          .filter(Boolean),
        isPublished,
        files: uploadedFiles,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      alert("게시글이 등록되었습니다.");
      router.push("/admin/boards");
    } catch (error) {
      console.error(error);
      alert("등록 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">게시글 등록</h1>
        <p className="mt-2 text-gray-500">
          원료자료, 가이드라인, 공지사항 등을 등록합니다.
        </p>
      </div>

      <div className="max-w-5xl rounded-2xl border border-black bg-white p-8">
        <div className="space-y-6">
          <div>
            <label className="mb-2 block font-semibold">카테고리</label>
            <select
              className="w-full rounded-xl border border-gray-300 p-3"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block font-semibold">제목 *</label>
            <input
              className="w-full rounded-xl border border-gray-300 p-3"
              placeholder="예: PDRN"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold">한줄 설명 *</label>
            <input
              className="w-full rounded-xl border border-gray-300 p-3"
              placeholder="예: 피부 컨디션 케어에 도움을 주는 원료"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold">상세 내용 *</label>

            <div className="overflow-hidden rounded-xl border border-gray-300 bg-white">
              <div className="flex flex-wrap items-center gap-1 border-b bg-[#fafafa] px-4 py-3 text-sm">
                <select
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "paragraph") {
                      editor?.chain().focus().setParagraph().run();
                    }
                    if (value === "h2") {
                      editor?.chain().focus().toggleHeading({ level: 2 }).run();
                    }
                    if (value === "h3") {
                      editor?.chain().focus().toggleHeading({ level: 3 }).run();
                    }
                  }}
                  className="rounded border px-3 py-2"
                >
                  <option value="paragraph">본문</option>
                  <option value="h2">큰 제목</option>
                  <option value="h3">소제목</option>
                </select>
<select
  onChange={(e) =>
    editor?.chain().focus().setFontFamily(e.target.value).run()
  }
  className="rounded border px-3 py-2"
>
  <option value="">글꼴</option>
  <option value="Pretendard">Pretendard</option>
  <option value="'Noto Sans KR'">Noto Sans KR</option>
  <option value="Arial">Arial</option>
  <option value="'Times New Roman'">Times New Roman</option>
</select>

<select
  onChange={(e) =>
    editor?.chain().focus().setFontSize(e.target.value).run()
  }
  className="rounded border px-3 py-2"
>
  <option value="">크기</option>
  <option value="12px">12</option>
  <option value="13px">13</option>
  <option value="14px">14</option>
  <option value="15px">15</option>
  <option value="16px">16</option>
  <option value="18px">18</option>
  <option value="20px">20</option>
  <option value="22px">22</option>
  <option value="24px">24</option>
  <option value="28px">28</option>
  <option value="32px">32</option>
  <option value="36px">36</option>
  <option value="40px">40</option>
  <option value="48px">48</option>
</select>

<input
  type="color"
  onChange={(e) => editor?.chain().focus().setColor(e.target.value).run()}
  className="h-9 w-10 rounded border"
/>

<button
  type="button"
  onClick={() => editor?.chain().focus().toggleHighlight().run()}
  className="h-9 px-3 rounded hover:bg-gray-200"
>
  형광
</button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleBold().run()}
                  className="h-9 w-9 rounded hover:bg-gray-200 font-bold"
                >
                  B
                </button>

                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleItalic().run()}
                  className="h-9 w-9 rounded hover:bg-gray-200 italic"
                >
                  I
                </button>

                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleUnderline().run()}
                  className="h-9 w-9 rounded hover:bg-gray-200 underline"
                >
                  U
                </button>

                <div className="mx-2 h-5 w-px bg-gray-300" />

                <button
                  type="button"
                  onClick={() => editor?.chain().focus().setTextAlign("left").run()}
                  className="h-9 w-9 rounded hover:bg-gray-200"
                  title="왼쪽 정렬"
                >
                  ≡
                </button>

                <button
                  type="button"
                  onClick={() =>
                    editor?.chain().focus().setTextAlign("center").run()
                  }
                  className="h-9 w-9 rounded hover:bg-gray-200"
                  title="가운데 정렬"
                >
                  ≣
                </button>

                <button
                  type="button"
                  onClick={() =>
                    editor?.chain().focus().setTextAlign("right").run()
                  }
                  className="h-9 w-9 rounded hover:bg-gray-200"
                  title="오른쪽 정렬"
                >
                  ≡
                </button>

                <div className="mx-2 h-5 w-px bg-gray-300" />

                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleBulletList().run()}
                  className="h-9 w-9 rounded hover:bg-gray-200"
                  title="목록"
                >
                  ☷
                </button>

                <button
                  type="button"
                  onClick={addLink}
                  className="h-9 w-9 rounded hover:bg-gray-200"
                  title="링크"
                >
                  🔗
                </button>

                <label
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded hover:bg-gray-200"
                  title="이미지 삽입"
                >
                  🖼
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) await uploadImageToEditor(file);
                    }}
                  />
                </label>

                <button
                  type="button"
                  onClick={addVideo}
                  className="h-9 w-9 rounded hover:bg-gray-200"
                  title="영상 삽입"
                >
                  ▶
                </button>
              </div>

              <EditorContent editor={editor} />
            </div>

            <p className="mt-2 text-sm text-gray-400">
              이미지 버튼을 누르면 선택한 이미지가 본문 안에 바로 삽입됩니다.
            </p>
          </div>

          <div>
            <label className="mb-2 block font-semibold">첨부 파일</label>

            <label className="flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-gray-300 p-6 text-gray-500 hover:bg-gray-50">
              + 파일 추가
              <input
                type="file"
                multiple
                className="hidden"
                onChange={(e) => {
                  const selected = Array.from(e.target.files || []);
                  setFiles((prev) => [...prev, ...selected]);
                }}
              />
            </label>

            {files.length > 0 && (
              <div className="mt-3 space-y-2">
                {files.map((file, index) => (
                  <div
                    key={`${file.name}-${index}`}
                    className="flex items-center justify-between rounded-xl border px-4 py-3 text-sm"
                  >
                    <span>{file.name}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setFiles((prev) => prev.filter((_, i) => i !== index))
                      }
                      className="text-red-500"
                    >
                      삭제
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="mb-2 block font-semibold">키워드</label>
            <input
              className="w-full rounded-xl border border-gray-300 p-3"
              placeholder="예: 보습, 탄력, 피부결"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
            />
          </div>

          <label className="flex items-center gap-2 font-semibold">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
            />
            공개
          </label>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="rounded-xl bg-black px-6 py-3 font-semibold text-white disabled:bg-gray-400"
            >
              {loading ? "등록 중..." : "등록하기"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/admin/boards")}
              className="rounded-xl border border-black px-6 py-3 font-semibold"
            >
              취소
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}