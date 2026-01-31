import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyASYa7sZK5UvjbJJpGkb-0go50FGi2klrE", 
  authDomain: "levelingo-8d2fe.firebaseapp.com",
  projectId: "levelingo-8d2fe",
  storageBucket: "levelingo-8d2fe.firebasestorage.app",
  messagingSenderId: "560719928541",
  appId: "1:560719928541:web:42510807c95c9cee378f34",
  measurementId: "G-PMHSR21GT4"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
