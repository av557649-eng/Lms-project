"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "../../../../../lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function QuizPage() {
  const { vehicle, module, lesson } = useParams();
  const courseId = decodeURIComponent(vehicle);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const load = async () => {
    const snap = await getDocs(
      collection(db, "Courses", courseId, "Modules", module, "Lessons", lesson, "quiz")
);

      setQuestions(snap.docs.map(d => d.data()));
    };

    if (vehicle && module && lesson) load();
  }, [vehicle, module, lesson]);

  return (
    <div style={{ padding: 40 }}>
      <h2>Quiz</h2>

      {questions.map((q, i) => (
        <div key={i} style={{ margin: 10, padding: 10, border: "1px solid black" }}>
          <h4>{q.question}</h4>
          {q.options?.map((o, j) => (
            <p key={j}>• {o}</p>
          ))}
        </div>
      ))}
    </div>
  );
}
