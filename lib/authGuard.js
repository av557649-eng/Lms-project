import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

const allowedUsers = [
  "technician1@test.com",
  "technician2@test.com",
  "technician3@test.com"
];

export function protectRoute(router) {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (!allowedUsers.includes(user.email)) {
      alert("Access Denied");
      router.push("/login");
    }
  });
}
