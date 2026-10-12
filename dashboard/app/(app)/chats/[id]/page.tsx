import type { Metadata } from "next";
import { Suspense } from "react";
import { ChatThread } from "@/components/chats";
import { Spinner } from "@/components/ui";

export const metadata: Metadata = { title: "Chat" };

export default function Page({ params }: PageProps<"/chats/[id]">) {
  return (
    <Suspense
      fallback={
        <div className="grid place-items-center py-24">
          <Spinner className="size-6" />
        </div>
      }
    >
      <Thread params={params} />
    </Suspense>
  );
}

async function Thread({ params }: { params: PageProps<"/chats/[id]">["params"] }) {
  const { id } = await params;
  return <ChatThread chatId={id} />;
}
