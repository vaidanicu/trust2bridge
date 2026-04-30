"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getBasket, saveBasket, BasketItem } from "@/lib/basket";

export default function RequestBasketPage({ dict, lang }: { dict: any, lang: string }) {
  const [items, setItems] = useState<BasketItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Verificare de siguranță pentru a preveni erorile dacă dicționarul nu e încărcat
  if (!dict || !dict.basket) return null;

  useEffect(() => {
    const token = localStorage.getItem("trustbridge_token");
    if (!token) {
      window.location.href = `/${lang}/login`;
      return;
    }
    
    // Inițializăm produsele cu valori implicite pentru câmpurile de formular
    const rawItems = getBasket().map((item: any) => ({
      ...item,
      quantity: item.quantity || 1,
      unit: item.unit || "Stück",
      delivery_location: item.delivery_location || "",
      desired_date: item.desired_date || "",
      customer_note: item.customer_note || ""
    }));
    setItems(rawItems);
  }, [lang]);

  const updateItem = (id: number, field: keyof BasketItem, value: any) => {
    const updated = items.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    setItems(updated);
    saveBasket(updated);
  };

  const removeItem = (id: number) => {
    const updated = items.filter((item) => item.id !== id);
    setItems(updated);
    saveBasket(updated);
    window.dispatchEvent(new Event("trustbridge-basket-updated"));
  };

  const submitRequest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (items.length === 0) {
      alert(dict.basket.alert_empty);
      return;
    }

    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    const payload = {
      customer_name: formData.get("name"),
      company: formData.get("company"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      delivery_country: formData.get("country"),
      project_description: formData.get("description"),
      transport_needed: formData.get("transport"),
      confidentiality: formData.get("confidentiality"),
      items,
      services: formData.getAll("services"),
      lang: lang
    };

    try {
      const res = await fetch("https://trustbridgeb2b.com/backend/wp-json/trustbridge/v1/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("trustbridge_token")}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        alert(dict.basket.alert_success + (data.request_id || ""));
        localStorage.removeItem("trustbridge_basket");
        window.dispatchEvent(new Event("trustbridge-basket-updated"));
        setItems([]);
        window.location.href = `/${lang}/dashboard`;
      } else {
        alert(data.message || dict.basket.alert_error);
      }
    } catch {
      alert(dict.basket.alert_conn_error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f4f6f8] text-slate-900 pb-20">
      {/* HEADER SECTION */}
      <section className="bg-[#00695c] px-6 py-10 text-white">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-4xl font-black uppercase tracking-tight italic">
            {dict.basket.title_main}
          </h1>
          <p className="mt-2 text-sm font-medium text-white/90">
            {dict.basket.subtitle_main}
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 py-10 lg:grid-cols-[1fr_420px]">
        
        {/* LEFT COLUMN: POSITIONS */}
        <div className="space-y-6">
          <div className="rounded-2xl border-2 border-slate-900 bg-white p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#108280]">{dict.basket.badge_positions}</p>
                <h2 className="text-3xl font-black text-slate-900">{dict.basket.title_positions}</h2>
              </div>
              <Link href={`/${lang}/marketplace`} className="rounded-xl border-2 border-slate-900 px-6 py-2 text-xs font-black uppercase tracking-tight text-slate-900 hover:bg-slate-50 transition-all">
                {dict.basket.btn_more}
              </Link>
            </div>

            {items.length === 0 ? (
              <div className="py-10 text-center font-bold text-slate-400 italic">{dict.basket.empty_msg}</div>
            ) : (
              <div className="space-y-8">
                {items.map((item) => (
                  <div key={item.id} className="rounded-3xl border-2 border-slate-900 p-8">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="text-2xl font-black text-slate-900">{item.title}</h3>
                        <div className="mt-2 text-xs font-bold text-slate-400 leading-relaxed">
                          {dict.basket.label_id}: {item.id} · {dict.basket.label_type}: {item.type || 'product'}<br />
                          {dict.basket.label_supplier}: {item.supplier_name || 'TrustBridge'} · {dict.basket.label_country}: {item.country || '-'}<br />
                          {dict.basket.label_category}: {item.category || '-'}
                        </div>
                        <p className="mt-2 text-sm font-black text-orange-500 uppercase tracking-wide">
                          {dict.common.price_on_request}
                        </p>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="rounded-lg bg-red-50 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-red-600 border border-red-100 hover:bg-red-100 transition-colors">
                        {dict.basket.btn_remove}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{dict.basket.label_qty}</label>
                        <input type="number" value={item.quantity} onChange={(e) => updateItem(item.id, "quantity", e.target.value)} className="w-full rounded-2xl border-2 border-slate-900 p-4 text-lg font-bold outline-none focus:ring-2 ring-[#108280]/20" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{dict.basket.label_unit}</label>
                        <select value={item.unit} onChange={(e) => updateItem(item.id, "unit", e.target.value)} className="w-full appearance-none rounded-2xl border-2 border-slate-900 p-4 text-lg font-bold outline-none bg-white">
                          <option value="Stück">{dict.basket.units.pcs}</option>
                          <option value="kg">kg</option>
                          <option value="Paletten">{dict.basket.units.pallets}</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{dict.basket.label_delivery_loc}</label>
                        <input type="text" placeholder={dict.basket.placeholder_loc} value={item.delivery_location} onChange={(e) => updateItem(item.id, "delivery_location", e.target.value)} className="w-full rounded-2xl border-2 border-slate-900 p-4 font-bold outline-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{dict.basket.label_date}</label>
                        <input type="date" value={item.desired_date} onChange={(e) => updateItem(item.id, "desired_date", e.target.value)} className="w-full rounded-2xl border-2 border-slate-900 p-4 font-bold outline-none" />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{dict.basket.label_notes}</label>
                        <textarea rows={3} placeholder={dict.basket.placeholder_notes} value={item.customer_note} onChange={(e) => updateItem(item.id, "customer_note", e.target.value)} className="w-full rounded-2xl border-2 border-slate-900 p-4 font-bold outline-none resize-none" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* OPTIONAL SERVICES SECTION */}
          <div className="rounded-2xl border-2 border-slate-900 bg-white p-8 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-widest text-[#108280] mb-2">{dict.basket.badge_optional}</p>
            <h2 className="text-2xl font-black text-slate-900 mb-6">{dict.basket.title_optional}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dict.basket.services.map((service: string) => (
                <label key={service} className="flex items-center gap-3 text-sm font-bold text-slate-600 cursor-pointer">
                  <input type="checkbox" name="services" value={service} className="w-4 h-4 rounded border-2 border-slate-900 accent-[#108280]" />
                  {service}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: FORM */}
        <aside className="h-fit space-y-6 lg:sticky lg:top-10">
          <div className="rounded-2xl border-2 border-slate-900 bg-white p-8 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-widest text-[#108280] mb-2">{dict.basket.badge_send}</p>
            <h2 className="text-3xl font-black text-slate-900 mb-8">{dict.basket.title_form}</h2>

            <form onSubmit={submitRequest} className="space-y-5">
              <input name="name" required placeholder={dict.basket.ph_name} className="w-full rounded-2xl border-2 border-slate-900 p-4 font-bold outline-none" />
              <input name="company" required placeholder={dict.basket.ph_company} className="w-full rounded-2xl border-2 border-slate-900 p-4 font-bold outline-none" />
              <input name="email" required type="email" placeholder={dict.basket.ph_email} className="w-full rounded-2xl border-2 border-slate-900 p-4 font-bold outline-none" />
              <input name="phone" placeholder={dict.basket.ph_phone} className="w-full rounded-2xl border-2 border-slate-900 p-4 font-bold outline-none" />
              <input name="country" required placeholder={dict.basket.ph_country} className="w-full rounded-2xl border-2 border-slate-900 p-4 font-bold outline-none" />
              
              <textarea name="description" rows={4} placeholder={dict.basket.ph_desc} className="w-full rounded-2xl border-2 border-slate-900 p-4 font-bold outline-none resize-none" />

              <select name="transport" className="w-full appearance-none rounded-2xl border-2 border-slate-900 p-4 font-bold outline-none bg-white">
                {dict.basket.transport_opts.map((opt: any) => (
                  <option key={opt.val} value={opt.val}>{opt.label}</option>
                ))}
              </select>

              <select name="confidentiality" className="w-full appearance-none rounded-2xl border-2 border-slate-900 p-4 font-bold outline-none bg-white">
                {dict.basket.conf_opts.map((opt: any) => (
                  <option key={opt.val} value={opt.val}>{opt.label}</option>
                ))}
              </select>

              <label className="flex items-start gap-3 text-[10px] font-bold text-slate-500 cursor-pointer">
                <input type="checkbox" required className="mt-1 w-4 h-4 rounded border-2 border-slate-900 accent-[#108280]" />
                {dict.basket.privacy_label}
              </label>

              <button disabled={loading || items.length === 0} className="w-full rounded-2xl bg-[#108280] py-5 text-lg font-black uppercase tracking-widest text-white hover:bg-[#0b5f5d] transition-all">
                {loading ? dict.basket.btn_sending : dict.basket.btn_send}
              </button>

              <p className="text-[10px] font-bold leading-relaxed text-slate-400 text-center px-4">
                {dict.basket.footer_info}
              </p>
            </form>
          </div>
        </aside>
      </section>
    </main>
  );
}