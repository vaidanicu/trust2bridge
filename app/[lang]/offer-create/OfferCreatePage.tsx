"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API = "https://trustbridgeb2b.com/backend/wp-json/trustbridge/v1";

export default function OfferCreatePage({ dict, lang }: { dict: any, lang: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [offerType, setOfferType] = useState("ware");
  const [mainCat, setMainCat] = useState("Food");

  // Securitate și Verificare
  useEffect(() => {
    const token = localStorage.getItem("trustbridge_token");
    if (!token) { router.replace(`/${lang}/login`); }
  }, [lang, router]);

  const isWare = offerType === "ware" || offerType === "restposten";
  const isService = offerType === "service";

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.append("offer_type", offerType);

    try {
      const res = await fetch(`${API}/item-create`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("trustbridge_token")}` },
        body: formData,
      });
      if (res.ok) {
        alert(dict.offer.alert_success);
        router.refresh();
      }
    } catch (err) {
      alert("Error");
    } finally { setLoading(false); }
  }

  return (
    <main className="min-h-screen bg-[#f4f6f8] px-4 py-10 text-slate-900 font-sans">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] border-2 border-slate-900 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        
        {/* HEADER */}
        <header className="bg-[#108280] p-10 text-white border-b-2 border-slate-900">
          <h1 className="text-4xl font-black uppercase italic tracking-tight">{dict.offer.title}</h1>
          <p className="mt-2 text-white/80 font-bold">{dict.offer.subtitle}</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-12 p-8 md:p-12">
          
          {/* 1. Angebotsart */}
          <Block title={dict.offer.step1}>
            <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
              <OptionButton current={offerType} set={setOfferType} id="ware" label={dict.offer.type_ware} icon="📦" />
              <OptionButton current={offerType} set={setOfferType} id="service" label={dict.offer.type_service} icon="🛠️" />
              <OptionButton current={offerType} set={setOfferType} id="restposten" label={dict.offer.type_stock} icon="🏷️" />
              <OptionButton current={offerType} set={setOfferType} id="auction" label={dict.offer.type_auction} icon="🔨" />
            </div>
          </Block>

          {/* 2. Basisdaten */}
          <Block title={dict.offer.step2}>
            <div className="space-y-6">
              <Input name="title" required label={dict.offer.label_title} placeholder={dict.offer.ph_title} />
              <Textarea name="short_description" label={dict.offer.label_short_desc} maxLength={300} rows={2} />
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase text-slate-400">{dict.offer.label_desc} *</span>
                <textarea name="description" required rows={6} className="input-brutal w-full" />
              </div>
            </div>
          </Block>

          {/* 3. Kategorie */}
          <Block title={dict.offer.step3}>
            <div className="grid gap-6 md:grid-cols-2">
              <Field label={dict.offer.label_main_cat}>
                <select name="main_category" value={mainCat} onChange={(e) => setMainCat(e.target.value)} className="input-brutal">
                  {Object.keys(dict.offer.categories).map(cat => <option key={cat}>{cat}</option>)}
                </select>
              </Field>
              <Field label={dict.offer.label_sub_cat}>
                <select name="subcategory" className="input-brutal">
                  {(dict.offer.categories[mainCat] || []).map((sub: string) => <option key={sub}>{sub}</option>)}
                </select>
              </Field>
            </div>
          </Block>

          {/* 4. Produktdaten (Nur bei Waren) */}
          {isWare && (
            <Block title={dict.offer.step4_ware}>
              <div className="grid gap-6 md:grid-cols-2">
                <Input name="article_number" label={dict.offer.label_art_no} />
                <Input name="brand" label={dict.offer.label_brand} />
                <Input name="origin" label={dict.offer.label_origin} />
                <Field label={dict.offer.label_condition}>
                  <select name="condition" className="input-brutal">
                    {dict.offer.conditions.map((c: string) => <option key={c}>{c}</option>)}
                  </select>
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Input name="quantity" type="number" label={dict.offer.label_qty} />
                  <Field label={dict.offer.label_unit}>
                    <select name="unit" className="input-brutal">
                      {dict.offer.units.map((u: string) => <option key={u} value={u}>{u}</option>)}
                    </select>
                  </Field>
                </div>
                <Input name="moq" type="number" label={dict.offer.label_moq} />
              </div>
              <div className="mt-6 grid gap-6">
                <Textarea name="technical_specs" label={dict.offer.label_specs} rows={4} />
                <Textarea name="packaging" label={dict.offer.label_packaging} rows={3} placeholder="L x B x H, Gewicht, Verpackungsart..." />
              </div>
            </Block>
          )}

          {/* 5. Dienstleistungsdaten */}
          {isService && (
            <Block title={dict.offer.step4_service}>
              <div className="grid gap-6 md:grid-cols-2">
                <Field label={dict.offer.label_service_type}>
                  <select name="service_type" className="input-brutal">
                    {dict.offer.service_types.map((s: string) => <option key={s}>{s}</option>)}
                  </select>
                </Field>
                <CheckboxGrid title={dict.offer.label_area} name="service_area" items={["AT", "HU", "CH", "DE", "RO"]} />
                <Field label={dict.offer.label_mode}>
                  <select name="service_mode" className="input-brutal">
                    <option value="vor_ort">Vor Ort</option>
                    <option value="remote">Remote</option>
                    <option value="beides">Beides</option>
                  </select>
                </Field>
                <Input name="availability" label={dict.offer.label_availability} placeholder="z.B. ab sofort" />
                <Field label={dict.offer.label_billing}>
                  <select name="billing_model" className="input-brutal">
                    {dict.offer.billing_models.map((m: string) => <option key={m}>{m}</option>)}
                  </select>
                </Field>
              </div>
            </Block>
          )}

          {/* 6. Preisangaben */}
          <Block title={dict.offer.step6_price_title}>
            <div className="grid gap-6 md:grid-cols-2">
              <Field label={dict.offer.label_price_status}>
                <select name="price_status" className="input-brutal">
                  {dict.offer.price_options.map((o: any) => <option key={o.val} value={o.val}>{o.label}</option>)}
                </select>
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Input name="price" label={dict.offer.label_price} placeholder="0.00" />
                <Field label={dict.offer.label_currency}>
                  <select name="currency" className="input-brutal"><option>EUR</option><option>HUF</option><option>RON</option></select>
                </Field>
              </div>
              <Field label={dict.offer.label_price_per}>
                <select name="price_unit" className="input-brutal">
                  {dict.offer.price_units.map((u: string) => <option key={u}>{u}</option>)}
                </select>
              </Field>
            </div>
          </Block>

          {/* 7. Lieferbedingungen / Incoterms */}
          <Block title={dict.offer.step7_title}>
            <div className="grid gap-6 md:grid-cols-2">
              <Field label="Incoterm (Incoterms 2020)">
                <select name="incoterm" className="input-brutal">
                  {dict.offer.incoterms.map((i: any) => (
                    <option key={i.code} value={i.code} title={i.desc}>{i.code} - {i.desc.substring(0, 40)}...</option>
                  ))}
                </select>
              </Field>
              <Input name="pickup_location" label={dict.offer.label_pickup} />
              <CheckboxGrid title={dict.offer.label_delivery_countries} name="delivery_countries" items={["AT", "HU", "CH", "DE", "RO"]} />
              <Input name="delivery_time" label={dict.offer.label_delivery_time} placeholder="3-5 Werktage..." />
            </div>
          </Block>

          {/* 8 & 9. Media & Documents */}
          <Block title={dict.offer.step8_title}>
            <div className="grid gap-6 md:grid-cols-2">
              <Field label={dict.offer.label_photos}>
                <input type="file" name="photos" multiple accept="image/*" className="input-brutal text-xs" />
              </Field>
              <Field label={dict.offer.label_docs}>
                <input type="file" name="documents" multiple className="input-brutal text-xs" />
              </Field>
            </div>
          </Block>

          {/* 11. Bestätigung */}
          <Block title={dict.offer.step6_confirm_title}>
            <div className="space-y-3">
              {dict.offer.confirms.map((text: string, i: number) => (
                <label key={i} className="flex gap-4 rounded-2xl border-2 border-slate-900 bg-slate-50 p-5 text-sm font-bold cursor-pointer hover:bg-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none">
                  <input type="checkbox" required className="w-6 h-6 mt-0.5 accent-[#108280] border-2 border-slate-900 rounded-lg" />
                  <span className="text-slate-800 leading-relaxed">{text}</span>
                </label>
              ))}
            </div>

            <div className="flex flex-col gap-4 pt-10 md:flex-row">
              <button type="button" className="flex-1 rounded-2xl border-2 border-slate-900 bg-white px-8 py-5 text-lg font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                {dict.offer.btn_draft}
              </button>
              <button type="submit" disabled={loading} className="flex-[2] rounded-2xl border-2 border-slate-900 bg-[#108280] px-8 py-5 text-lg font-black uppercase tracking-widest text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#0b5f5d]">
                {loading ? dict.offer.btn_sending : dict.offer.btn_submit}
              </button>
            </div>
          </Block>
        </form>
      </div>

      <style jsx>{`
        .input-brutal { width: 100%; border-radius: 1rem; border: 2px solid #0f172a; padding: 1rem; outline: none; font-weight: 700; background: white; }
        .input-brutal:focus { border-color: #108280; box-shadow: 4px 4px 0px 0px rgba(16, 130, 128, 0.2); }
      `}</style>
    </main>
  );
}

// Sub-componente interne
function Block({ title, children }: any) {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-black uppercase italic tracking-tight text-slate-900">{title}</h2>
      <div className="rounded-3xl border-2 border-slate-900 p-8 bg-white/50">{children}</div>
    </section>
  );
}
function Field({ label, children }: any) {
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</span>
      {children}
    </label>
  );
}
function Input({ label, ...rest }: any) {
  return <Field label={label}><input {...rest} className="input-brutal" /></Field>;
}
function Textarea({ label, ...rest }: any) {
  return <Field label={label}><textarea {...rest} className="input-brutal" /></Field>;
}
function OptionButton({ current, set, id, label, icon }: any) {
  const active = current === id;
  return (
    <button type="button" onClick={() => set(id)} className={`rounded-2xl border-2 p-6 text-center transition-all ${active ? "border-slate-900 bg-[#108280] text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" : "border-slate-200 bg-white"}`}>
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-[10px] font-black uppercase">{label}</div>
    </button>
  );
}
function CheckboxGrid({ title, name, items }: any) {
  return (
    <div>
      <p className="mb-3 text-[10px] font-black uppercase tracking-widest text-slate-400">{title}</p>
      <div className="grid gap-3 grid-cols-2 md:grid-cols-5">
        {items.map((item: string) => (
          <label key={item} className="flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-white p-3 text-[10px] font-bold cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <input type="checkbox" name={name} value={item} className="accent-[#108280] w-4 h-4" /> {item}
          </label>
        ))}
      </div>
    </div>
  );
}