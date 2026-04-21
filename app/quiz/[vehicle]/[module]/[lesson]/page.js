"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "../../../../../lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function QuizPage() {
  const { vehicle, module, lesson } = useParams();
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const snap = await getDocs(
          collection(
            db,
            "Courses",
            vehicle,
            "Modules",
            module,
            "Lesson",
            lesson,
            "quiz"
          )
        );

        console.log("QUIZ DOC COUNT:", snap.size);

        const data = snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        console.log("QUIZ DATA:", data);

        setQuestions(data);
      } catch (err) {
        console.log("QUIZ ERROR:", err);
      }
    };

    if (vehicle && module && lesson) load();
  }, [vehicle, module, lesson]);

  return (
    <div style={{ padding: 40 }}>
      <h2>Quiz</h2>

      {questions.length === 0 ? (
        <p style={{ color: "red" }}>❌ No quiz questions found</p>
      ) : (
        questions.map((q, i) => (
          <div
            key={q.id}
            style={{ margin: 10, padding: 10, border: "1px solid black" }}
          >
            {/* TRY BOTH POSSIBLE FIELD NAMES */}
            <h4>{q.question || q.Question}</h4>

            {(q.options || q.Options)?.map((o, j) => (
              <p key={j}>• {o}</p>
            ))}

            <small>Answer: {q.answer || q.Answer}</small>
          </div>
        ))
      )}
    </div>
  );
}
