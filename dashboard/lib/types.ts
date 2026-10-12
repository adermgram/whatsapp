// Mirrors what the API returns. Money is in naira (the API converts to/from kobo).

export type Category = "CLOTHES" | "SHOES" | "JERSEY" | "ACCESSORIES";

export interface Variant {
  id: string;
  size: string | null;
  color: string | null;
  price: number;
  minPrice: number;
  stock: number;
  reserved: number;
  available: number;
}

export interface ProductImage {
  id: string;
  color: string | null;
  position: number;
}

export interface Product {
  id: string;
  name: string;
  category: Category;
  description: string | null;
  attributes: Record<string, string | number | boolean>;
  active: boolean;
  createdAt: string;
  variants: Variant[];
  images: ProductImage[];
  mainImageId: string | null;
  totalAvailable: number;
}

export interface UploadResult {
  name: string;
  ok: boolean;
  imageId?: string;
  error?: string;
}

export interface UploadResponse {
  results: UploadResult[];
  product: Product;
}

export interface Me {
  id: string;
  businessName: string;
  email: string;
}

export const CATEGORIES: { value: Category; label: string }[] = [
  { value: "JERSEY", label: "Football jerseys" },
  { value: "SHOES", label: "Shoes" },
  { value: "CLOTHES", label: "Clothes" },
  { value: "ACCESSORIES", label: "Accessories" },
];

// ---- orders, chats, WhatsApp ----

export type OrderStatus = "AWAITING_PAYMENT" | "PAID" | "FULFILLED" | "CANCELLED" | "EXPIRED";

export interface OrderItem {
  name: string;
  size: string | null;
  color: string | null;
  quantity: number;
  unitPrice: number;
  listPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  subtotal: number;
  deliveryFee: number;
  total: number;
  deliveryAddress: string | null;
  createdAt: string;
  paidAt: string | null;
  expiresAt: string | null;
  conversationId: string;
  customer: { name: string | null; phone: string };
  items: OrderItem[];
  payment: { status: "PENDING" | "SUCCESS" | "FAILED"; reference: string; manual: boolean } | null;
  receipt: { number: string; sent: boolean } | null;
}

export interface OrderList {
  orders: Order[];
  counts: Record<OrderStatus, number>;
}

export interface MarkPaidResponse {
  outcome: "paid" | "already_paid" | "oversold";
  order: Order;
}

export interface ChatSummary {
  id: string;
  customerName: string | null;
  phone: string;
  mode: "AI" | "HUMAN";
  handoffReason: string | null;
  handoffBy: "AI" | "OWNER" | null;
  humanSince: string | null;
  lastMessageAt: string;
  lastMessage: { sender: "CUSTOMER" | "AI" | "OWNER"; text: string; at: string } | null;
}

export interface ChatList {
  chats: ChatSummary[];
  waitingCount: number;
}

export interface ChatMessage {
  id: string;
  sender: "CUSTOMER" | "AI" | "OWNER";
  type: string;
  text: string | null;
  createdAt: string;
}

export interface ChatDetail extends ChatSummary {
  messages: ChatMessage[];
  orders: { id: string; orderNumber: string; status: OrderStatus; total: number }[];
}

export interface WhatsAppStatus {
  live: boolean;
  state: "DISCONNECTED" | "QR_PENDING" | "CONNECTED";
  phone: string | null;
  qr: string | null;
  updatedAt: string | null;
  ownerPhone: string | null;
  alertEmail: string | null;
  aiEnabled: boolean;
  replyTo: "everyone" | "allowlist";
  allowedCount: number;
}

export interface OverviewNumbers {
  waitingChats: number;
  awaitingPayment: number;
  paidLast7Days: { count: number; total: number };
  whatsapp: { state: WhatsAppStatus["state"]; live: boolean };
}
