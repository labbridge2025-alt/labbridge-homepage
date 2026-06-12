import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBVMkSn-NsN7YOeujBjY7VobTYfEOxNRIQ",
  authDomain: "labbridge-22fa0.firebaseapp.com",
  projectId: "labbridge-22fa0",
  storageBucket: "labbridge-22fa0.firebasestorage.app",
  messagingSenderId: "818871398849",
  appId: "1:818871398849:web:db3f263bad75d0b9c0bf40",
  measurementId: "G-E06KP8JWCR",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);