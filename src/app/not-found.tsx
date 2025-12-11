import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search, ArrowLeft, ShoppingBag } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4">
            {/* Background Decoration */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10" />
            </div>

            <div className="relative z-10 text-center max-w-2xl mx-auto">
                {/* 404 Number */}
                <div className="relative mb-8">
                    <h1 className="text-[180px] md:text-[240px] font-black text-transparent bg-clip-text bg-gradient-to-b from-slate-200 to-slate-400 dark:from-slate-700 dark:to-slate-900 leading-none select-none">
                        404
                    </h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-6xl md:text-8xl animate-bounce">
                            🛒
                        </div>
                    </div>
                </div>

                {/* Message */}
                <div className="space-y-4 mb-8">
                    <h2 className="text-2xl md:text-4xl font-bold text-foreground">
                        Oops! Page Not Found
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-md mx-auto">
                        Looks like this page went on a shopping spree and got lost!
                        Don't worry, let's get you back on track.
                    </p>
                </div>

                {/* Search Box */}
                <div className="relative max-w-md mx-auto mb-8">
                    <input
                        type="text"
                        placeholder="Search for products..."
                        className="w-full h-14 pl-12 pr-4 rounded-full border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-primary focus:ring-4 focus:ring-primary/20 outline-none text-lg transition-all"
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-4">
                    <Button
                        size="lg"
                        className="h-12 px-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all"
                        asChild
                    >
                        <Link href="/">
                            <Home className="mr-2 h-5 w-5" />
                            Go Home
                        </Link>
                    </Button>
                    <Button
                        size="lg"
                        variant="outline"
                        className="h-12 px-8 rounded-full"
                        asChild
                    >
                        <Link href="/products">
                            <ShoppingBag className="mr-2 h-5 w-5" />
                            Browse Products
                        </Link>
                    </Button>
                </div>

                {/* Quick Links */}
                <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
                    <p className="text-sm text-muted-foreground mb-4">Popular destinations:</p>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        <Link href="/" className="text-sm px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                            Homepage
                        </Link>
                        <Link href="/products" className="text-sm px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                            All Products
                        </Link>
                        <Link href="/admin/login" className="text-sm px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                            Admin Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
