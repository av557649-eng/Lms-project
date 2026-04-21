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
  const [selected, setSelected] = useState({}); // store selected option index per question

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const quizRef = collection(
          db,
          "Courses",
          vehicle,
          "Modules",
          module,
          "Lesson",
          lesson,
          "Quiz"
        );

        const snap = await getDocs(quizRef);

        if (snap.empty) {
          setQuestions([]);
          setLoading(false);
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

    if (vehicle && module && lesson) loadQuiz();
  }, [vehicle, module, lesson]);

  const handleSelect = (qId, idx) => {
    setSelected(prev => ({
      ...prev,
      [qId]: idx
    }));
  };

  // ✅ ADDED ONLY THIS
  const calculateScore = () => {
    let correct = 0;

    questions.forEach(q => {
      const correctIndex = parseInt(q.Answer, 10);
      const selectedIndex = selected[q.id];

      if (selectedIndex === correctIndex) {
        correct++;
      }
    });

    return correct;
  };

  if (loading) return <div style={{ padding: 40 }}>Loading quiz...</div>;

  if (questions.length === 0) {
    return (
      <div style={{ padding: 40, color: "red" }}>
        ❌ No quiz found
        <br />
        Check Firestore structure:
        <br />
        Courses → {vehicle} → {module} → {lesson} → Quiz
      </div>
    );
  }

  return (
    <div style={{ padding: 40 }}>
      <h2>Quiz for {lesson}</h2>

      {questions.map(q => {
        const opts = q.Options || [];
        const correctIndex = parseInt(q.Answer, 10);
        const selectedIndex = selected[q.id];

        return (
          <div key={q.id} style={{ border: "1px solid black", margin: 20, padding: 20 }}>
            <h3>{q.Question || "❌ Missing question field"}</h3>

            {opts.map((opt, i) => {
              let bg = "white";

              if (selectedIndex !== undefined) {
                if (i === selectedIndex) {
                  bg = i === correctIndex ? "lightgreen" : "lightcoral";
                } else if (i === correctIndex) {
                  bg = "lightgreen";
                }
              }

              return (
                <div
                  key={i}
                  onClick={() => handleSelect(q.id, i)}
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

      {/* ✅ ADDED SCORE DISPLAY ONLY */}
      <div style={{ marginTop: 30, fontSize: 22, fontWeight: "bold" }}>
        🎯 Score: {calculateScore()} / {questions.length} correct
      </div>
    </div>
  );
}
