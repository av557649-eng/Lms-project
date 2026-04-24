import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

export const getModules = async (courseId) => {
  try {
    const snap = await getDocs(
      collection(db, "Courses", courseId, "Modules")
    );

    return snap.docs.map(doc => ({
      id: doc.id
    }));
  } catch (err) {
    console.error("Error fetching modules:", err);
    return [];
  }
};
