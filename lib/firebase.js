import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDWrYx9FepY38YopTkXYYQY9qcRtHPXZ10",
  authDomain: "lms-system-al-shirawi.firebaseapp.com",
  projectId: "lms-system-al-shirawi",
  storageBucket: "lms-system-al-shirawi.firebasestorage.app",
  messagingSenderId: "796641060702",
  appId: 1:796641060702:"web:bb0420321f7b9e408d11cf"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(firebaseConfig);
export const db = getFirestore(firebaseConfig);
