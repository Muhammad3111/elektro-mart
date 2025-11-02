"use client";

import { CategoryList } from "@/components/category-list";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function CategoriesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <CategoryList />
      </main>
      <Footer />
    </div>
  );
}
