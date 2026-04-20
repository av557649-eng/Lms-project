"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function QuizPage() {
  const { vehicle, module, lesson } = useParams();
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const load = async () => {
      const snap = await getDocs(
        collection(
          db,
          "Courses",
          vehicle,
          "modules",
          module,
          "lessons",
          lesson,
          "quiz"
        )
      );

      setQuestions(
        snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
      );
    };

    if (vehicle && module && lesson) load();
  }, [vehicle, module, lesson]);

  return (
    <div style={{ padding: 40 }}>
      <h2>Quiz</h2>

      {questions.length === 0 && <p>No quiz found</p>}

      {questions.map(q => (
        <div
          key={q.id}
          style={{
            padding: 15,
            margin: 10,
            border: "1px solid black"
          }}
        >
          <h4>{q.question}</h4>

          {q.options?.map((opt, i) => (
            <p key={i}>• {opt}</p>
          ))}
        </div>
      ))}
    </div>
  );
}
