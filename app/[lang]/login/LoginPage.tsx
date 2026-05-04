"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const WP_API  = "https://trustbridgeb2b.com/backend/wp-json";
const TB_API  = "https://trustbridgeb2b.com/backend/wp-json/trustbridge/v1";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 zile

export default function LoginPage({ dict, lang }: { dict: any; lang: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  if (!dict || !dict.login) return null;

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    try {
      // ── 1. Autentificare JWT ─────────────────────────────────────────────────
      const res  = await fetch(`${WP_API}/jwt-auth/v1/token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.get("username"),
          password: formData.get("password"),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.token) {
        setError(dict.login.error_msg);
        setLoading(false);
        return;
      }

      // ── 2. Salvăm token-ul ───────────────────────────────────────────────────
      localStorage.setItem("trustbridge_token", data.token);

      // ── 3. Fetch /me pentru a obține rolul real din WordPress ────────────────
      const meRes = await fetch(`${TB_API}/me`, {
        headers: { Authorization: `Bearer ${data.token}` },
      });

      const meData = await meRes.json();

      // Salvăm datele complete ale userului (cu roles[])
      localStorage.setItem("trustbridge_user", JSON.stringify(meData));

      // ── 4. Setăm cookie-ul cu rolul — citit de middleware server-side ────────
      const role: string = Array.isArray(meData?.roles)
        ? meData.roles[0] ?? ""
        : (meData?.role ?? "");

      document.cookie = `tb_role=${role}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;

      // ── 5. Redirect ──────────────────────────────────────────────────────────
      router.push(`/${lang}/marketplace`);

    } catch {
      setError(dict.login.conn_error);
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg border border-gray-100 flex flex-col items-center">

        {/* LOGO */}
        <div className="mb-8 flex justify-center">
          <Image
            src="/poze/logo.jpeg"
            alt="TrustBridge Logo"
            width={180}
            height={60}
            priority
            className="object-contain"
          />
        </div>

        {/* TITLU */}
        <div className="text-center w-full">
          <h1 className="text-3xl font-black text-teal-900">{dict.login.title}</h1>
          <p className="mt-3 text-sm text-gray-500 leading-relaxed">{dict.login.subtitle}</p>
        </div>

        {/* FORMULAR */}
        <form onSubmit={handleLogin} className="mt-8 space-y-4 w-full">
          <input
            name="username"
            type="text"
            placeholder={dict.login.ph_username}
            required
            className="w-full rounded-xl border border-gray-200 p-4 text-sm outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-100 transition"
          />
          <input
            name="password"
            type="password"
            placeholder={dict.login.ph_password}
            required
            className="w-full rounded-xl border border-gray-200 p-4 text-sm outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-100 transition"
          />

          {error && (
            <p className="text-xs font-bold text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
              {error}
            </p>
          )}

          <button
            disabled={loading}
            type="submit"
            className="w-full rounded-xl bg-black py-4 font-black uppercase text-white shadow-md shadow-black/10 disabled:opacity-50 transition hover:bg-gray-800 active:scale-[0.98]"
          >
            {loading ? dict.login.btn_loading : dict.login.btn_submit}
          </button>

          <p className="text-center text-xs text-gray-400 mt-6">
            © 2024 TrustBridge B2B. All rights reserved.
          </p>
        </form>
      </div>
    </main>
  );
}