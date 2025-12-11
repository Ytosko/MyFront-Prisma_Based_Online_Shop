import { Sidebar } from "@/components/admin/sidebar"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Admin Dashboard | Shop Management",
    description: "Manage your online store - products, orders, settings and more",
    robots: "noindex, nofollow",
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen w-full bg-slate-100 dark:bg-slate-950">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    )
}
