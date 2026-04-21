"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "../../../../../lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function QuizPage() {
  const { vehicle, module, lesson } = useParams();

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState({}); // Track user answers

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        if (!vehicle || !module || !lesson) return;

        // Firestore path must exactly match your structure
        const quizRef = collection(
          db,
          "Courses",           // collection
          vehicle,             // document e.g., "Tipper Trailer"
          "Modules",           // collection
          module,              // document e.g., "Material Processing"
          "Lesson",            // collection
          lesson,              // document e.g., "CNC Laser Cutting"
          "Quiz"               // collection
        );

        const snap = await getDocs(quizRef);

        if (snap.empty) {
          console.log("❌ No quiz found — check Firestore path and document IDs");
          setQuestions([]);
          return;
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

    loadQuiz();
  }, [vehicle, module, lesson]);

  const handleSelect = (qId, option, correctAnswer) => {
    setSelected(prev => ({
      ...prev,
      [qId]: option
    }));
  };

  if (loading) return <div style={{ padding: 40 }}>Loading quiz...</div>;

  if (questions.length === 0) {
    return (
      <div style={{ padding: 40, color: "red" }}>
        ❌ No quiz found — check Firestore path and document IDs
      </div>
    );
  }

  return (
    <div style={{ padding: 40 }}>
      <h2>Quiz for {lesson}</h2>

      {questions.map(q => {
        // Ensure options is an array
        const opts = Array.isArray(q.options) ? q.options : [];

        return (
          <div
            key={q.id}
            style={{
              border: "1px solid black",
              padding: 20,
              marginBottom: 20
            }}
          >
            <h3>{q.question}</h3>

            {opts.map((opt, i) => {
              const isSelected = selected[q.id] === opt;
              const isCorrect = q.answer === opt;

              let bg = "white";
              if (isSelected) {
                bg = isCorrect ? "lightgreen" : "lightcoral";
              }

              return (
                <div
                  key={i}
                  onClick={() => handleSelect(q.id, opt, q.answer)}
                  style={{
                    padding: 10,
                    marginTop: 5,
                    cursor: "pointer",
                    border: "1px solid gray",
                    backgroundColor: bg
                  }}
                >
                  {opt}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
