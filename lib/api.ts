export const API_URL = "https://trustbridgeb2b.com/backend/wp-json/trustbridge/v1";

export async function getItems() {
  const res = await fetch(`${API_URL}/items`, {
    next: { revalidate: 60 }, // Se verifică date noi la fiecare 60 de secunde
  });

  if (!res.ok) {
    throw new Error("Nu s-au putut încărca articolele.");
  }

  return res.json();
}