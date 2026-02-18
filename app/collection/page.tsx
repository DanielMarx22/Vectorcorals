// app/collection/page.tsx
import { client } from "@/sanity/lib/client";
import CollectionClient from "@/components/CollectionClient";

export const revalidate = 0;

export default async function Collection() {
  const corals = await client.fetch(`*[_type == "coral" && status == "in-stock"]{
    "id": _id,
    name,
    "slug": slug.current, 
    price,
    "image": image.asset->url,
    tag,
    category,
    filterTags,
    status
  }`);

  return <CollectionClient corals={corals} />;
}