"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { generateWebhookSecret } from "@/lib/webhook-dispatcher";

export async function getWebhooks() {
    return prisma.webhook.findMany({
        orderBy: { createdAt: "desc" },
    });
}

export async function createWebhook(data: { url: string; events: string[] }) {
    const webhook = await prisma.webhook.create({
        data: {
            url: data.url,
            events: JSON.stringify(data.events),
            secret: generateWebhookSecret(),
            active: true,
        },
    });

    revalidatePath("/admin/webhooks");
    return webhook;
}

export async function updateWebhook(
    id: string,
    data: { url?: string; events?: string[]; active?: boolean }
) {
    const updateData: Record<string, unknown> = {};
    if (data.url) updateData.url = data.url;
    if (data.events) updateData.events = JSON.stringify(data.events);
    if (typeof data.active === "boolean") updateData.active = data.active;

    const webhook = await prisma.webhook.update({
        where: { id },
        data: updateData,
    });

    revalidatePath("/admin/webhooks");
    return webhook;
}

export async function deleteWebhook(id: string) {
    await prisma.webhook.delete({ where: { id } });
    revalidatePath("/admin/webhooks");
}

export async function regenerateWebhookSecret(id: string) {
    const webhook = await prisma.webhook.update({
        where: { id },
        data: { secret: generateWebhookSecret() },
    });

    revalidatePath("/admin/webhooks");
    return webhook;
}
