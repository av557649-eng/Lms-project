"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "../../../../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function LessonView() {
  const params = useParams();
  const router = useRouter();

  // SAFE PARAM HANDLING
  const vehicle = params.vehicle ? decodeURIComponent(params.vehicle) : "";
  const module = params.module ? decodeURIComponent(params.module) : "";
  const lesson = params.lesson ? decodeURIComponent(params.lesson) : "";

  const [data, setData] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        console.log("FINAL PATH:", vehicle, module, lesson);

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
          console.log("DATA FOUND:", snap.data());
          setData(snap.data());
        } else {
          console.log("❌ No document found in Firestore");
          setData(false);
        }
      } catch (err) {
        console.log("Error:", err);
        setData(false);
      }
    };

    if (vehicle && module && lesson) load();
  }, [vehicle, module, lesson]);

  // LOADING STATE
  if (data === null) return <div>Loading video...</div>;

  // NOT FOUND STATE
  if (data === false) return <div>Lesson not found</div>;

  return (
    <div style={{ padding: 40 }}>
      <h2>{data.title}</h2>

      {/* VIDEO FIX (IMPORTANT) */}
      {data?.["Video URL"] ? (
        <video width="600" controls>
          <source src={data["Video URL"]} type="video/mp4" />
        </video>
      ) : (
        <p style={{ color: "red" }}>❌ Video URL missing in Firestore</p>
      )}

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
