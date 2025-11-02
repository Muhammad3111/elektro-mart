"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function SubcategoryPage() {
  const params = useParams();
  const router = useRouter();
  const subcategoryId = params.slug as string;
  
  useEffect(() => {
    // Redirect to catalog page with category parameter
    router.replace(`/catalog?category=${subcategoryId}`);
  }, [subcategoryId, router]);
  
  return null;
}
