import type { Metadata } from "next";
import { WhatsAppPage } from "@/components/whatsapp-status";

export const metadata: Metadata = { title: "WhatsApp" };

export default function Page() {
  return <WhatsAppPage />;
}
