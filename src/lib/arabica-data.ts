export type MenuItem = {
  id: number;
  name: string;
  category: "Espresso" | "Blend" | "Pastry";
  priceJpy: number;
  description: string;
};

export type StoreItem = {
  id: number;
  city: string;
  location: string;
  openHours: string;
};

export const menuItems: MenuItem[] = [
  {
    id: 1,
    name: "Kyoto Latte",
    category: "Espresso",
    priceJpy: 680,
    description: "Silky milk with single-origin espresso and light cacao finish.",
  },
  {
    id: 2,
    name: "Daily Blend",
    category: "Blend",
    priceJpy: 620,
    description: "Balanced house blend with notes of citrus and roasted almond.",
  },
  {
    id: 3,
    name: "Butter Croissant",
    category: "Pastry",
    priceJpy: 420,
    description: "Crisp layers, cultured butter aroma, and soft center.",
  },
];

export const stores: StoreItem[] = [
  {
    id: 1,
    city: "Tokyo",
    location: "Shibuya Stream 1F",
    openHours: "08:00 - 20:00",
  },
  {
    id: 2,
    city: "Kyoto",
    location: "Arashiyama Riverside",
    openHours: "09:00 - 19:00",
  },
  {
    id: 3,
    city: "Fukuoka",
    location: "Daimyo Terrace",
    openHours: "08:30 - 20:30",
  },
];
