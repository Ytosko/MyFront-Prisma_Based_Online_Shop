import { prisma } from "@/lib/prisma";
import { getStoreSettings } from "@/app/actions/settings";
import { ProductCard } from "@/components/storefront/product-card";
import { ArrowRight, Sparkles, Truck, Shield, Star, Clock, CheckCircle, ChevronRight, Quote, TrendingUp, Package, Zap, Gift } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Metadata } from "next";

type Product = {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    images: string;
    createdAt: Date;
    updatedAt: Date;
};

export async function generateMetadata(): Promise<Metadata> {
    const config = await getStoreSettings();
    return {
        title: `${config.storeName} - Premium Online Shopping`,
        description: config.storeDescription || "Discover amazing products with quality guaranteed.",
    };
}

const categories = [
    { name: "Electronics", image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=500&fit=crop" },
    { name: "Fashion", image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=500&fit=crop" },
    { name: "Home", image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400&h=500&fit=crop" },
    { name: "Sports", image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=500&fit=crop" },
    { name: "Beauty", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=500&fit=crop" },
    { name: "Books", image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=500&fit=crop" },
];

const testimonials = [
    { name: "Sarah J.", text: "Amazing quality and fast shipping. This is now my go-to shop!", avatar: "https://i.pravatar.cc/100?img=1" },
    { name: "Michael C.", text: "Best prices and authentic products. Highly recommend!", avatar: "https://i.pravatar.cc/100?img=2" },
    { name: "Emily D.", text: "The quality exceeded my expectations. Love it!", avatar: "https://i.pravatar.cc/100?img=3" },
];

export default async function StorefrontHome() {
    const config = await getStoreSettings();
    const products: Product[] = await prisma.product.findMany({
        where: { stock: { gt: 0 } },
        orderBy: { createdAt: "desc" },
        take: 10,
    });

    const trendingProducts: Product[] = await prisma.product.findMany({
        where: { stock: { gt: 0 } },
        orderBy: { price: "desc" },
        take: 5,
    });

    return (
        <div className="relative">
            {/* Hero */}
            <section className="relative min-h-[85vh] flex items-center overflow-hidden -mt-16 pt-16 bg-gradient-to-br from-slate-50 via-white to-indigo-50">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-20 right-20 w-96 h-96 bg-indigo-200/50 rounded-full blur-3xl" />
                    <div className="absolute bottom-20 left-20 w-80 h-80 bg-purple-200/50 rounded-full blur-3xl" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 grid lg:grid-cols-2 gap-12 items-center">
                    <div className="max-w-xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 mb-8">
                            <Sparkles className="w-4 h-4 text-indigo-600" />
                            <span className="text-sm text-indigo-700 font-medium">New Collection 2024</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 leading-[1.1] tracking-tight">
                            Discover<br />
                            <span style={{ color: config.primaryColor }}>
                                Premium
                            </span> Style
                        </h1>

                        <p className="text-xl text-slate-600 max-w-lg mb-10">
                            Curated products for those who appreciate quality, design, and exceptional craftsmanship.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <Link href="/products">
                                <Button
                                    size="lg"
                                    className="h-14 px-8 rounded-full font-medium shadow-lg shadow-indigo-500/25"
                                    style={{ backgroundColor: config.primaryColor }}
                                >
                                    Shop Collection <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                            <Link href="/products">
                                <Button size="lg" variant="outline" className="h-14 px-8 rounded-full border-slate-300">
                                    Explore
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="relative hidden lg:block">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-3xl rotate-3" />
                        <img
                            src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&h=700&fit=crop"
                            alt="Hero"
                            className="relative rounded-3xl shadow-2xl object-cover aspect-[4/5]"
                        />
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-12 bg-white border-y border-slate-100">
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
                    {[
                        { value: "50K+", label: "Happy Customers" },
                        { value: "100K+", label: "Products Sold" },
                        { value: "4.9", label: "Average Rating" },
                        { value: "99%", label: "Satisfaction" },
                    ].map((stat, i) => (
                        <div key={i} className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-slate-900">{stat.value}</div>
                            <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Benefits */}
            <section className="py-6 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center gap-8 md:gap-16">
                    {[
                        { icon: Truck, text: "Free Shipping" },
                        { icon: Shield, text: "Secure Payment" },
                        { icon: Clock, text: "24/7 Support" },
                        { icon: Gift, text: "Gift Wrapping" },
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-slate-600 text-sm">
                            <item.icon className="w-4 h-4" style={{ color: config.primaryColor }} />
                            {item.text}
                        </div>
                    ))}
                </div>
            </section>

            {/* Categories */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-end justify-between mb-12">
                        <div>
                            <p className="text-sm font-medium mb-2" style={{ color: config.primaryColor }}>BROWSE BY</p>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Categories</h2>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                        {categories.map((cat, i) => (
                            <Link key={i} href="/products" className="group">
                                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-lg">
                                    <img
                                        src={cat.image}
                                        alt={cat.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <h3 className="text-white font-medium text-sm">{cat.name}</h3>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-20 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-end justify-between mb-12">
                        <div>
                            <p className="text-sm font-medium mb-2" style={{ color: config.primaryColor }}>CURATED FOR YOU</p>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Featured Products</h2>
                        </div>
                        <Link href="/products" className="text-slate-600 hover:text-slate-900 text-sm flex items-center gap-1 transition-colors">
                            View All <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {products.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-2xl">
                            <Package className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                            <p className="text-slate-500">No products available yet</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                            {products.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    id={product.id}
                                    name={product.name}
                                    description={product.description}
                                    price={product.price}
                                    image={product.images}
                                    stock={product.stock}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Banner */}
            <section className="py-10 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="relative rounded-3xl overflow-hidden min-h-[400px] flex items-center">
                        <img
                            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&h=600&fit=crop"
                            alt="Sale"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/90 via-indigo-800/70 to-transparent" />
                        <div className="relative z-10 p-12 max-w-lg">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 mb-6">
                                <Zap className="w-4 h-4 text-yellow-400" />
                                <span className="text-sm text-white font-medium">Limited Time</span>
                            </div>
                            <h3 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                                Up to 50% Off
                            </h3>
                            <p className="text-white/80 mb-8">
                                Don't miss our biggest sale of the season.
                            </p>
                            <Link href="/products">
                                <Button className="bg-white text-indigo-900 hover:bg-white/90 rounded-full px-8 h-12">
                                    Shop Sale
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trending */}
            <section className="py-20 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center gap-4 mb-12">
                        <div className="p-3 rounded-2xl bg-gradient-to-r from-red-500 to-orange-500 shadow-lg">
                            <TrendingUp className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900">Trending Now</h2>
                            <p className="text-slate-500 text-sm">Most popular this week</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {trendingProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                id={product.id}
                                name={product.name}
                                description={product.description}
                                price={product.price}
                                image={product.images}
                                stock={product.stock}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <p className="text-sm font-medium mb-2" style={{ color: config.primaryColor }}>TESTIMONIALS</p>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900">What Customers Say</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {testimonials.map((t, i) => (
                            <div key={i} className="bg-slate-50 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                                <div className="flex gap-1 mb-4">
                                    {[...Array(5)].map((_, j) => (
                                        <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                                    ))}
                                </div>
                                <Quote className="w-8 h-8 text-slate-200 mb-4" />
                                <p className="text-slate-600 mb-6">{t.text}</p>
                                <div className="flex items-center gap-3">
                                    <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full" />
                                    <div>
                                        <div className="text-slate-900 font-medium text-sm">{t.name}</div>
                                        <div className="text-slate-400 text-xs flex items-center gap-1">
                                            <CheckCircle className="w-3 h-3 text-green-500" /> Verified
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4">
                    <div
                        className="relative rounded-3xl overflow-hidden p-12 md:p-16 text-center"
                        style={{ background: `linear-gradient(135deg, ${config.primaryColor}, #8b5cf6)` }}
                    >
                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Stay Updated</h2>
                            <p className="text-white/80 mb-8 max-w-md mx-auto">
                                Subscribe for exclusive deals and 10% off your first order.
                            </p>
                            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                                <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="h-12 bg-white/20 border-white/30 text-white placeholder:text-white/60 rounded-full px-6"
                                />
                                <Button className="h-12 px-8 bg-white text-indigo-600 hover:bg-white/90 rounded-full font-medium">
                                    Subscribe
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
