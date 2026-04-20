"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function CoursePage() {
  const { vehicle } = useParams();
  const router = useRouter();
  const [modules, setModules] = useState([]);

  useEffect(() => {
    const load = async () => {
      const snap = await getDocs(
        collection(db, "Courses", vehicle, "modules")
      );

      setModules(
        snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
      );
    };

    if (vehicle) load();
  }, [vehicle]);

  return (
    <div style={{ padding: 40 }}>
      <h2>{vehicle}</h2>

      {modules.length === 0 && <p>No modules found</p>}

      {modules.map(mod => (
        <div
          key={mod.id}
          onClick={() =>
            router.push(`/lesson/${vehicle}/${mod.id}`)
          }
          style={{
            padding: 15,
            margin: 10,
            border: "1px solid black",
            cursor: "pointer"
          }}
        >
          {mod.title || mod.id}
        </div>
      ))}
    </div>
  );
}
