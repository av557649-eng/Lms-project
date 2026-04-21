"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "../../../../../lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function QuizPage() {
  const { vehicle, module, lesson } = useParams();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);

  const courseId = decodeURIComponent(vehicle || "");
  const moduleId = decodeURIComponent(module || "");
  const lessonId = decodeURIComponent(lesson || "");

  // Load quiz from Firestore
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
            "quiz"
          )
        );

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

    if (courseId && moduleId && lessonId) loadQuiz();
  }, [courseId, moduleId, lessonId]);

  if (loading) return <div>Loading quiz...</div>;
  if (questions.length === 0)
    return <div style={{ color: "red" }}>❌ No quiz found</div>;

  const currentQuestion = questions[currentIndex];

  const handleOptionClick = (opt) => {
    setSelectedOption(opt);
  };

  const nextQuestion = () => {
    setSelectedOption(null);
    setCurrentIndex(prev => (prev + 1 < questions.length ? prev + 1 : prev));
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Quiz for {lessonId}</h2>

      {/* Question */}
      <h3 style={{ marginBottom: 20 }}>
        {currentIndex + 1}. {currentQuestion.question}
      </h3>

      {/* Options */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {currentQuestion.options?.map((opt, i) => {
          let bg = "white";
          if (selectedOption) {
            if (opt === currentQuestion.answer) bg = "#d4edda"; // green
            else if (opt === selectedOption) bg = "#f8d7da"; // red
          }
          return (
            <div
              key={i}
              onClick={() => handleOptionClick(opt)}
              style={{
                padding: 10,
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

      {/* Next button */}
      {selectedOption && currentIndex + 1 < questions.length && (
        <button
          onClick={nextQuestion}
          style={{ marginTop: 20, padding: "8px 16px", cursor: "pointer" }}
        >
          Next Question
        </button>
      )}

      {/* Quiz finished */}
      {selectedOption && currentIndex + 1 === questions.length && (
        <div style={{ marginTop: 20, fontWeight: "bold", color: "blue" }}>
          ✅ Quiz Completed!
        </div>
      )}
    </div>
  );
}
