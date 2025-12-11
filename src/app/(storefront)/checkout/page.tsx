"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/cart-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShoppingBag, CreditCard, Loader2, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
    const { items, getTotal, clearCart } = useCartStore();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        name: "",
        address: "",
        city: "",
        zip: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items: items.map((item) => ({
                        productId: item.id,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                        image: item.image,
                    })),
                    customer: formData,
                    total: getTotal(),
                }),
            });

            const data = await response.json();

            if (data.url) {
                // Redirect to Stripe checkout
                window.location.href = data.url;
            } else if (data.success) {
                // Order created without Stripe
                setSuccess(true);
                clearCart();
            } else {
                throw new Error(data.error || "Checkout failed");
            }
        } catch (error) {
            console.error("Checkout error:", error);
            alert("Checkout failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
                <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
                <p className="text-muted-foreground mb-8">
                    Thank you for your order. You will receive a confirmation email shortly.
                </p>
                <Button asChild>
                    <Link href="/products">Continue Shopping</Link>
                </Button>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-6 opacity-30" />
                <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
                <Button asChild>
                    <Link href="/products">Browse Products</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Checkout</h1>

            <div className="grid lg:grid-cols-2 gap-12">
                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold">Contact Information</h2>
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold">Shipping Address</h2>
                        <div>
                            <Label htmlFor="address">Address</Label>
                            <Input
                                id="address"
                                required
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="city">City</Label>
                                <Input
                                    id="city"
                                    required
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label htmlFor="zip">ZIP Code</Label>
                                <Input
                                    id="zip"
                                    required
                                    value={formData.zip}
                                    onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <Button type="submit" size="lg" className="w-full" disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <CreditCard className="h-5 w-5 mr-2" />
                                Complete Order - ${getTotal().toFixed(2)}
                            </>
                        )}
                    </Button>
                </form>

                {/* Order Summary */}
                <div className="bg-muted/50 rounded-xl p-6 h-fit">
                    <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                    <div className="space-y-4">
                        {items.map((item) => (
                            <div key={item.id} className="flex gap-4">
                                {item.image ? (
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-16 h-16 object-cover rounded-lg"
                                    />
                                ) : (
                                    <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                                        <ShoppingBag className="h-6 w-6 text-muted-foreground" />
                                    </div>
                                )}
                                <div className="flex-1">
                                    <p className="font-medium">{item.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                        Qty: {item.quantity} × ${item.price.toFixed(2)}
                                    </p>
                                </div>
                                <p className="font-medium">
                                    ${(item.price * item.quantity).toFixed(2)}
                                </p>
                            </div>
                        ))}
                    </div>
                    <div className="border-t mt-6 pt-6 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>Subtotal</span>
                            <span>${getTotal().toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-muted-foreground">
                            <span>Shipping</span>
                            <span>Free</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold pt-2">
                            <span>Total</span>
                            <span>${getTotal().toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
