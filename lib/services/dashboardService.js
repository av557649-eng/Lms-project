import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

export const getCourses = async () => {
  try {
    const snap = await getDocs(collection(db, "Courses"));

    return snap.docs.map(doc => ({
      id: doc.id
    }));
  } catch (err) {
    console.error("Error fetching courses:", err);
    return [];
  }
};
