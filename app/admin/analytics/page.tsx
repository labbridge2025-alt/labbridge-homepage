"use client";

import { useEffect, useMemo, useState } from "react";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

type VisitStat = {
  id: string;
  date?: string;
  total?: number;
};

export default function AnalyticsPage() {
  const [visitStats, setVisitStats] = useState<VisitStat[]>([]);

  useEffect(() => {
    const loadStats = async () => {
      const q = query(
        collection(db, "visitStats"),
        orderBy("date", "desc"),
        limit(30)
      );

      const snapshot = await getDocs(q);

      setVisitStats(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<VisitStat, "id">),
        }))
      );
    };

    loadStats();
  }, []);

 const today = new Date().toLocaleDateString("sv-SE", {
  timeZone: "Asia/Seoul",
});

  const todayVisit = useMemo(() => {
    return visitStats.find((item) => item.date === today)?.total || 0;
  }, [visitStats, today]);

  const totalVisit = useMemo(() => {
    return visitStats.reduce((sum, item) => sum + (item.total || 0), 0);
  }, [visitStats]);

  return (
    <div>
      <h1 className="mb-8 text-4xl font-bold">방문자 통계</h1>

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard title="오늘 방문자" value={`${todayVisit}명`} />
        <StatCard title="최근 30일 방문" value={`${totalVisit}명`} />
        <StatCard title="기록 일수" value={`${visitStats.length}일`} />
      </div>

      <div className="rounded-2xl border bg-white p-8">
        <h2 className="mb-6 text-2xl font-bold">일자별 방문자</h2>

        {visitStats.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            아직 방문 데이터가 없습니다.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-gray-500">
                <th className="py-3">날짜</th>
                <th className="py-3">방문자 수</th>
              </tr>
            </thead>

            <tbody>
              {visitStats.map((item) => (
                <tr key={item.id} className="border-b last:border-0">
                  <td className="py-4 font-semibold">{item.date || "-"}</td>
                  <td className="py-4">{item.total || 0}명</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border bg-white p-6">
      <p className="mb-3 text-sm font-semibold text-gray-500">{title}</p>
      <h3 className="text-3xl font-bold">{value}</h3>
    </div>
  );
}