"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      alert("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/admin");
    } catch (error) {
      console.error(error);
      alert("관리자 로그인 정보가 올바르지 않습니다.");
    }
  };

  return (
    <main className="min-h-screen bg-[#f4f6f8] flex items-center justify-center px-5">
      <div className="w-full max-w-md bg-white border rounded-2xl p-8">
        <h1 className="text-3xl font-bold mb-2">LABBRIDGE ADMIN</h1>
        <p className="text-gray-500 mb-8">관리자 로그인</p>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="관리자 이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-xl px-4 py-4"
          />

          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-xl px-4 py-4"
          />

          <button
            onClick={handleLogin}
            className="w-full bg-black text-white rounded-xl py-4 font-bold"
          >
            관리자 로그인
          </button>
        </div>
      </div>
    </main>
  );
}