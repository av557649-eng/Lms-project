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
    const load = async () => {
      try {
        console.log("=== DEBUG START ===");
        console.log("Vehicle:", vehicle);
        console.log("Module:", module);
        console.log("Lesson:", lesson);

        const path = [
          "Courses",
          vehicle,
          "Modules",
          module,
          "Lesson",
          lesson,
          "quiz"
        ];

        console.log("FULL PATH:", path.join(" / "));

        const ref = collection(db, ...path);
        const snap = await getDocs(ref);

        console.log("DOC COUNT:", snap.size);

        snap.docs.forEach((doc) => {
          console.log("DOC ID:", doc.id);
          console.log("DOC DATA:", doc.data());
        });

        const data = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));

        setQuestions(data);
      } catch (err) {
        console.log("QUIZ ERROR:", err);
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

      <p style={{ color: "gray" }}>
        Course: {vehicle} <br />
        Module: {module} <br />
        Lesson: {lesson}
      </p>

      {questions.length === 0 ? (
        <div style={{ color: "red" }}>
          ❌ No quiz questions found (check console logs)
        </div>
      ) : (
        questions.map((q, i) => (
          <div
            key={q.id}
            style={{
              margin: 10,
              padding: 10,
              border: "1px solid black"
            }}
          >
            <h4>{q.question || q.Question}</h4>

            {(q.options || q.Options)?.map((o, j) => (
              <p key={j}>• {o}</p>
            ))}

            <p>
              <b>Answer:</b> {q.answer || q.Answer}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
