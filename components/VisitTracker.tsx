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
    if (pathname.startsWith("/admin")) return;

    const trackVisit = async () => {
      const today = new Date().toISOString().slice(0, 10);

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