"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "../../../../../lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function QuizPage() {
  const params = useParams();

  // ✅ IMPORTANT FIX: decode Firestore IDs properly
  const vehicle = decodeURIComponent(params.vehicle || "");
  const module = decodeURIComponent(params.module || "");
  const lesson = decodeURIComponent(params.lesson || "");

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState({});

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        console.log("DECODED PATH:");
        console.log(vehicle, module, lesson);

        // ⚡ FIX HERE: Use "quiz" lowercase to match your Firestore
        const quizRef = collection(
          db,
          "Courses",
          vehicle,   // Tipper Trailer
          "Modules",
          module,    // Material Processing
          "Lesson",
          lesson,    // e.g., CNC Laser Cutting
          "Quiz"     // ✅ lowercase 'quiz' matches Firestore
        );

        const snap = await getDocs(quizRef);

        console.log("DOC COUNT:", snap.size);

        if (snap.empty) {
          console.log("❌ STILL EMPTY - check Firestore structure");
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
        console.log("ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    if (vehicle && module && lesson) loadQuiz();
  }, [vehicle, module, lesson]);

  const handleSelect = (qId, opt, answer) => {
    setSelected(prev => ({
      ...prev,
      [qId]: opt
    }));
  };

  if (loading) return <div style={{ padding: 40 }}>Loading quiz...</div>;

  if (questions.length === 0) {
    return (
      <div style={{ padding: 40, color: "red" }}>
        ❌ No quiz found<br /><br />
        Check Firestore structure:
        <br />
        Courses → {vehicle} → {module} → {lesson} → quiz
      </div>
    );
  }

  return (
    <div style={{ padding: 40 }}>
      <h2>Quiz for {lesson}</h2>

      {questions.map(q => {
        const opts = Array.isArray(q.options) ? q.options : [];

        return (
          <div key={q.id} style={{ border: "1px solid black", margin: 20, padding: 20 }}>
            <h3>{q.question}</h3>

            {opts.map((opt, i) => {
              const selectedOpt = selected[q.id];
              const isCorrect = q.answer === opt;

              let bg = "white";

              if (selectedOpt) {
                bg = selectedOpt === opt
                  ? (isCorrect ? "lightgreen" : "lightcoral")
                  : "white";
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
