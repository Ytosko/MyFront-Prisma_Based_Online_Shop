"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { dispatchWebhooks } from "@/lib/webhook-dispatcher";

export async function getOrders() {
    return prisma.order.findMany({
        include: {
            items: {
                include: {
                    product: true,
                },
            },
            user: true,
            invoice: true,
        },
        orderBy: { createdAt: "desc" },
    });
}

export async function getOrderById(id: string) {
    return prisma.order.findUnique({
        where: { id },
        include: {
            items: {
                include: {
                    product: true,
                },
            },
            user: true,
            invoice: true,
        },
    });
}

export async function updateOrderStatus(id: string, status: string) {
    const order = await prisma.order.update({
        where: { id },
        data: { status },
        include: {
            items: {
                include: { product: true },
            },
            user: true,
        },
    });

    // Dispatch webhook
    await dispatchWebhooks("order.updated", {
        orderId: order.id,
        status: order.status,
        total: order.total,
    });

    revalidatePath("/admin/orders");
    return order;
}

export async function createOrder(data: {
    userId?: string;
    items: Array<{ productId: string; quantity: number; price: number }>;
    total: number;
}) {
    const order = await prisma.order.create({
        data: {
            userId: data.userId,
            total: data.total,
            status: "PENDING",
            items: {
                create: data.items.map((item) => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.price,
                })),
            },
        },
        include: {
            items: {
                include: { product: true },
            },
        },
    });

    // Create invoice
    await prisma.invoice.create({
        data: {
            orderId: order.id,
        },
    });

    // Dispatch webhook
    await dispatchWebhooks("order.created", {
        orderId: order.id,
        total: order.total,
        items: order.items.map((item: { productId: string; product: { name: string }; quantity: number; price: number }) => ({
            productId: item.productId,
            name: item.product.name,
            quantity: item.quantity,
            price: item.price,
        })),
    });

    revalidatePath("/admin/orders");
    return order;
}

export async function deleteOrder(id: string) {
    // Delete related records first
    await prisma.invoice.deleteMany({ where: { orderId: id } });
    await prisma.orderItem.deleteMany({ where: { orderId: id } });
    await prisma.order.delete({ where: { id } });

    revalidatePath("/admin/orders");
}
