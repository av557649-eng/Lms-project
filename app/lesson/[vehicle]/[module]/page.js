"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "../../../../lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function LessonPage() {
  const { vehicle, module } = useParams();
  const router = useRouter();
  const [lessons, setLessons] = useState([]);
   if (!vehicle || !module) return <div>Loading...</div>;
  
  const courseId = decodeURIComponent(vehicle);
  const moduleId = decodeURIComponent(module);

  useEffect(() => {
    const load = async () => {
      const snap = await getDocs(
        collection(db, "Courses", courseId, "Modules", moduleId, "Lesson")
      );

      setLessons(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    };

    if (vehicle && module) load();
  }, [vehicle, module]);

  return (
    <div style={{ padding: 40 }}>
      <h2>{moduleId}</h2>

      {lessons.map(l => (
        <div
          key={l.id}
          onClick={() =>
            router.push(
              `/quiz/${encodeURIComponent(vehicle)}/${encodeURIComponent(module)}/${encodeURIComponent(l.id)}`
            )
          }
          style={{ padding: 10, border: "1px solid gray", margin: 10, cursor: "pointer" }}
        >
          {l.title}
        </div>
      ))}
    </div>
  );
}
