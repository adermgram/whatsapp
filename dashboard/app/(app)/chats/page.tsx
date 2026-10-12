import type { Metadata } from "next";
import { ChatListView } from "@/components/chats";

export const metadata: Metadata = { title: "Chats" };

export default function Page() {
  return <ChatListView />;
}
