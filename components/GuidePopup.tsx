"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function GuidePopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const hideUntil = localStorage.getItem("popup-hide-until");
    const now = new Date().getTime();

    if (!hideUntil || now > Number(hideUntil)) {
      setOpen(true);
    }
  }, []);

  const closeToday = () => {
    const tomorrow = new Date().getTime() + 24 * 60 * 60 * 1000;
    localStorage.setItem("popup-hide-until", String(tomorrow));
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] bg-black/50 flex items-center justify-center">
      <div className="w-[500px] bg-white rounded-xl overflow-hidden">
        <a href="/estimate">
          <Image
            src="/popup/main-popup.png"
            alt="팝업 이미지"
            width={500}
            height={500}
            priority
          />
        </a>

        <div className="grid grid-cols-2 border-t">
          <button
            type="button"
            onClick={closeToday}
            className="py-5 font-bold border-r"
          >
            오늘 하루 보지 않기
          </button>

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="py-5 font-bold"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}