"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user?.email) {
        router.push("/admin-login");
        return;
      }

      const q = query(
        collection(db, "users"),
        where("email", "==", user.email)
      );

      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        alert("관리자 권한이 없는 계정입니다.");
        router.push("/admin-login");
        return;
      }

      setChecking(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (checking) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        관리자 권한 확인 중...
      </main>
    );
  }

  return <>{children}</>;
}