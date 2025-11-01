"use client";

import { BrandTable } from "@/components/admin/brands/brand-table";
import { AdminLayout } from "@/components/admin/admin-layout";

export default function BrandsPage() {
    return (
        <AdminLayout>
            <BrandTable />
        </AdminLayout>
    );
}
