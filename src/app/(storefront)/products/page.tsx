import { prisma } from "@/lib/prisma";
import { getStoreSettings } from "@/app/actions/settings";
import { ProductCard } from "@/components/storefront/product-card";
import { SortSelect } from "@/components/storefront/sort-select";
import { Search, ChevronLeft, ChevronRight, Sparkles, SlidersHorizontal, X, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
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

export const metadata: Metadata = {
    title: "Shop Collection | Premium Products",
    description: "Explore our curated collection of premium products.",
};

const ITEMS_PER_PAGE = 12;

const priceRanges = [
    { min: 0, max: 50, label: "Under $50" },
    { min: 50, max: 100, label: "$50 - $100" },
    { min: 100, max: 200, label: "$100 - $200" },
    { min: 200, max: Infinity, label: "$200+" },
];

export default async function ProductsPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; page?: string; sort?: string; minPrice?: string; maxPrice?: string }>;
}) {
    const config = await getStoreSettings();
    const params = await searchParams;
    const query = params.q || "";
    const currentPage = parseInt(params.page || "1");
    const sort = params.sort || "newest";
    const minPrice = params.minPrice ? parseFloat(params.minPrice) : undefined;
    const maxPrice = params.maxPrice ? parseFloat(params.maxPrice) : undefined;

    const whereClause: Record<string, unknown> = {};
    if (query) {
        whereClause.OR = [
            { name: { contains: query } },
            { description: { contains: query } },
        ];
    }
    if (minPrice !== undefined || maxPrice !== undefined) {
        whereClause.price = {};
        if (minPrice !== undefined) (whereClause.price as Record<string, number>).gte = minPrice;
        if (maxPrice !== undefined) (whereClause.price as Record<string, number>).lte = maxPrice;
    }

    let orderBy: Record<string, string> = { createdAt: "desc" };
    switch (sort) {
        case "oldest": orderBy = { createdAt: "asc" }; break;
        case "price-low": orderBy = { price: "asc" }; break;
        case "price-high": orderBy = { price: "desc" }; break;
        case "name": orderBy = { name: "asc" }; break;
    }

    const totalCount = await prisma.product.count({ where: whereClause as any });
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    const products = await prisma.product.findMany({
        where: whereClause as any,
        orderBy,
        skip: (currentPage - 1) * ITEMS_PER_PAGE,
        take: ITEMS_PER_PAGE,
    }) as Product[];

    function buildUrl(updates: Record<string, string | undefined>) {
        const newParams = new URLSearchParams();
        if (query) newParams.set("q", query);
        if (sort !== "newest") newParams.set("sort", sort);
        if (minPrice !== undefined) newParams.set("minPrice", minPrice.toString());
        if (maxPrice !== undefined) newParams.set("maxPrice", maxPrice.toString());

        Object.entries(updates).forEach(([key, value]) => {
            if (value === undefined || value === "") {
                newParams.delete(key);
            } else {
                newParams.set(key, value);
            }
        });

        const queryString = newParams.toString();
        return `/products${queryString ? `?${queryString}` : ""}`;
    }

    const hasFilters = query || minPrice !== undefined || maxPrice !== undefined;

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-slate-100 via-white to-indigo-50 py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 mb-6">
                        <Sparkles className="w-4 h-4 text-indigo-600" />
                        <span className="text-sm text-indigo-700 font-medium">{totalCount} Products</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
                        The Collection
                    </h1>

                    <p className="text-lg text-slate-600 max-w-xl mx-auto mb-10">
                        Discover our carefully curated selection of premium products.
                    </p>

                    {/* Search */}
                    <form className="relative max-w-xl mx-auto">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            name="q"
                            type="text"
                            placeholder="Search products..."
                            defaultValue={query}
                            className="w-full h-14 pl-14 pr-6 rounded-full border border-slate-200 bg-white shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </form>
                </div>
            </section>

            {/* Filters Bar */}
            <section className="sticky top-16 z-40 py-4 px-4 bg-white border-b border-slate-100 shadow-sm">
                <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                    {/* Price Filters */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 -mb-2 scrollbar-hide">
                        {hasFilters && (
                            <Link href="/products">
                                <button className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-full transition-all whitespace-nowrap">
                                    <X className="w-3 h-3 inline mr-1" />
                                    Clear
                                </button>
                            </Link>
                        )}
                        {priceRanges.map((range) => {
                            const isActive = minPrice === range.min && (maxPrice === range.max || (range.max === Infinity && maxPrice === undefined));
                            return (
                                <Link
                                    key={range.label}
                                    href={buildUrl({
                                        minPrice: isActive ? undefined : range.min.toString(),
                                        maxPrice: isActive ? undefined : (range.max === Infinity ? undefined : range.max.toString()),
                                        page: "1"
                                    })}
                                >
                                    <button
                                        className={`px-4 py-2 text-xs font-medium rounded-full transition-all whitespace-nowrap ${isActive
                                                ? 'text-white shadow-lg'
                                                : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200'
                                            }`}
                                        style={isActive ? { backgroundColor: config.primaryColor } : {}}
                                    >
                                        {range.label}
                                    </button>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Sort */}
                    <div className="flex items-center gap-3">
                        <SortSelect defaultValue={sort} />
                    </div>
                </div>
            </section>

            {/* Products Grid */}
            <section className="py-12">
                <div className="max-w-7xl mx-auto px-4">
                    {products.length === 0 ? (
                        <div className="text-center py-24 bg-white rounded-2xl">
                            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-100 flex items-center justify-center">
                                <Package className="w-8 h-8 text-slate-400" />
                            </div>
                            <h2 className="text-2xl font-semibold text-slate-900 mb-3">No products found</h2>
                            <p className="text-slate-500 mb-8">Try adjusting your search or filters</p>
                            <Link href="/products">
                                <Button style={{ backgroundColor: config.primaryColor }} className="rounded-full px-8">
                                    View All Products
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
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

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-center gap-2 mt-16">
                                    <Link
                                        href={buildUrl({ page: Math.max(1, currentPage - 1).toString() })}
                                        className={currentPage === 1 ? "pointer-events-none opacity-30" : ""}
                                    >
                                        <button className="w-12 h-12 rounded-full bg-white hover:bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-700 transition-all shadow-sm">
                                            <ChevronLeft className="w-5 h-5" />
                                        </button>
                                    </Link>

                                    <div className="flex items-center gap-1 px-4">
                                        {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                                            let pageNum: number;
                                            if (totalPages <= 5) {
                                                pageNum = i + 1;
                                            } else if (currentPage <= 3) {
                                                pageNum = i + 1;
                                            } else if (currentPage >= totalPages - 2) {
                                                pageNum = totalPages - 4 + i;
                                            } else {
                                                pageNum = currentPage - 2 + i;
                                            }

                                            return (
                                                <Link key={pageNum} href={buildUrl({ page: pageNum.toString() })}>
                                                    <button
                                                        className={`w-10 h-10 rounded-full text-sm font-medium transition-all ${currentPage === pageNum
                                                                ? 'text-white shadow-lg'
                                                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                                            }`}
                                                        style={currentPage === pageNum ? { backgroundColor: config.primaryColor } : {}}
                                                    >
                                                        {pageNum}
                                                    </button>
                                                </Link>
                                            );
                                        })}
                                    </div>

                                    <Link
                                        href={buildUrl({ page: Math.min(totalPages, currentPage + 1).toString() })}
                                        className={currentPage === totalPages ? "pointer-events-none opacity-30" : ""}
                                    >
                                        <button className="w-12 h-12 rounded-full bg-white hover:bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-700 transition-all shadow-sm">
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </Link>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>
        </div>
    );
}
