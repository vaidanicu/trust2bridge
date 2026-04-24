export type BasketItem = {
  id: number;
  internal_id: string;
  type: string;
  title: string;
  supplier_id: string;
  supplier_name: string;
  supplier_email: string;
  category: string;
  country: string;
  price_status: string;
  min_qty: string;
  quantity: number;
  unit: string;
  note: string;
  delivery_location: string;
  desired_date: string;
  customer_note: string;
};

export function getBasket(): BasketItem[] {
  if (typeof window === "undefined") return [];

  const basket = localStorage.getItem("trustbridge_basket");
  return basket ? JSON.parse(basket) : [];
}

export function saveBasket(items: BasketItem[]) {
  localStorage.setItem("trustbridge_basket", JSON.stringify(items));
}

export function addToBasket(item: any) {
  const basket = getBasket();

  const existing = basket.find((i) => i.id === item.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    basket.push({
      id: item.id,
      internal_id: item.internal_id || "",
      type: item.type || "product",
      title: item.title || "",
      supplier_id: item.supplier_id || "",
      supplier_name: item.supplier_name || "",
      supplier_email: item.supplier_email || "",
      category: item.category || "",
      country: item.country || "",
      price_status: item.price_status || "",
      min_qty: item.min_qty || "",
      quantity: Number(item.min_qty) || 1,
      unit: item.unit || "buc",
      note: "",
      delivery_location: "",
      desired_date: "",
      customer_note: "",
    });
  }

  saveBasket(basket);
}