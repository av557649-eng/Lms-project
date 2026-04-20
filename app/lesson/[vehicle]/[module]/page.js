"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function LessonPage() {
  const { vehicle, module } = useParams();
  const router = useRouter();
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    const load = async () => {
      const snap = await getDocs(
        collection(
          db,
          "Courses",
          vehicle,
          "modules",
          module,
          "lessons"
        )
      );

      setLessons(
        snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
      );
    };

    if (vehicle && module) load();
  }, [vehicle, module]);

  return (
    <div style={{ padding: 40 }}>
      <h2>{module}</h2>

      {lessons.length === 0 && <p>No lessons found</p>}

      {lessons.map(lesson => (
        <div
          key={lesson.id}
          onClick={() =>
            router.push(
              `/quiz/${vehicle}/${module}/${lesson.id}`
            )
          }
          style={{
            padding: 15,
            margin: 10,
            border: "1px solid gray",
            cursor: "pointer"
          }}
        >
          {lesson.title || lesson.id}
        </div>
      ))}
    </div>
  );
}
