"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  addDoc,
  collection,
  doc,
  increment,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function VisitTracker() {
  const pathname = usePathname();
  const trackedRef = useRef(false);

  useEffect(() => {
    if (!pathname) return;

    // 관리자 페이지는 절대 카운트 안 함
    if (pathname === "/admin" || pathname.startsWith("/admin/")) return;

    // 개발 모드에서 중복 실행 방지
    if (trackedRef.current) return;
    trackedRef.current = true;

    const trackVisit = async () => {
      const today = new Date().toLocaleDateString("sv-SE", {
        timeZone: "Asia/Seoul",
      });

      await addDoc(collection(db, "visits"), {
        path: pathname,
        date: today,
        createdAt: serverTimestamp(),
      });

      await setDoc(
        doc(db, "visitStats", today),
        {
          date: today,
          total: increment(1),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      await setDoc(
        doc(db, "pageStats", pathname.replaceAll("/", "_") || "home"),
        {
          path: pathname,
          total: increment(1),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    };

    trackVisit();
  }, [pathname]);

  return null;
}