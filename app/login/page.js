"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errore, setErrore] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrore("");

    try {
      const res = await api.post("/login", { username, password });
      console.log("✅ Login riuscito", res.data);
      window.location.href = "/"; // forza reload completo
    } catch (err) {
      console.error("❌ Login fallito:", err);
      setErrore("Credenziali non valide.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm"
      >
        <h1 className="text-xl font-bold mb-4 text-center text-blue-800">
          Login Utente
        </h1>

        <input
          type="text"
          placeholder="Username"
          className="w-full mb-2 p-2 border rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {errore && <p className="text-red-600 text-sm mb-2">{errore}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Accedi
        </button>
      </form>
    </div>
  );
}