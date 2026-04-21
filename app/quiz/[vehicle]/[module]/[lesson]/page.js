"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "../../../../../lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function QuizPage() {
  const { vehicle, module, lesson } = useParams();

  // Decode URL params to match Firestore document IDs
  const courseId = decodeURIComponent(vehicle || "");
  const moduleId = decodeURIComponent(module || "");
  const lessonId = decodeURIComponent(lesson || "");

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        console.log("Fetching quiz for path:", courseId, moduleId, lessonId);

        const quizRef = collection(
          db,
          "Courses",
          courseId,  // e.g., "Tipper Trailer"
          "Modules",
          moduleId,  // e.g., "Material Processing"
          "Lesson",
          lessonId,  // e.g., "LVD Bending Machine"
          "quiz"
        );

        const snap = await getDocs(quizRef);

        console.log("Quiz documents found:", snap.size);

        if (snap.size === 0) {
          console.warn("❌ No quiz found — check Firestore path and document IDs");
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

    if (courseId && moduleId && lessonId) loadQuiz();
  }, [courseId, moduleId, lessonId]);

  if (loading) return <div>Loading quiz...</div>;

  return (
    <div style={{ padding: 40 }}>
      <h2>Quiz for {lessonId}</h2>

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
