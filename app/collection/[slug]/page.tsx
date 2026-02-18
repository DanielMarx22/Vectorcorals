import { client } from "@/sanity/lib/client";
import ProductClient from "@/components/ProductClient";
import { notFound } from "next/navigation";

export const revalidate = 0;

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;

    const coral = await client.fetch(`*[_type == "coral" && slug.current == $slug][0]{
    "id": _id,
    name,
    price,
    "image": image.asset->url,
    tag,
    category,
    filterTags,
    status,
    description
  }`, { slug: resolvedParams.slug });

    if (!coral) {
        notFound();
    }

    return <ProductClient coral={coral} />;
}