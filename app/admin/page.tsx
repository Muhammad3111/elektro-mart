"use client";

import { AdminLayout } from "@/components/admin/admin-layout";
import { useLanguage } from "@/contexts/language-context";
import { DashboardStatsComponent } from "@/components/admin/dashboard-stats";

export default function AdminDashboard() {
    const { t } = useLanguage();

    return (
        <AdminLayout>
            <div className="space-y-8">
                {/* Page Header */}
                <div>
                    <h1 className="text-4xl font-black">
                        {t("Dashboard", "Панель управления")}
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        {t(
                            "Umumiy statistika",
                            "Общая статистика"
                        )}
                    </p>
                </div>

                {/* Stats Grid - Real API Data */}
                <DashboardStatsComponent />
            </div>
        </AdminLayout>
    );
}
