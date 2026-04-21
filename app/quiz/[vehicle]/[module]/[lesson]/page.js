"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "../../../../../lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function QuizPage() {
  const { vehicle, module, lesson } = useParams();
  const [questions, setQuestions] = useState([]);

  const courseId = decodeURIComponent(vehicle || "");
  const moduleId = decodeURIComponent(module || "");
  const lessonId = decodeURIComponent(lesson || "");

  useEffect(() => {
    const load = async () => {
      const snap = await getDocs(
        collection(
          db,
          "Courses",
          courseId,
          "Modules",
          moduleId,
          "Lesson",
          lessonId,
          "quiz"
        )
      );

      setQuestions(snap.docs.map(d => d.data()));
    };

    if (courseId && moduleId && lessonId) load();
  }, [courseId, moduleId, lessonId]);

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
