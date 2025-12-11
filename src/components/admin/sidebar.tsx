"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { LayoutDashboard, ShoppingBag, Package, Settings, Webhook, LogOut, Store, ChevronRight, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { name: 'Contacts', href: '/admin/contacts', icon: Mail },
    { name: 'Webhooks', href: '/admin/webhooks', icon: Webhook },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();

    const handleSignOut = async () => {
        await signOut({ callbackUrl: '/admin/login' });
    };

    return (
        <div className="hidden lg:flex h-screen w-72 flex-col border-r bg-gradient-to-b from-slate-900 to-slate-950 text-white sticky top-0">
            {/* Logo */}
            <div className="flex h-20 items-center gap-3 px-6 border-b border-white/10">
                <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
                    <Store className="h-6 w-6" />
                </div>
                <div>
                    <div className="font-bold text-lg">Shop Admin</div>
                    <div className="text-xs text-white/50">Management Panel</div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-auto py-6 px-4">
                <div className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4 px-3">
                    Menu
                </div>
                <ul className="space-y-1">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href ||
                            (item.href !== '/admin' && pathname.startsWith(item.href));

                        return (
                            <li key={item.name}>
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all",
                                        isActive
                                            ? "bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-white border border-white/10"
                                            : "text-white/60 hover:text-white hover:bg-white/5"
                                    )}
                                >
                                    <item.icon className={cn("h-5 w-5", isActive && "text-indigo-400")} />
                                    {item.name}
                                    {isActive && <ChevronRight className="h-4 w-4 ml-auto text-white/30" />}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-white/10">
                <Link href="/" className="flex items-center gap-2 text-white/50 hover:text-white text-sm mb-4 px-3 transition-colors">
                    <Store className="h-4 w-4" />
                    View Storefront
                </Link>
                <Button
                    variant="ghost"
                    className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl h-12"
                    onClick={handleSignOut}
                >
                    <LogOut className="h-5 w-5 mr-3" />
                    Sign Out
                </Button>
            </div>
        </div>
    );
}
