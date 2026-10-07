import type { Metadata } from "next";
import { Suspense } from "react";
import { ProductEditor } from "@/components/product-editor";
import { Spinner } from "@/components/ui";

export const metadata: Metadata = { title: "Edit product" };

export default function Page({ params }: PageProps<"/products/[id]">) {
  return (
    <Suspense
      fallback={
        <div className="grid place-items-center py-24">
          <Spinner className="size-6" />
        </div>
      }
    >
      <Editor params={params} />
    </Suspense>
  );
}

/** params is a Promise in this version of Next.js and is only known at request time, so it is read behind Suspense. */
async function Editor({ params }: { params: PageProps<"/products/[id]">["params"] }) {
  const { id } = await params;
  return <ProductEditor productId={id} />;
}
