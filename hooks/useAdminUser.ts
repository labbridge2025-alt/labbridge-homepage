"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "staff";
  permissions: {
    inquiries?: boolean;
    portfolio?: boolean;
    products?: boolean;
    popup?: boolean;
    guide?: boolean;
    users?: boolean;
  };
};

export function useAdminUser() {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);

      if (!user?.email) {
        setAdminUser(null);
        setLoading(false);
        return;
      }

      const q = query(
        collection(db, "users"),
        where("email", "==", user.email)
      );

      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        setAdminUser(null);
        setLoading(false);
        return;
      }

      const doc = snapshot.docs[0];

      setAdminUser({
        id: doc.id,
        ...(doc.data() as Omit<AdminUser, "id">),
      });

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return {
    firebaseUser,
    adminUser,
    loading,
  };
}