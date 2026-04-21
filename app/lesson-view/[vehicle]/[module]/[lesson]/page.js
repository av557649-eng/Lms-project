"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "../../../../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function LessonView() {
  const { vehicle, module, lesson } = useParams();
  const router = useRouter();

  const [data, setData] = useState(null);

  useEffect(() => {
    const load = async () => {
      const ref = doc(
        db,
        "Courses",
        vehicle,
        "Modules",
        module,
        "Lesson",
        lesson
      );

      const snap = await getDoc(ref);

      if (snap.exists()) {
        setData(snap.data());
      }
    };

    if (vehicle && module && lesson) load();
  }, [vehicle, module, lesson]);

  if (!data) return <div>Loading video...</div>;

  return (
    <div style={{ padding: 40 }}>
      <h2>{data.title}</h2>

      <video width="600" controls>
        <source src={data["Video URL"]} />
      </video>

      <p>{data.description}</p>

      <button
        onClick={() =>
          router.push(`/quiz/${vehicle}/${module}/${lesson}`)
        }
        style={{ marginTop: 20 }}
      >
        Start Quiz
      </button>
    </div>
  );
}
