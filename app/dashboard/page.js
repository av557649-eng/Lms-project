"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [courses, setCourses] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      const snap = await getDocs(collection(db, "Courses"));
      setCourses(snap.docs.map(d => ({ id: d.id })));
    };
    load();
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h2>Courses</h2>

      {courses.map(c => (
        <div
          key={c.id}
          onClick={() => router.push(`/course/${c.id}`)}
          style={{ padding: 10, border: "1px solid black", margin: 10 }}
        >
          {c.id}
        </div>
      ))}
    </div>
  );
}
