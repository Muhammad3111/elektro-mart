"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

// Mapping subcategories to their parent categories
const subcategoryMapping: Record<string, string> = {
  "quvvat-kabellari": "kabellar",
  "malumot-kabellari": "kabellar",
  "koaksial-kabellar": "kabellar",
  "led-lampalar": "yoritish",
  "lyustralar": "yoritish",
};

export default function SubcategoryPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  useEffect(() => {
    const parentCategory = subcategoryMapping[slug];
    if (parentCategory) {
      // Redirect to catalog with category and subcategory parameters
      router.replace(`/catalog?category=${parentCategory}&subcategory=${slug}`);
    } else {
      // If subcategory not found, redirect to main catalog
      router.replace("/catalog");
    }
  }, [slug, router]);

  return null;
}
