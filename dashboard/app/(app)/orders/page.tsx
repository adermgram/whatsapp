import type { Metadata } from "next";
import { OrderList } from "@/components/orders";

export const metadata: Metadata = { title: "Orders" };

export default function Page() {
  return <OrderList />;
}
