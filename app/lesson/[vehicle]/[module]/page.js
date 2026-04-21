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

  // ✅ FIX: remove encoding issues safely
const courseId = decodeURIComponent(vehicle || "");
const moduleId = decodeURIComponent(module || "");
  
  useEffect(() => {
    const load = async () => {
      try {
        console.log("COURSE:", courseId);
        console.log("MODULE:", moduleId);

        const snap = await getDocs(
          collection(
            db,
            "Courses",
            courseId,
            "Modules",
            moduleId,
            "Lesson" // ⚠️ MUST MATCH FIRESTORE EXACTLY
          )
        );

        console.log("DOC COUNT:", snap.size);

        snap.docs.forEach(doc => {
          console.log("DOC:", doc.id);
        });

        setLessons(
          snap.docs.map(d => ({
            id: d.id,
            ...d.data()
          }))
        );
      } catch (err) {
        console.log("FIRESTORE ERROR:", err);
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
          ❌ No lessons found in Firestore
          <br />
          👉 Check collection name: "Lesson"
        </div>
      ) : (
        lessons.map(l => (
          <div
            key={l.id}
            onClick={() =>
              router.push(`/lesson-view/${courseId}/${moduleId}/${l.id}`)
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
