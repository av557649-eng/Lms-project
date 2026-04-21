"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "../../../../lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function LessonPage() {
  const { vehicle, module } = useParams();
  const router = useRouter();

  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  const courseId = vehicle;
  const moduleId = module;

  useEffect(() => {
    const load = async () => {
      try {
        console.log("COURSE:", courseId);
        console.log("MODULE:", moduleId);

        const path = [
          "Courses",
          courseId,
          "Modules",
          moduleId,
          "Lesson"
        ];

        console.log("PATH:", path.join(" / "));

        const snap = await getDocs(collection(db, ...path));

        console.log("DOC COUNT:", snap.size);

        snap.docs.forEach(doc => {
          console.log("DOC:", doc.id);
        });

        setLessons(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.log("ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    if (courseId && moduleId) load();
  }, [courseId, moduleId]);

  if (loading) return <div>Loading lessons...</div>;

  return (
    <div style={{ padding: 40 }}>
      <h2>{moduleId}</h2>

      {lessons.length === 0 ? (
        <div style={{ color: "red" }}>
          ❌ No lessons found
        </div>
      ) : (
        lessons.map(l => (
          <div
            key={l.id}
            onClick={() =>
              router.push(
                `/quiz/${encodeURIComponent(vehicle)}/${encodeURIComponent(module)}/${encodeURIComponent(l.id)}`
              )
            }
            style={{
              padding: 10,
              border: "1px solid black",
              margin: 10,
              cursor: "pointer"
            }}
          >
            {l.title || l.id}
          </div>
        ))
      )}
    </div>
  );
}
