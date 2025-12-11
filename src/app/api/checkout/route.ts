import { NextRequest, NextResponse } from "next/server";
import { createCheckoutSession, stripe } from "@/lib/stripe";
import { createOrder } from "@/app/actions/order";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { items, customer, total } = body;

        if (!items || items.length === 0) {
            return NextResponse.json({ error: "No items in cart" }, { status: 400 });
        }

        // Get product IDs for validation
        const productIds = items.map((item: { productId: string }) => item.productId);
        const products: Array<{ id: string; name: string; stock: number; price: number }> = await prisma.product.findMany({
            where: { id: { in: productIds } },
        });

        // Validate stock
        for (const item of items) {
            const product = products.find((p) => p.id === item.productId);
            if (!product) {
                return NextResponse.json({ error: `Product not found: ${item.productId}` }, { status: 400 });
            }
            if (product.stock < item.quantity) {
                return NextResponse.json({ error: `Insufficient stock for ${product.name}` }, { status: 400 });
            }
        }

        // If Stripe is configured, create checkout session
        if (stripe) {
            const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.headers.get("origin") || "http://localhost:3000";

            const session = await createCheckoutSession(
                items.map((item: { name: string; price: number; quantity: number; image?: string }) => ({
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    image: item.image,
                })),
                `${baseUrl}/checkout/success`,
                `${baseUrl}/checkout`,
                {
                    customerEmail: customer.email,
                    items: JSON.stringify(items),
                    total: total.toString(),
                }
            );

            return NextResponse.json({ url: session.url });
        }

        // If Stripe is not configured, create order directly
        const orderItems = items.map((item: { productId: string; quantity: number; price: number }) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
        }));

        await createOrder({
            items: orderItems,
            total,
        });

        // Update stock
        for (const item of items) {
            await prisma.product.update({
                where: { id: item.productId },
                data: { stock: { decrement: item.quantity } },
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Checkout error:", error);
        return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
    }
}
