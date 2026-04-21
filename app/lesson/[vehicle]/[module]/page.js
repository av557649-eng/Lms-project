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

  // IMPORTANT: use raw params (Next already gives decoded values)
  const courseId = vehicle;
  const moduleId = module;

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        console.log("Course:", courseId);
        console.log("Module:", moduleId);

        const snap = await getDocs(
          collection(
            db,
            "Courses",
            courseId,
            "Modules",
            moduleId,
            "Lesson"
          )
        );

        console.log("Docs found:", snap.size);

        setLessons(
          snap.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          }))
        );
      } catch (err) {
        console.log("Firestore ERROR:", err);
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
          No lessons found in Firestore
        </div>
      ) : (
        lessons.map((l) => (
          <div
            key={l.id}
            onClick={() =>
              router.push(
                `/quiz/${vehicle}/${module}/${l.id}`
              )
            }
            style={{
              padding: 10,
              border: "1px solid black",
              margin: 10,
              cursor: "pointer",
            }}
          >
            {l.title}
          </div>
        ))
      )}
    </div>
  );
}
