"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "../../../../../lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function QuizPage() {
  const params = useParams();

  // Decode URL params safely
  const vehicle = params.vehicle ? decodeURIComponent(params.vehicle) : "";
  const module = params.module ? decodeURIComponent(params.module) : "";
  const lesson = params.lesson ? decodeURIComponent(params.lesson) : "";

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        console.log("QUIZ PATH:", vehicle, module, lesson);

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

        console.log("Questions found:", snap.size);
        snap.docs.forEach(doc => console.log("Question doc:", doc.id));

        setQuestions(snap.docs.map(d => d.data()));
      } catch (err) {
        console.error("Error loading quiz:", err);
      } finally {
        setLoading(false);
      }
    };

    if (vehicle && module && lesson) load();
  }, [vehicle, module, lesson]);

  if (loading) return <div>Loading quiz...</div>;

  if (questions.length === 0)
    return <div style={{ color: "red" }}>❌ No questions found for this lesson</div>;

  return (
    <div style={{ padding: 40 }}>
      <h2>Quiz - {lesson}</h2>

      {questions.map((q, i) => (
        <div
          key={i}
          style={{
            margin: 10,
            padding: 10,
            border: "1px solid black",
            borderRadius: 4
          }}
        >
          <h4>{q.question}</h4>
          {q.options?.map((o, j) => (
            <p key={j}>• {o}</p>
          ))}
        </div>
      ))}
    </div>
  );
}
