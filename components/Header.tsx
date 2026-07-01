"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Heart, Menu, User } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [authReady, setAuthReady] = useState(false);

  const pathname = usePathname();
  const isHome = pathname === "/";

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
    <header
      className={`fixed left-0 top-0 z-50 w-full border-b border-gray-200 bg-white ${
        isHome ? "hidden md:block" : "block"
      }`}
    >
      <div className="flex h-24 items-center justify-between px-6 lg:px-20">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="lg:hidden"
        >
          <Menu size={34} strokeWidth={1.8} />
        </button>

        <a href="/" className="flex flex-1 justify-center lg:block lg:flex-none">
          <Image
            src="/logo.png"
            alt="LabBridge"
            width={180}
            height={60}
            priority
            className="w-[155px] lg:w-[180px]"
          />
        </a>

        <nav className="hidden items-center gap-8 text-lg font-bold lg:flex">
          <a href="/about">회사소개</a>
          <a href="/products">제형보러가기</a>
          <a href="/containers">용기보러가기</a>
<a href="/packages">패키지보러가기</a>
          <a href="/process">진행절차</a>
          <a href="/portfolio">포트폴리오</a>
          <a href="/estimate">문의하기</a>

          <a
            href="/boards"
            className="rounded-lg border border-black px-4 py-2 text-sm font-bold transition hover:bg-black hover:text-white"
          >
            LAB MEMBERS
          </a>

          <div className="flex items-center gap-5">
            <a href="/wish">
              <Heart size={24} strokeWidth={2} />
            </a>

            {authReady &&
              (userEmail ? (
                <div className="group relative">
                  <button type="button" className="py-2">
                    <User size={24} strokeWidth={2} />
                  </button>

                  <div className="invisible absolute right-0 top-full w-40 rounded-xl border bg-white pt-2 opacity-0 shadow-lg transition-all duration-200 group-hover:visible group-hover:opacity-100">
                    <a href="/mypage" className="block px-4 py-3 hover:bg-gray-50">
                      내정보
                    </a>

                    <button
                      type="button"
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
              ))}
          </div>
        </nav>

        <div className="flex items-center gap-4 lg:hidden">
          <a href="/wish">
            <Heart size={27} strokeWidth={1.9} />
          </a>

          <a href={userEmail ? "/mypage" : "/login"}>
            <User size={27} strokeWidth={1.9} />
          </a>
        </div>
      </div>

      {open && (
        <div className="border-t bg-white px-6 py-6 lg:hidden">
          <nav className="flex flex-col gap-5 text-lg font-bold">
            <a href="/about" onClick={() => setOpen(false)}>
              회사소개
            </a>
            <a href="/products" onClick={() => setOpen(false)}>
              제형보러가기
            </a>
            <a href="/process" onClick={() => setOpen(false)}>
              진행절차
            </a>
            <a href="/portfolio" onClick={() => setOpen(false)}>
              포트폴리오
            </a>
            <a href="/boards" onClick={() => setOpen(false)}>
              LAB MEMBERS
            </a>
            <a href="/estimate" onClick={() => setOpen(false)}>
              문의하기
            </a>
            <a href="/wish" onClick={() => setOpen(false)}>
              관심상품
            </a>

            {userEmail ? (
              <>
                <a href="/mypage" onClick={() => setOpen(false)}>
                  내정보
                </a>

                <button
                  type="button"
                  onClick={logout}
                  className="rounded-xl bg-black px-5 py-3 text-center text-white"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <a href="/login" onClick={() => setOpen(false)}>
                  로그인
                </a>

                <a
                  href="/signup"
                  onClick={() => setOpen(false)}
                  className="rounded-xl bg-black px-5 py-3 text-center text-white"
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