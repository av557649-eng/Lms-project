"use client";

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDWrYx9FepY38YopTkXYYQY9qcRtHPXZ10",
  authDomain: "lms-system-al-shirawi.firebaseapp.com",
  projectId: "lms-system-al-shirawi",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
