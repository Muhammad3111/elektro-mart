"use client";

import { AdminLayout } from "@/components/admin/admin-layout";
import { CategoryTable } from "@/components/admin/categories";

export default function AdminCategoriesPage() {
    return (
        <AdminLayout>
            <CategoryTable />
        </AdminLayout>
    );
}
