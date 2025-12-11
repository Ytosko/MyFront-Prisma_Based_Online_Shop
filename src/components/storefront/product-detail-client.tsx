"use client";

import { useState } from "react";
import { ShoppingCart, Minus, Plus, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/cart-store";
import Link from "next/link";

interface ProductDetailClientProps {
    product: {
        id: string;
        name: string;
        description: string;
        price: number;
        images: string;
        stock: number;
    };
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const addItem = useCartStore((state) => state.addItem);

    const images = JSON.parse(product.images || "[]") as string[];

    const handleAddToCart = () => {
        const image = images[0];
        for (let i = 0; i < quantity; i++) {
            addItem({
                id: product.id,
                name: product.name,
                price: product.price,
                image,
            });
        }
        setQuantity(1);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <Link
                href="/products"
                className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8"
            >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Products
            </Link>

            <div className="grid md:grid-cols-2 gap-12">
                {/* Images */}
                <div className="space-y-4">
                    <div className="aspect-square rounded-xl overflow-hidden bg-muted">
                        {images[selectedImage] ? (
                            <img
                                src={images[selectedImage]}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <ShoppingCart className="h-24 w-24 text-muted-foreground/30" />
                            </div>
                        )}
                    </div>
                    {images.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto">
                            {images.map((img, i) => (
                                <button
                                    key={i}
                                    onClick={() => setSelectedImage(i)}
                                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${selectedImage === i ? "border-primary" : "border-transparent"
                                        }`}
                                >
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Details */}
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                        <p className="text-3xl font-bold text-primary">
                            ${product.price.toFixed(2)}
                        </p>
                    </div>

                    <div className="prose prose-sm max-w-none text-muted-foreground">
                        <p style={{ whiteSpace: "pre-wrap" }}>{product.description}</p>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                        <span className={product.stock > 0 ? "text-green-600" : "text-red-600"}>
                            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                        </span>
                    </div>

                    {product.stock > 0 && (
                        <div className="space-y-4 pt-4 border-t">
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-medium">Quantity:</span>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    >
                                        <Minus className="h-4 w-4" />
                                    </Button>
                                    <span className="w-12 text-center font-medium">{quantity}</span>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            <Button size="lg" className="w-full" onClick={handleAddToCart}>
                                <ShoppingCart className="h-5 w-5 mr-2" />
                                Add to Cart - ${(product.price * quantity).toFixed(2)}
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
