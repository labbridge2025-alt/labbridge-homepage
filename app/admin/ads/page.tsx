
"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

type AdsSettings = {
  metaPixelId: string;
  googleAdsId: string;
  naverAdsId: string;
  kakaoPixelId: string;
};

const initialSettings: AdsSettings = {
  metaPixelId: "",
  googleAdsId: "",
  naverAdsId: "",
  kakaoPixelId: "",
};

export default function AdsPage() {
  const [settings, setSettings] =
    useState<AdsSettings>(initialSettings);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadSettings() {
      try {
        const ref = doc(db, "settings", "ads");
        const snapshot = await getDoc(ref);

        if (snapshot.exists()) {
          setSettings({
            ...initialSettings,
            ...snapshot.data(),
          });
        }
      } catch (error) {
        console.error("광고 설정 불러오기 실패:", error);
        setMessage("광고 설정을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  const handleChange = (
    field: keyof AdsSettings,
    value: string
  ) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");

    try {
      await setDoc(
        doc(db, "settings", "ads"),
        settings
      );

      setMessage("광고 픽셀 설정이 저장되었습니다.");
    } catch (error) {
      console.error("광고 설정 저장 실패:", error);
      setMessage("저장에 실패했습니다. 권한을 확인해 주세요.");
    } finally {
      setSaving(false);
    }
  };

  const fields: {
    label: string;
    key: keyof AdsSettings;
  }[] = [
    { label: "Meta Pixel ID", key: "metaPixelId" },
    { label: "Google Ads ID", key: "googleAdsId" },
    { label: "네이버 광고 ID", key: "naverAdsId" },
    { label: "카카오 픽셀 ID", key: "kakaoPixelId" },
  ];

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">
        광고 픽셀 설정
      </h1>

      <div className="bg-white border rounded-2xl p-8 max-w-3xl space-y-6">
        {fields.map((field) => (
          <div key={field.key}>
            <label className="font-bold block mb-2">
              {field.label}
            </label>

            <input
              className="w-full border rounded-xl px-4 py-3"
              placeholder="광고 ID를 입력하세요"
              value={settings[field.key]}
              onChange={(e) =>
                handleChange(field.key, e.target.value)
              }
              disabled={loading || saving}
            />
          </div>
        ))}

<button
  type="button"
  onClick={() => {
    alert("저장 버튼 클릭 확인!");
    handleSave();
  }}
  disabled={loading || saving}
          className="bg-black text-white px-8 py-4 rounded-xl disabled:opacity-50"
        >
          {loading
            ? "불러오는 중..."
            : saving
            ? "저장 중..."
            : "저장하기"}
        </button>

        {message && (
          <p className="text-sm font-medium">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
