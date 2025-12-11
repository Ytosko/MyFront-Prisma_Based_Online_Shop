"use client";

import Link from "next/link";
import { useCartStore } from "@/lib/cart-store";
import { Plus, Check } from "lucide-react";
import { useState } from "react";

interface ProductCardProps {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    stock: number;
}

export function ProductCard({ id, name, price, image, stock }: ProductCardProps) {
    const addItem = useCartStore((state) => state.addItem);
    const [isAdded, setIsAdded] = useState(false);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (stock === 0) return;
        const images = image ? JSON.parse(image) : [];
        setIsAdded(true);
        addItem({ id, name, price, image: images[0] || undefined });
        setTimeout(() => setIsAdded(false), 1500);
    };

    const images = image ? JSON.parse(image) : [];
    const imageUrl = images[0] || "https://placehold.co/300x400/f1f5f9/94a3b8?text=Product";

    return (
        <Link href={`/products/${id}`} className="block group">
            <div className="relative rounded-2xl overflow-hidden bg-slate-100 border border-slate-100 hover:border-slate-200 hover:shadow-xl transition-all duration-300">
                {/* Image */}
                <div className="relative aspect-[3/4] overflow-hidden">
                    <img
                        src={imageUrl}
                        alt={name}
                        className="absolute inset-0 w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                    />

                    {/* Quick Add Button */}
                    <button
                        onClick={handleAddToCart}
                        disabled={stock === 0}
                        className={`absolute top-3 right-3 z-20 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${isAdded
                                ? 'bg-emerald-500 scale-110'
                                : stock === 0
                                    ? 'bg-slate-300 cursor-not-allowed'
                                    : 'bg-white hover:bg-slate-50 hover:scale-110 opacity-0 group-hover:opacity-100'
                            }`}
                    >
                        {isAdded ? (
                            <Check className="w-4 h-4 text-white" />
                        ) : (
                            <Plus className="w-4 h-4 text-slate-700" />
                        )}
                    </button>

                    {/* Status Badges */}
                    {stock === 0 && (
                        <div className="absolute top-3 left-3 z-20 px-3 py-1 bg-slate-900/80 backdrop-blur-md rounded-full">
                            <span className="text-[10px] font-medium text-white uppercase tracking-wider">Sold Out</span>
                        </div>
                    )}
                    {stock > 0 && stock <= 3 && (
                        <div className="absolute top-3 left-3 z-20 px-3 py-1 bg-amber-500 rounded-full">
                            <span className="text-[10px] font-medium text-white uppercase tracking-wider">Low Stock</span>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-4 bg-white">
                    <h3 className="text-slate-900 font-medium text-sm leading-tight line-clamp-1 mb-1 group-hover:text-indigo-600 transition-colors">
                        {name}
                    </h3>
                    <span className="text-slate-900 font-semibold">${price.toFixed(2)}</span>
                </div>
            </div>
        </Link>
    );
}
