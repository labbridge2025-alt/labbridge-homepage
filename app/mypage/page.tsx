"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import Header from "@/components/Header";

export default function MyPage() {
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        window.location.href = "/login";
        return;
      }

      const snap = await getDoc(doc(db, "users", user.uid));

      if (snap.exists()) {
        setUserInfo({
          uid: user.uid,
          email: user.email,
          ...snap.data(),
        });
      } else {
        setUserInfo({
          uid: user.uid,
          email: user.email,
        });
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <>
        <Header />
        <main className="pt-40 text-center">불러오는 중...</main>
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="pt-32 pb-24">
        <section className="max-w-3xl mx-auto px-5">
          <h1 className="text-4xl font-bold mb-10">내정보</h1>

          <div className="border rounded-2xl p-8 space-y-5 bg-white">
            <InfoRow label="회사명" value={userInfo?.company || "-"} />
            <InfoRow label="담당자명" value={userInfo?.manager || "-"} />
            <InfoRow label="연락처" value={userInfo?.phone || "-"} />
            <InfoRow label="이메일" value={userInfo?.email || "-"} />
            <InfoRow label="회원등급" value={userInfo?.role || "user"} />
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              href="/wish"
              className="border rounded-xl py-4 text-center font-bold"
            >
              관심상품 보기
            </a>

            <a
              href="/estimate"
              className="bg-black text-white rounded-xl py-4 text-center font-bold"
            >
              문의하기
            </a>
          </div>
        </section>
      </main>
    </>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[120px_1fr] gap-4 border-b last:border-b-0 pb-4 last:pb-0">
      <p className="font-bold text-gray-500">{label}</p>
      <p>{value}</p>
    </div>
  );
}