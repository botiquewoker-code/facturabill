"use client";

import { useState } from "react";
import { Amplify } from "aws-amplify";
import { signIn } from "aws-amplify/auth";
import awsconfig from "../../../aws-exports";
Amplify.configure(awsconfig);

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const entrar = async () => {
  try {
    await signIn({
      username: email,
      password: password,
    });

    alert("Inicio de sesión correcto");
    window.location.href = "/";
  } catch (error) {
    if (error.message.includes("already a signed in user")) {
      alert("Ya hay una sesión iniciada");
    } else {
      alert(error.message);
    }
  }
}

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-black">
          Iniciar sesión
        </h1>

        <input
          type="email"
          placeholder="Correo electrónico"
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded-lg p-3 mb-4 text-black placeholder-black bg-white"
        />

        <input
          type="password"
          placeholder="Contraseña"
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded-lg p-3 mb-4 text-black placeholder-black bg-white"
        />

        <button
          onClick={entrar}
          className="w-full bg-blue-600 text-white py-3 rounded-lg"
        >
          Entrar
        </button>
      </div>
    </div>
  );
}