"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

type PopupItem = {
  id: string;
  imageUrl: string;
  link: string;
  page: string;
  active: boolean;
};

export default function GuidePopup() {
  const [popups, setPopups] = useState<PopupItem[]>([]);
  const [current, setCurrent] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const loadPopups = async () => {
      const hideUntil = localStorage.getItem("popup-hide-until");
      const now = new Date().getTime();

      if (hideUntil && now < Number(hideUntil)) return;

      const currentPath = window.location.pathname;

      const q = query(collection(db, "popups"), where("active", "==", true));
      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<PopupItem, "id">),
      }));

      const matchedPopups = data.filter(
        (item) => item.page === currentPath || item.page === "all"
      );

      if (matchedPopups.length > 0) {
        setPopups(matchedPopups);
        setOpen(true);
      }
    };

    loadPopups();
  }, []);

  useEffect(() => {
    if (!open || popups.length <= 1) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % popups.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [open, popups.length]);

  const closeToday = () => {
    const tomorrow = new Date().getTime() + 24 * 60 * 60 * 1000;
    localStorage.setItem("popup-hide-until", String(tomorrow));
    setOpen(false);
  };

  if (!open || popups.length === 0) return null;

  const popup = popups[current];

  return (
    <div className="fixed inset-0 z-[999] bg-black/50 flex items-center justify-center px-5">
      <div className="w-full max-w-[500px] bg-white rounded-xl overflow-hidden">
        <div className="relative">
          <a href={popup.link || "#"}>
            <img
              src={popup.imageUrl}
              alt="팝업 이미지"
              className="w-full h-auto"
            />
          </a>

          {popups.length > 1 && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
              {popups.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setCurrent(index)}
                  className={`h-2.5 rounded-full transition-all ${
                    current === index
                      ? "w-6 bg-black"
                      : "w-2.5 bg-white/70 border border-black/20"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

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