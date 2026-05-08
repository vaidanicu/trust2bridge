"use client";

import { useState } from "react";
import Link from "next/link";

const API_URL = "https://trustbridgeb2b.com/backend/wp-json/trustbridge/v1";

export default function RegisterPage({ dict, lang }: { dict: any, lang: string }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Verificare de siguranță pentru dicționar
  if (!dict || !dict.register) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const payload = {
  company: formData.get("company"),
  contact_name: formData.get("contact_name"),
  email: formData.get("email"),
  phone: formData.get("phone"),
  country: formData.get("country"),
  vat: formData.get("vat"),
  business_type: formData.get("business_type"),
  message: formData.get("message"),
  lang: lang, // ✅ adăugat
};

    try {
      const res = await fetch(`${API_URL}/register-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess(true);
      } else {
        alert(data.message || dict.register.alert_error);
      }
    } catch {
      alert(dict.register.alert_conn_error);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f4f6f8] px-6">
        <div className="w-full max-w-xl rounded-3xl border bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#108280]/10 text-3xl text-[#108280]">
            ✓
          </div>
          <p className="mt-6 text-xs font-black uppercase tracking-wider text-[#108280]">
            {dict.register.success_badge}
          </p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">
            {dict.register.success_title}
          </h1>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            {dict.register.success_desc}
          </p>
          <Link
            href={`/${lang}/login`}
            className="mt-8 inline-block rounded-xl bg-[#108280] px-6 py-3 text-sm font-black uppercase text-white hover:bg-[#0d6b69]"
          >
            {dict.register.btn_to_login}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f6f8] text-slate-900 pb-20">
      <section className="bg-gradient-to-r from-[#0b5f5d] via-[#108280] to-[#0a3f3e] px-6 py-12 text-white text-center">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs font-black uppercase tracking-widest text-white/70">
            {dict.register.badge}
          </p>
          <h1 className="mt-3 text-4xl font-black">
            {dict.register.title}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-white/80">
            {dict.register.subtitle}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-10">
        <div className="rounded-3xl border bg-white p-6 shadow-sm md:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <Input name="company" required placeholder={dict.register.ph_company} />
              <Input name="contact_name" required placeholder={dict.register.ph_contact} />
              <Input name="email" required type="email" placeholder={dict.register.ph_email} />
              <Input name="phone" placeholder={dict.register.ph_phone} />
              <Input name="country" required placeholder={dict.register.ph_country} />
              <Input name="vat" placeholder={dict.register.ph_vat} />
            </div>

            <select
              name="business_type"
              required
              className="w-full rounded-xl border p-3 text-sm outline-none focus:border-[#108280] bg-white"
            >
              <option value="">{dict.register.ph_business_type} *</option>
              {dict.register.business_options.map((opt: any) => (
                <option key={opt.val} value={opt.val}>{opt.label}</option>
              ))}
            </select>

            <textarea
              name="message"
              rows={4}
              placeholder={dict.register.ph_message}
              className="w-full rounded-xl border p-3 text-sm outline-none focus:border-[#108280]"
            />

            <label className="flex gap-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600 cursor-pointer">
              <input type="checkbox" required className="mt-1 accent-[#108280]" />
              <span>{dict.register.privacy_agreement}</span>
            </label>

            <button
              disabled={loading}
              className="w-full rounded-xl bg-slate-950 py-4 text-sm font-black uppercase tracking-wider text-white hover:bg-slate-800 disabled:opacity-50 transition-all"
            >
              {loading ? dict.register.btn_sending : dict.register.btn_submit}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

function Input({ name, placeholder, required, type = "text" }: any) {
  return (
    <input
      name={name}
      type={type}
      required={required}
      placeholder={placeholder}
      className="w-full rounded-xl border p-3 text-sm outline-none focus:border-[#108280]"
    />
  );
}