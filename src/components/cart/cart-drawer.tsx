"use client";

import { create } from "zustand";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/cart-store";
import Link from "next/link";

interface CartDrawerState {
    isOpen: boolean;
    openDrawer: () => void;
    closeDrawer: () => void;
}

export const useCartDrawer = create<CartDrawerState>((set) => ({
    isOpen: false,
    openDrawer: () => set({ isOpen: true }),
    closeDrawer: () => set({ isOpen: false }),
}));

export function CartDrawer() {
    const { isOpen, closeDrawer } = useCartDrawer();
    const { items, updateQuantity, removeItem, getTotal, clearCart } = useCartStore();

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-50 transition-opacity"
                onClick={closeDrawer}
            />

            {/* Drawer */}
            <div className="fixed right-0 top-0 h-full w-full max-w-md bg-background z-50 shadow-xl flex flex-col animate-in slide-in-from-right duration-300">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <ShoppingBag className="h-5 w-5" />
                        Shopping Cart
                    </h2>
                    <Button variant="ghost" size="icon" onClick={closeDrawer}>
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto p-4">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                            <ShoppingBag className="h-16 w-16 mb-4 opacity-20" />
                            <p>Your cart is empty</p>
                            <Button variant="link" onClick={closeDrawer} asChild>
                                <Link href="/products">Continue Shopping</Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {items.map((item) => (
                                <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
                                    {item.image ? (
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-20 h-20 object-cover rounded-md"
                                        />
                                    ) : (
                                        <div className="w-20 h-20 bg-muted rounded-md flex items-center justify-center">
                                            <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <h3 className="font-medium">{item.name}</h3>
                                        <p className="text-sm text-muted-foreground">
                                            ${item.price.toFixed(2)}
                                        </p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            >
                                                <Minus className="h-4 w-4" />
                                            </Button>
                                            <span className="w-8 text-center">{item.quantity}</span>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            >
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="ml-auto text-destructive hover:text-destructive"
                                                onClick={() => removeItem(item.id)}
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="border-t p-4 space-y-4">
                        <div className="flex justify-between text-lg font-semibold">
                            <span>Total</span>
                            <span>${getTotal().toFixed(2)}</span>
                        </div>
                        <div className="grid gap-2">
                            <Button asChild onClick={closeDrawer}>
                                <Link href="/checkout">Checkout</Link>
                            </Button>
                            <Button variant="outline" onClick={clearCart}>
                                Clear Cart
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
