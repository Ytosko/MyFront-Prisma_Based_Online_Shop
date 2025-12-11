import Link from "next/link";
import { getStoreSettings } from "@/app/actions/settings";
import { CartButton } from "@/components/cart/cart-button";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { Store } from "lucide-react";

export default async function StorefrontLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const config = await getStoreSettings();

    return (
        <div className="min-h-screen flex flex-col bg-white">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4">
                    <Link href="/" className="flex items-center gap-3">
                        {config.logoUrl ? (
                            <img
                                src={config.logoUrl}
                                alt={config.storeName}
                                className="h-8 w-auto"
                            />
                        ) : (
                            <div
                                className="p-2 rounded-xl shadow-lg"
                                style={{ backgroundColor: config.primaryColor }}
                            >
                                <Store className="h-5 w-5 text-white" />
                            </div>
                        )}
                        <span className="text-xl font-bold text-slate-900">{config.storeName}</span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-8">
                        <Link href="/" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                            Home
                        </Link>
                        <Link href="/products" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                            Shop
                        </Link>
                        <Link href="/contact" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                            Contact
                        </Link>
                    </nav>

                    <div className="flex items-center gap-4">
                        <CartButton />
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1">
                {children}
            </main>

            {/* Footer */}
            <footer className="border-t border-slate-100 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 py-16">
                    <div className="grid gap-12 md:grid-cols-4">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div
                                    className="p-2 rounded-xl shadow-lg"
                                    style={{ backgroundColor: config.primaryColor }}
                                >
                                    <Store className="h-5 w-5 text-white" />
                                </div>
                                <span className="text-lg font-bold text-slate-900">{config.storeName}</span>
                            </div>
                            <p className="text-sm text-slate-500 leading-relaxed">
                                {config.storeDescription || "Premium products for those who appreciate quality and design."}
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-slate-900 mb-4">Shop</h4>
                            <ul className="space-y-3 text-sm">
                                <li><Link href="/products" className="text-slate-500 hover:text-slate-900 transition-colors">All Products</Link></li>
                                <li><Link href="/products" className="text-slate-500 hover:text-slate-900 transition-colors">New Arrivals</Link></li>
                                <li><Link href="/products" className="text-slate-500 hover:text-slate-900 transition-colors">Best Sellers</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-slate-900 mb-4">Support</h4>
                            <ul className="space-y-3 text-sm">
                                <li><Link href="/contact" className="text-slate-500 hover:text-slate-900 transition-colors">Contact Us</Link></li>
                                <li><Link href="/contact" className="text-slate-500 hover:text-slate-900 transition-colors">FAQ</Link></li>
                                <li><Link href="/contact" className="text-slate-500 hover:text-slate-900 transition-colors">Shipping Info</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-slate-900 mb-4">Legal</h4>
                            <ul className="space-y-3 text-sm">
                                <li><Link href="/privacy" className="text-slate-500 hover:text-slate-900 transition-colors">Privacy Policy</Link></li>
                                <li><Link href="/terms" className="text-slate-500 hover:text-slate-900 transition-colors">Terms of Service</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-12 pt-8 border-t border-slate-200 text-center text-sm text-slate-400">
                        © {new Date().getFullYear()} {config.storeName}. All rights reserved.
                    </div>
                </div>
            </footer>

            {/* Cart Drawer */}
            <CartDrawer />
        </div>
    );
}
