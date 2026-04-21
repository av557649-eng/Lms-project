"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "../../../../../lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function QuizPage() {
  const { vehicle, module, lesson } = useParams();

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState({}); // track answers

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const ref = collection(
          db,
          "Courses",
          vehicle,
          "Modules",
          module,
          "Lesson",
          lesson,
          "Quiz"
        );

        const snap = await getDocs(ref);

        const data = snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setQuestions(data);
      } catch (err) {
        console.log("Quiz error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (vehicle && module && lesson) loadQuiz();
  }, [vehicle, module, lesson]);

  function handleSelect(qId, option, correctAnswer) {
    setSelected(prev => ({
      ...prev,
      [qId]: option
    }));
  }

  if (loading) return <div>Loading quiz...</div>;

  if (questions.length === 0) {
    return (
      <div style={{ padding: 40, color: "red" }}>
        ❌ No quiz found — check Firestore structure
      </div>
    );
  }

  return (
    <div style={{ padding: 40 }}>
      <h2>Quiz for {lesson}</h2>

      {questions.map((q) => {
        const options = Array.isArray(q.options)
          ? q.options
          : typeof q.options === "string"
          ? q.options.split(",")
          : [];

        return (
          <div
            key={q.id}
            style={{
              border: "1px solid black",
              margin: 20,
              padding: 20
            }}
          >
            <h3>{q.question}</h3>

            {options.map((opt, i) => {
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
                    margin: 5,
                    border: "1px solid gray",
                    cursor: "pointer",
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
