"use client";

import { useEffect } from "react";
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

  useEffect(() => {
    if (!pathname) return;

    // =========================================
    // 관리자 페이지는 방문자 통계에서 제외
    // =========================================

    if (
      pathname === "/admin" ||
      pathname.startsWith("/admin/")
    ) {
      return;
    }

    const trackVisit = async () => {
      try {
        // =========================================
        // 한국 시간 기준 오늘 날짜
        // 예: 2026-08-26
        // =========================================

        const today = new Date().toLocaleDateString("sv-SE", {
          timeZone: "Asia/Seoul",
        });

        // =========================================
        // 오늘 방문 여부 확인
        //
        // 같은 브라우저에서는 하루에 딱 1번만
        // 방문자로 집계
        // =========================================

        const visitKey = `labbridge_visited_${today}`;

        const alreadyVisited =
          localStorage.getItem(visitKey);

        // =========================================
        // 오늘 처음 방문한 사람만 방문자 +1
        // =========================================

        if (!alreadyVisited) {
          // 개별 방문 기록 저장

          await addDoc(collection(db, "visits"), {
            path: pathname,
            date: today,
            createdAt: serverTimestamp(),
          });

          // 일자별 방문자 수 +1

          await setDoc(
            doc(db, "visitStats", today),
            {
              date: today,
              total: increment(1),
              updatedAt: serverTimestamp(),
            },
            {
              merge: true,
            }
          );

          // 오늘 방문 완료 표시
          localStorage.setItem(
            visitKey,
            "true"
          );
        }

        // =========================================
        // 페이지 조회수는 별도 집계
        //
        // 방문자 중복 제거와 관계없이
        // 어떤 페이지가 많이 조회되는지 확인 가능
        // =========================================

        await setDoc(
          doc(
            db,
            "pageStats",
            pathname.replaceAll("/", "_") || "home"
          ),
          {
            path: pathname,
            total: increment(1),
            updatedAt: serverTimestamp(),
          },
          {
            merge: true,
          }
        );
      } catch (error) {
        console.error(
          "방문자 통계 기록 실패:",
          error
        );
      }
    };

    trackVisit();
  }, [pathname]);

  return null;
}