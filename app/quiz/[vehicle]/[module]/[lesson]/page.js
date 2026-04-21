"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "../../../../../lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function QuizPage() {
  const { vehicle, module, lesson } = useParams();

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        // Use the Firestore names exactly as-is
        console.log("Fetching quiz for path:", vehicle, module, lesson);

        const quizRef = collection(
          db,
          "Courses",
          vehicle,       // Course document ID (e.g., "Tipper Trailer")
          "Modules",
          module,        // Module document ID (e.g., "Material Processing")
          "Lesson",
          lesson,        // Lesson document ID (e.g., "LVD Bending Machine")
          "quiz"         // Quiz collection under the lesson
        );

        const snap = await getDocs(quizRef);

        console.log("Quiz documents found:", snap.size);

        if (snap.size === 0) {
          console.warn("❌ No quiz found — make sure document IDs match Firestore exactly");
        }

        const data = snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setQuestions(data);
      } catch (err) {
        console.error("Error loading quiz:", err);
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
          ❌ No quiz found — check Firestore path and document IDs
        </div>
      ) : (
        questions.map(q => (
          <div key={q.id} style={{ padding: 10, border: "1px solid black", margin: 10 }}>
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
