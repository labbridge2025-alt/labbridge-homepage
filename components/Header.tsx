"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Heart, User } from "lucide-react";
export default function Header() {
  const [open, setOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
const [authReady, setAuthReady] = useState(false);
  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    setUserEmail(user?.email || "");
    setAuthReady(true);
  });

  return () => unsubscribe();
}, []);

  const logout = async () => {
    await signOut(auth);
    alert("로그아웃되었습니다.");
    window.location.href = "/";
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-white border-b border-gray-200 z-50">
      <div className="h-24 px-6 lg:px-20 flex items-center justify-between">
        <a href="/">
          <Image
            src="/logo.png"
            alt="LabBridge"
            width={180}
            height={60}
            priority
          />
        </a>

        <nav className="hidden lg:flex items-center gap-8 text-lg font-bold">
          <a href="/about">회사소개</a>
          <a href="/products">제형보러가기</a>
          <a href="/process">진행절차</a>
          <a href="/portfolio">포트폴리오</a>
          <a href="/estimate">문의하기</a>
          <a
  href="/boards"
  className="rounded-lg border border-black px-4 py-2 text-sm font-bold hover:bg-black hover:text-white transition"
>
  LAB MEMBERS
</a>
<div className="flex items-center gap-5">
  <a href="/wish">
    <Heart size={24} strokeWidth={2} />
  </a>

  {authReady && (
    <>
      {userEmail ? (
        <div className="relative group">
          <button>
            <User size={24} strokeWidth={2} />
          </button>

          <div className="absolute right-0 top-full pt-2 w-40 rounded-xl border bg-white shadow-lg opacity-0 invisible transition-all duration-200 group-hover:opacity-100 group-hover:visible">
            <a
              href="/mypage"
              className="block px-4 py-3 hover:bg-gray-50"
            >
              내정보
            </a>

            <button
              onClick={logout}
              className="block w-full px-4 py-3 text-left hover:bg-gray-50"
            >
              로그아웃
            </button>
          </div>
        </div>
      ) : (
        <a href="/login">
          <User size={24} strokeWidth={2} />
        </a>
      )}
    </>
  )}
</div>
        </nav>

        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="lg:hidden text-4xl font-bold"
        >
          ☰
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t bg-white px-6 py-6">
          <nav className="flex flex-col gap-5 text-lg font-bold">
            <a href="/about" onClick={() => setOpen(false)}>회사소개</a>
            <a href="/products" onClick={() => setOpen(false)}>제형보러가기</a>
            <a href="/process" onClick={() => setOpen(false)}>진행절차</a>
            <a href="/portfolio" onClick={() => setOpen(false)}>포트폴리오</a>
            <a href="/estimate" onClick={() => setOpen(false)}>문의하기</a>
            <a href="/wish" onClick={() => setOpen(false)}>관심상품</a>

            {userEmail ? (
              <>
                <a href="/mypage" onClick={() => setOpen(false)}>내정보</a>
                <button
                  type="button"
                  onClick={logout}
                  className="bg-black text-white px-5 py-3 rounded-xl text-center"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <a href="/login" onClick={() => setOpen(false)}>로그인</a>
                <a
                  href="/signup"
                  onClick={() => setOpen(false)}
                  className="bg-black text-white px-5 py-3 rounded-xl text-center"
                >
                  회원가입
                </a>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}