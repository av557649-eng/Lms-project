"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "../../../../../lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function QuizPage() {
  const params = useParams();

  const courseId = decodeURIComponent(params.vehicle || "");
  const moduleId = decodeURIComponent(params.module || "");
  const lessonId = decodeURIComponent(params.lesson || "");

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        console.log("PATH:");
        console.log(courseId, moduleId, lessonId);

        // ✅ IMPORTANT FIX: "Quiz" (capital Q)
        const quizRef = collection(
          db,
          "Courses",
          courseId,
          "Modules",
          moduleId,
          "Lesson",
          lessonId,
          "Quiz"
        );

        const snap = await getDocs(quizRef);

        console.log("Quiz count:", snap.size);

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

    if (courseId && moduleId && lessonId) loadQuiz();
  }, [courseId, moduleId, lessonId]);

  if (loading) return <div>Loading quiz...</div>;

  if (questions.length === 0) {
    return (
      <div style={{ padding: 40, color: "red" }}>
        ❌ No quiz found — CHECK "Quiz" collection name in Firestore (CASE SENSITIVE)
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  const handleOptionClick = (opt) => {
    setSelectedOption(opt);
  };

  const nextQuestion = () => {
    setSelectedOption(null);
    setCurrentIndex(prev =>
      prev + 1 < questions.length ? prev + 1 : prev
    );
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Quiz for {lessonId}</h2>

      {/* QUESTION */}
      <h3 style={{ marginBottom: 20 }}>
        {currentIndex + 1}. {currentQuestion.question}
      </h3>

      {/* OPTIONS */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {currentQuestion.options?.map((opt, i) => {
          let bg = "white";

          if (selectedOption) {
            if (opt === currentQuestion.answer) {
              bg = "#c8f7c5"; // green correct
            } else if (opt === selectedOption) {
              bg = "#f8c8c8"; // red wrong
            }
          }

          return (
            <div
              key={i}
              onClick={() => !selectedOption && handleOptionClick(opt)}
              style={{
                padding: 12,
                border: "1px solid black",
                cursor: selectedOption ? "default" : "pointer",
                backgroundColor: bg
              }}
            >
              {opt}
            </div>
          );
        })}
      </div>

      {/* NEXT BUTTON */}
      {selectedOption && currentIndex + 1 < questions.length && (
        <button
          onClick={nextQuestion}
          style={{ marginTop: 20, padding: "10px 15px" }}
        >
          Next Question
        </button>
      )}

      {/* FINISH */}
      {selectedOption && currentIndex + 1 === questions.length && (
        <div style={{ marginTop: 20, color: "blue", fontWeight: "bold" }}>
          🎉 Quiz Completed!
        </div>
      )}
    </div>
  );
}
