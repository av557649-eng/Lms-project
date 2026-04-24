"use client";

export default function ProgressBar({ value, total }) {
  const percentage = total ? (value / total) * 100 : 0;

  return (
    <div style={{ width: "100%", background: "#eee", height: 20 }}>
      <div
        style={{
          width: `${percentage}%`,
          background: "green",
          height: "100%"
        }}
      />
    </div>
  );
}
