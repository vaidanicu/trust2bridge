"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const WP_API = "https://trustbridgeb2b.com/backend/wp-json";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    const res = await fetch(`${WP_API}/jwt-auth/v1/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: formData.get("username"),
        password: formData.get("password"),
      }),
    });

    const data = await res.json();

    if (!res.ok || !data.token) {
      setError("Login fehlgeschlagen. Bitte prüfen Sie Ihre Zugangsdaten.");
      setLoading(false);
      return;
    }

    localStorage.setItem("trustbridge_token", data.token);
    localStorage.setItem("trustbridge_user", JSON.stringify(data));

    router.push("/marketplace");
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow">
        <h1 className="text-3xl font-black text-teal-900">TrustBridge Login</h1>
        <p className="mt-2 text-gray-500">
          Bitte melden Sie sich an, um Anfragen zu senden.
        </p>

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <input
            name="username"
            placeholder="E-Mail oder Benutzername"
            required
            className="w-full rounded-lg border p-3"
          />

          <input
            name="password"
            type="password"
            placeholder="Passwort"
            required
            className="w-full rounded-lg border p-3"
          />

          {error && <p className="text-sm font-bold text-red-600">{error}</p>}

          <button
            disabled={loading}
            className="w-full rounded-xl bg-black py-4 font-black uppercase text-white disabled:opacity-50"
          >
            {loading ? "Login..." : "Einloggen"}
          </button>
        </form>
      </div>
    </main>
  );
}