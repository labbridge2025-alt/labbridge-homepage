"use client";

import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import PermissionGuard from "@/components/PermissionGuard";

type StaffUser = {
  id: string;
  name: string;
  email: string;
  tempPassword?: string;
  role: "admin" | "staff";
  permissions: {
    inquiries: boolean;
    portfolio: boolean;
    products: boolean;
    popup: boolean;
    guide: boolean;
    users: boolean;
  };
};

const menuOptions = [
  ["inquiries", "문의관리"],
  ["portfolio", "포트폴리오"],
  ["products", "상품관리"],
  ["popup", "팝업관리"],
  ["guide", "가이드배너"],
  ["users", "직원관리"],
] as const;

export default function UsersPage() {
  const [users, setUsers] = useState<StaffUser[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [tempPassword, setTempPassword] = useState("");
  const [role, setRole] = useState<"admin" | "staff">("staff");

  const [permissions, setPermissions] = useState({
    inquiries: true,
    portfolio: false,
    products: false,
    popup: false,
    guide: false,
    users: false,
  });

  const loadUsers = async () => {
    const q = query(collection(db, "users"), orderBy("name", "asc"));
    const snapshot = await getDocs(q);

    const data = snapshot.docs.map((docItem) => ({
      id: docItem.id,
      ...(docItem.data() as Omit<StaffUser, "id">),
    }));

    setUsers(data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleAddUser = async () => {
    if (!name || !email || !tempPassword) {
      alert("이름, 이메일, 임시 비밀번호를 입력해주세요.");
      return;
    }

    await addDoc(collection(db, "users"), {
      name,
      email,
      tempPassword,
      role,
      permissions:
        role === "admin"
          ? {
              inquiries: true,
              portfolio: true,
              products: true,
              popup: true,
              guide: true,
              users: true,
            }
          : permissions,
    });

    setName("");
    setEmail("");
    setTempPassword("");
    setRole("staff");
    setPermissions({
      inquiries: true,
      portfolio: false,
      products: false,
      popup: false,
      guide: false,
      users: false,
    });

    await loadUsers();
    alert(
      "직원 정보가 저장되었습니다. Firebase Authentication에서 같은 이메일과 임시 비밀번호로 사용자 추가를 해주세요."
    );
  };

  const togglePermission = async (
    user: StaffUser,
    key: keyof StaffUser["permissions"]
  ) => {
    const nextPermissions = {
      ...user.permissions,
      [key]: !user.permissions?.[key],
    };

    await updateDoc(doc(db, "users", user.id), {
      permissions: nextPermissions,
    });

    await loadUsers();
  };

  const handleDelete = async (id: string) => {
    const ok = confirm("직원을 삭제할까요?");
    if (!ok) return;

    await deleteDoc(doc(db, "users", id));
    await loadUsers();
  };

  return (
    <PermissionGuard permission="users">
      <main className="min-h-screen bg-[#f4f6f8] p-6 lg:p-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <h1 className="text-4xl font-bold">직원 관리</h1>
            <p className="text-gray-500 mt-2">
              직원별 관리자 메뉴 접근 권한을 설정합니다.
            </p>
          </div>

          <div className="bg-white border rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">직원 추가</h2>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="이름"
                className="border rounded-xl px-4 py-4"
              />

              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일"
                className="border rounded-xl px-4 py-4"
              />

              <input
                value={tempPassword}
                onChange={(e) => setTempPassword(e.target.value)}
                placeholder="임시 비밀번호"
                className="border rounded-xl px-4 py-4"
              />

              <select
                value={role}
                onChange={(e) => setRole(e.target.value as "admin" | "staff")}
                className="border rounded-xl px-4 py-4"
              >
                <option value="staff">직원</option>
                <option value="admin">최고관리자</option>
              </select>
            </div>

            {role === "staff" && (
              <div className="flex flex-wrap gap-3 mb-6">
                {menuOptions.map(([key, label]) => (
                  <label
                    key={key}
                    className="border rounded-xl px-4 py-3 flex items-center gap-2"
                  >
                    <input
                      type="checkbox"
                      checked={permissions[key]}
                      onChange={() =>
                        setPermissions({
                          ...permissions,
                          [key]: !permissions[key],
                        })
                      }
                    />
                    {label}
                  </label>
                ))}
              </div>
            )}

            <button
              onClick={handleAddUser}
              className="bg-black text-white px-8 py-4 rounded-xl font-bold"
            >
              직원 추가
            </button>
          </div>

          <div className="grid gap-6">
            {users.map((user) => (
              <div key={user.id} className="bg-white border rounded-2xl p-8">
                <div className="flex justify-between gap-6 mb-6">
                  <div>
                    <h2 className="text-2xl font-bold">{user.name}</h2>
                    <p className="text-gray-500 mt-1">{user.email}</p>
                    <p className="text-sm text-gray-400 mt-1">
                      임시 비밀번호 : {user.tempPassword || "-"}
                    </p>

                    <span className="inline-block mt-3 px-3 py-1 rounded-lg bg-blue-50 text-blue-600 font-bold text-sm">
                      {user.role === "admin" ? "최고관리자" : "직원"}
                    </span>
                  </div>

                  <button
                    onClick={() => handleDelete(user.id)}
                    className="border border-red-300 text-red-500 px-5 py-3 rounded-xl h-fit"
                  >
                    삭제
                  </button>
                </div>

                <div className="flex flex-wrap gap-3">
                  {menuOptions.map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => togglePermission(user, key)}
                      className={`px-4 py-3 rounded-xl border text-sm font-bold ${
                        user.permissions?.[key]
                          ? "bg-black text-white border-black"
                          : "bg-white text-gray-400"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </PermissionGuard>
  );
}