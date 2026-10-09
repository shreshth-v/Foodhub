export const CITIES = [
  "Bhopal",
  "Indore",
  "Delhi",
  "Mumbai",
  "Bengaluru",
  "Pune",
  "Hyderabad",
  "Jaipur"
];

export const CUISINES = [
  "Biryani",
  "North Indian",
  "South Indian",
  "Fast Food",
  "Chinese",
  "Pizza",
  "Burgers",
  "Desserts",
  "Street Food",
  "Bakery",
  "Mughlai",
  "Italian"
];

export const PAYMENT_METHODS = [
  { id: "cod", label: "Cash on Delivery (COD)", icon: "Banknote" },
  { id: "upi", label: "UPI (Google Pay / PhonePe / Paytm)", icon: "QrCode" },
  { id: "card", label: "Credit / Debit Card", icon: "CreditCard" }
];

export const ORDER_STATUSES = {
  placed: { label: "Placed", color: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  preparing: { label: "Preparing", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  delivered: { label: "Delivered", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  cancelled: { label: "Cancelled", color: "bg-rose-500/20 text-rose-400 border-rose-500/30" }
};
