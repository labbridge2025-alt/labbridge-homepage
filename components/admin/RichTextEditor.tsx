"use client";

import { useEffect, useRef, useState } from "react";

type Props = { value: string; onChange: (html: string) => void };

type Tool = {
  label: string;
  action: string;
  icon: string;
  className?: string;
};

const textTools: Tool[] = [
  { label: "굵게", action: "bold", icon: "B", className: "font-bold" },
  { label: "기울임", action: "italic", icon: "I", className: "italic font-serif" },
  { label: "밑줄", action: "underline", icon: "U", className: "underline" },
  { label: "취소선", action: "strikeThrough", icon: "S", className: "line-through" },
];
const alignTools: Tool[] = [
  { label: "왼쪽 정렬", action: "justifyLeft", icon: "☷" },
  { label: "가운데 정렬", action: "justifyCenter", icon: "≡" },
  { label: "오른쪽 정렬", action: "justifyRight", icon: "☰" },
];
const listTools: Tool[] = [
  { label: "글머리 목록", action: "insertUnorderedList", icon: "☷" },
  { label: "번호 목록", action: "insertOrderedList", icon: "☷" },
];

export default function RichTextEditor({ value, onChange }: Props) {
  const editor = useRef<HTMLDivElement>(null);
  const lastHtml = useRef(value);
  const selection = useRef<Range | null>(null);
  const [color, setColor] = useState("#111111");

  useEffect(() => {
    if (editor.current && value !== lastHtml.current) {
      editor.current.innerHTML = value || "";
      lastHtml.current = value;
    }
  }, [value]);

  const sync = () => {
    const html = editor.current?.innerHTML || "";
    lastHtml.current = html;
    onChange(html);
  };

  const rememberSelection = () => {
    const sel = window.getSelection();
    if (sel?.rangeCount && editor.current?.contains(sel.anchorNode)) {
      selection.current = sel.getRangeAt(0).cloneRange();
    }
  };

  const restoreSelection = () => {
    editor.current?.focus();
    if (!selection.current) return;
    const sel = window.getSelection();
    sel?.removeAllRanges();
    try {
      sel?.addRange(selection.current);
    } catch {
      // Selection may no longer exist after editing or changing cards.
    }
  };

  const command = (name: string, argument?: string) => {
    restoreSelection();
    document.execCommand(name, false, argument);
    rememberSelection();
    sync();
  };

  const addLink = () => {
    rememberSelection();
    const url = window.prompt("링크 주소를 입력하세요 (https://...)");
    if (!url || !/^https?:\/\//i.test(url)) return;
    command("createLink", url);
  };

  const addTable = () => {
    rememberSelection();
    const rows = Number(window.prompt("행 개수 (1~15)", "3"));
    if (!Number.isInteger(rows) || rows < 1 || rows > 15) return;
    const cols = Number(window.prompt("열 개수 (1~10)", "3"));
    if (!Number.isInteger(cols) || cols < 1 || cols > 10) return;
    const cells = (tag: string) =>
      Array.from({ length: cols }, () =>
        `<${tag} style="border:1px solid #d1d5db;padding:8px;min-width:50px">&nbsp;</${tag}>`
      ).join("");
    const html = `<table style="width:100%;border-collapse:collapse;margin:12px 0"><thead><tr>${cells("th")}</tr></thead><tbody>${Array.from({ length: rows - 1 }, () => `<tr>${cells("td")}</tr>`).join("")}</tbody></table><p><br></p>`;
    command("insertHTML", html);
  };

  const toolButton = ({ label, action, icon, className = "" }: Tool) => (
    <button
      key={action}
      type="button"
      title={label}
      aria-label={label}
      onMouseDown={(event) => event.preventDefault()}
      onClick={() => command(action)}
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[15px] text-gray-700 transition hover:bg-gray-200 hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-gray-400"
    >
      <span className={className}>{icon}</span>
    </button>
  );

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center gap-x-1 gap-y-2 border-b border-gray-200 bg-[#fafafa] px-3 py-2.5">
        <select
          aria-label="문단 스타일"
          defaultValue="p"
          onChange={(event) => command("formatBlock", event.target.value)}
          className="h-8 rounded-md border border-gray-200 bg-white px-2 text-xs text-gray-700 outline-none hover:border-gray-300"
        >
          <option value="p">본문</option>
          <option value="h2">제목 1</option>
          <option value="h3">제목 2</option>
          <option value="blockquote">인용문</option>
        </select>
        <select
          aria-label="글꼴"
          defaultValue=""
          onChange={(event) => command("fontName", event.target.value)}
          className="h-8 max-w-[110px] rounded-md border border-gray-200 bg-white px-2 text-xs text-gray-700 outline-none hover:border-gray-300"
        >
          <option value="" disabled>글꼴</option>
          <option value="Arial">Arial</option>
          <option value="Malgun Gothic">맑은 고딕</option>
          <option value="Georgia">Georgia</option>
          <option value="serif">명조체</option>
        </select>
        <select
          aria-label="글자 크기"
          defaultValue="3"
          onChange={(event) => command("fontSize", event.target.value)}
          className="h-8 rounded-md border border-gray-200 bg-white px-2 text-xs text-gray-700 outline-none hover:border-gray-300"
        >
          <option value="2">13</option>
          <option value="3">15</option>
          <option value="4">18</option>
          <option value="5">24</option>
          <option value="6">32</option>
        </select>

        <span className="mx-1 h-5 w-px bg-gray-200" />
        {textTools.map(toolButton)}
        <label title="글자색" className="relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-md hover:bg-gray-200">
          <span className="text-[16px] font-semibold" style={{ borderBottom: `3px solid ${color}`, lineHeight: "20px" }}>A</span>
          <input
            type="color"
            aria-label="글자색"
            value={color}
            onChange={(event) => {
              setColor(event.target.value);
              command("foreColor", event.target.value);
            }}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
        </label>
        <span className="mx-1 h-5 w-px bg-gray-200" />
        {alignTools.map(toolButton)}
        <span className="mx-1 h-5 w-px bg-gray-200" />
        {listTools.map(toolButton)}
        <span className="mx-1 h-5 w-px bg-gray-200" />
        <button type="button" title="링크 삽입" aria-label="링크 삽입" onMouseDown={(e) => e.preventDefault()} onClick={addLink}
          className="flex h-8 w-8 items-center justify-center rounded-md text-lg text-gray-700 hover:bg-gray-200">↗</button>
        <button type="button" title="표 삽입" aria-label="표 삽입" onMouseDown={(e) => e.preventDefault()} onClick={addTable}
          className="flex h-8 w-8 items-center justify-center rounded-md text-lg text-gray-700 hover:bg-gray-200">▦</button>
        <span className="mx-1 h-5 w-px bg-gray-200" />
        {toolButton({ label: "실행 취소", action: "undo", icon: "↶" })}
        {toolButton({ label: "다시 실행", action: "redo", icon: "↷" })}
      </div>
      <div className="relative">
        {!value && <span aria-hidden="true" className="pointer-events-none absolute left-4 top-4 text-sm text-gray-400">내용을 입력해 주세요.</span>}
        <div
          ref={editor}
          contentEditable
          suppressContentEditableWarning
          role="textbox"
          aria-label="카드 설명"
          aria-multiline="true"
          onInput={sync}
          onBlur={sync}
          onMouseUp={rememberSelection}
          onKeyUp={rememberSelection}
          className="min-h-[220px] break-words px-4 py-4 text-[15px] leading-7 text-gray-800 outline-none [&_table]:my-3 [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-gray-300 [&_td]:p-2 [&_th]:border [&_th]:border-gray-300 [&_th]:bg-gray-50 [&_th]:p-2"
        />
      </div>
    </div>
  );
}
