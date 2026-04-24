import { db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

export const saveProgress = async (userId, vehicle, module, lesson, score) => {
  try {
    const ref = doc(
      db,
      "progress",
      `${userId}_${vehicle}_${module}_${lesson}`
    );

    await setDoc(ref, {
      userId,
      vehicle,
      module,
      lesson,
      score,
      completed: true,
      timestamp: new Date()
    });
  } catch (err) {
    console.error("Error saving progress:", err);
  }
};

export const getProgress = async (userId) => {
  try {
    const ref = doc(db, "progress", userId);
    const snap = await getDoc(ref);

    return snap.exists() ? snap.data() : null;
  } catch (err) {
    console.error("Error getting progress:", err);
    return null;
  }
};
