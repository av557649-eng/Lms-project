"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "../../../../../lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function QuizPage() {
  const params = useParams();

  const vehicle = decodeURIComponent(params.vehicle || "");
  const module = decodeURIComponent(params.module || "");
  const lesson = decodeURIComponent(params.lesson || "");

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        console.log("PATH CHECK:");
        console.log(vehicle, module, lesson);

        const quizRef = collection(
          db,
          "Courses",
          vehicle,
          "Modules",
          module,
          "Lesson",
          lesson,
          "Quiz"   // ✅ FIXED: MUST BE "Quiz" (capital Q)
        );

        const snap = await getDocs(quizRef);

        console.log("Quiz count:", snap.size);

        const data = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setQuestions(data);
      } catch (err) {
        console.log("ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    if (vehicle && module && lesson) loadQuiz();
  }, [vehicle, module, lesson]);

  if (loading) return <div>Loading quiz...</div>;

  return (
    <div style={{ padding: 40 }}>
      <h2>Quiz for {lesson}</h2>

      {questions.length === 0 ? (
        <div style={{ color: "red" }}>
          ❌ No quiz found — check Firestore "Quiz" collection name (case sensitive)
        </div>
      ) : (
        questions.map((q) => (
          <div
            key={q.id}
            style={{
              padding: 10,
              border: "1px solid black",
              margin: 10,
            }}
          >
            <h4>{q.question}</h4>

            {q.options?.map((opt, i) => (
              <p key={i}>• {opt}</p>
            ))}

            <b>Answer:</b> {q.answer}
          </div>
        ))
      )}
    </div>
  );
}
