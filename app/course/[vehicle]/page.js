"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "../../../lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function CoursePage() {
  const { vehicle } = useParams();
  const router = useRouter();
  const [modules, setModules] = useState([]);

  const courseId = decodeURIComponent(vehicle || "");

  useEffect(() => {
    const load = async () => {
      try {
        const snap = await getDocs(
          collection(db, "Courses", courseId, "Modules")
        );

        setModules(snap.docs.map(d => ({ id: d.id })));
      } catch (err) {
        console.log("Error loading modules:", err);
      }
    };

    if (courseId) load();
  }, [courseId]);

  return (
    <div style={{ padding: 40 }}>
      <h2>{courseId}</h2>

      {modules.map((m) => (
        <div
          key={m.id}
          onClick={() =>
            router.push(`/lesson/${vehicle}/${m.id}`)
          }
          style={{
            padding: 10,
            border: "1px solid black",
            margin: 10,
            cursor: "pointer"
          }}
        >
          {m.id}
        </div>
      ))}
    </div>
  );
}
