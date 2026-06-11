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

        <nav className="flex gap-14 text-xl font-medium">
          <a href="/about">회사소개</a>
          <a href="/products">서비스</a>
          <a href="/process">진행절차</a>
          <a href="/portfolio">포트폴리오</a>
          <a href="/estimate">문의하기</a>
        </nav>
      </div>
    </header>
  );
}