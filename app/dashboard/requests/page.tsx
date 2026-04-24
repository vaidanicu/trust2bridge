"use client";

import { useEffect, useState } from "react";

const API = "https://trustbridgeb2b.com/backend/wp-json/trustbridge/v1";

export default function RequestsPage() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("trustbridge_token");

    fetch(`${API}/requests`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(setData);
  }, []);

  return (
    <main className="p-10">
      <h1 className="text-2xl font-black mb-6">Meine Anfragen</h1>

      <div className="space-y-4">
        {data.map((r) => (
          <div key={r.id} className="border p-4 rounded-xl bg-white">
            <h2 className="font-bold">{r.title}</h2>
            <p>Status: {r.status}</p>
            <p>Firma: {r.company}</p>
            <p>Datum: {r.date}</p>
            <p>Positionen: {r.items?.length || 0}</p>
          </div>
        ))}
      </div>
    </main>
  );
}