"use client";

import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [courses, setCourses] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      const snap = await getDocs(collection(db, "Courses"));

      setCourses(
        snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
      );
    };

    load();
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h2>Courses</h2>

      {courses.length === 0 && <p>No courses found</p>}

      {courses.map(course => (
        <div
          key={course.id}
          onClick={() => router.push(`/course/${course.id}`)}
          style={{
            padding: 15,
            margin: 10,
            border: "1px solid #ccc",
            cursor: "pointer"
          }}
        >
          {course.title || course.id}
        </div>
      ))}
    </div>
  );
}
