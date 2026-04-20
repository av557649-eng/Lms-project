"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Login</h2>

      <input placeholder="email" onChange={(e) => setEmail(e.target.value)} />
      <br /><br />

      <input type="password" placeholder="password" onChange={(e) => setPassword(e.target.value)} />
      <br /><br />

      <button onClick={login}>Login</button>
    </div>
  );
}
