"use client";

export default function AdsPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">광고 픽셀 설정</h1>

      <div className="bg-white border rounded-2xl p-8 max-w-3xl space-y-6">
        <div>
          <label className="font-bold block mb-2">
            Meta Pixel ID
          </label>

          <input
            className="w-full border rounded-xl px-4 py-3"
            placeholder="나중에 입력"
          />
        </div>

        <div>
          <label className="font-bold block mb-2">
            Google Ads ID
          </label>

          <input
            className="w-full border rounded-xl px-4 py-3"
            placeholder="나중에 입력"
          />
        </div>

        <div>
          <label className="font-bold block mb-2">
            네이버 광고 ID
          </label>

          <input
            className="w-full border rounded-xl px-4 py-3"
            placeholder="나중에 입력"
          />
        </div>

        <div>
          <label className="font-bold block mb-2">
            카카오 픽셀 ID
          </label>

          <input
            className="w-full border rounded-xl px-4 py-3"
            placeholder="나중에 입력"
          />
        </div>

        <button className="bg-black text-white px-8 py-4 rounded-xl">
          저장하기
        </button>
      </div>
    </div>
  );
}