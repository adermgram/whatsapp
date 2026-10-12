import type { Metadata } from "next";
import { Suspense } from "react";
import { OrderDetail } from "@/components/orders";
import { Spinner } from "@/components/ui";

export const metadata: Metadata = { title: "Order" };

export default function Page({ params }: PageProps<"/orders/[id]">) {
  return (
    <Suspense
      fallback={
        <div className="grid place-items-center py-24">
          <Spinner className="size-6" />
        </div>
      }
    >
      <Detail params={params} />
    </Suspense>
  );
}

/** params is only known at request time, so it is read behind Suspense (same as the product page). */
async function Detail({ params }: { params: PageProps<"/orders/[id]">["params"] }) {
  const { id } = await params;
  return <OrderDetail orderId={id} />;
}
