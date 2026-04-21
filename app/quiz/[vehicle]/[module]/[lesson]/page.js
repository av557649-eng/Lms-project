"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "../../../../../lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function QuizPage() {
  const params = useParams();

  const vehicle = params.vehicle;
  const module = params.module;
  const lesson = params.lesson;

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        console.log("PATH CHECK:", vehicle, module, lesson);

        const ref = collection(
          db,
          "Courses",
          vehicle,
          "Modules",
          module,
          "Lesson",
          lesson,
          "quiz"
        );

        const snap = await getDocs(ref);

        console.log("DOC COUNT:", snap.size);

        const data = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        setQuestions(data);
      } catch (err) {
        console.log("ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    if (vehicle && module && lesson) load();
  }, [vehicle, module, lesson]);

  if (loading) return <div>Loading quiz...</div>;

  return (
    <div style={{ padding: 40 }}>
      <h2>Quiz</h2>

      {questions.length === 0 ? (
        <div style={{ color: "red" }}>
          ❌ No quiz found — Firestore path mismatch
        </div>
      ) : (
        questions.map((q) => (
          <div key={q.id} style={{ padding: 10, border: "1px solid black", margin: 10 }}>
            <h4>{q.question || q.Question}</h4>

            {(q.options || q.Options)?.map((o, i) => (
              <p key={i}>• {o}</p>
            ))}

            <b>Answer:</b> {q.answer || q.Answer}
          </div>
        ))
      )}
    </div>
  );
}
