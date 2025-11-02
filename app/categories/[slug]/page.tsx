"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.slug as string;
  
  useEffect(() => {
    // Redirect to catalog page with category parameter
    router.replace(`/catalog?category=${categoryId}`);
  }, [categoryId, router]);
  
  return null;
}
