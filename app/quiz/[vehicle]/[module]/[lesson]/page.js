"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "../../../../../lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function QuizPage() {
  const { vehicle, module, lesson } = useParams();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState({}); // track selected answers

  const courseId = decodeURIComponent(vehicle || "");
  const moduleId = decodeURIComponent(module || "");
  const lessonId = decodeURIComponent(lesson || "");

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const snap = await getDocs(
          collection(
            db,
            "Courses",
            courseId,
            "Modules",
            moduleId,
            "Lesson",
            lessonId,
            "Quiz"
          )
        );

        const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setQuestions(data);
      } catch (err) {
        console.log("Error loading quiz:", err);
      } finally {
        setLoading(false);
      }
    };

    if (courseId && moduleId && lessonId) loadQuiz();
  }, [courseId, moduleId, lessonId]);

  if (loading) return <div>Loading quiz...</div>;
  if (!questions.length) return <div style={{ color: "red" }}>❌ No quiz found</div>;

  const handleSelect = (qId, option) => {
    setSelected(prev => ({ ...prev, [qId]: option }));
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Quiz for {lessonId}</h2>

      {questions.map((q, i) => (
        <div key={q.id} style={{ margin: "20px 0" }}>
          <h4>{i + 1}. {q.question}</h4>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {q.options.map((opt, idx) => {
              const sel = selected[q.id];
              let bg = "white";

              if (sel) {
                if (sel === q.answer && sel === opt) bg = "#d4edda"; // green
                else if (sel === opt && sel !== q.answer) bg = "#f8d7da"; // red
                else bg = "white";
              }

              return (
                <button
                  key={idx}
                  onClick={() => !selected[q.id] && handleSelect(q.id, opt)}
                  style={{
                    padding: "10px",
                    border: "1px solid #ccc",
                    cursor: sel ? "default" : "pointer",
                    backgroundColor: bg
                  }}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
