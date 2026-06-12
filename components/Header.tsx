import Image from "next/image";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full bg-white border-b border-gray-200 z-50">
      <div className="h-24 px-20 flex items-center justify-between">
        <a href="/">
          <Image
            src="/logo.png"
            alt="LabBridge"
            width={180}
            height={60}
            priority
          />
        </a>

        <nav className="flex items-center gap-8 text-lg font-bold">
  <a href="/about">회사소개</a>

  <a href="/products">
    제형보러가기
  </a>

  <a href="/process">진행절차</a>

  <a href="/portfolio">포트폴리오</a>

  <a href="/estimate">문의하기</a>

  <a
    href="/wish"
    className="text-sm border px-4 py-2 rounded-full"
  >
    관심상품
  </a>

  <a
    href="/login"
    className="text-sm"
  >
    로그인
  </a>

  <a
    href="/signup"
    className="text-sm bg-black text-white px-4 py-2 rounded-full"
  >
    회원가입
  </a>
</nav>
      </div>
    </header>
  );
}