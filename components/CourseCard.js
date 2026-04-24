"use client";

export default function CourseCard({ title, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: 15,
        border: "1px solid black",
        margin: 10,
        cursor: "pointer",
        borderRadius: 8
      }}
    >
      <h3>{title}</h3>
    </div>
  );
}
