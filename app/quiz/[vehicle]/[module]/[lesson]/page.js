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
        console.log("PATH:", vehicle, module, lesson);

        // Directly use the lesson name as-is
        const quizRef = collection(
          db,
          "Courses",
          vehicle,       // Tipper Trailer
          "Modules",
          module,        // Material Processing
          "Lesson",
          lesson,        // LVD Bending Machine (must match document ID exactly)
          "quiz"         // Collection under the lesson document
        );

        const snap = await getDocs(quizRef);

        console.log("Quiz documents found:", snap.size);

        if (snap.size === 0) {
          console.log("No quiz found — path mismatch");
        }

        const data = snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setQuestions(data);
      } catch (err) {
        console.log("Error loading quiz:", err);
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
        <div style={{ color: "red" }}>❌ No quiz found — check Firestore path and document IDs</div>
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
