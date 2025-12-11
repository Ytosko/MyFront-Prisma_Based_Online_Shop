import { prisma } from "./prisma";
import crypto from "crypto";

interface WebhookPayload {
    event: string;
    data: Record<string, unknown>;
    timestamp: string;
}

export async function dispatchWebhooks(event: string, data: Record<string, unknown>) {
    try {
        const webhooks = await prisma.webhook.findMany({
            where: {
                active: true,
            },
        });

        const matchingWebhooks = webhooks.filter((webhook) => {
            const events = JSON.parse(webhook.events) as string[];
            return events.includes(event) || events.includes("*");
        });

        const payload: WebhookPayload = {
            event,
            data,
            timestamp: new Date().toISOString(),
        };

        const results = await Promise.allSettled(
            matchingWebhooks.map((webhook) => sendWebhook(webhook.url, webhook.secret, payload))
        );

        const successCount = results.filter((r) => r.status === "fulfilled").length;
        const failCount = results.filter((r) => r.status === "rejected").length;

        console.log(`Webhooks dispatched for ${event}: ${successCount} success, ${failCount} failed`);

        return { successCount, failCount };
    } catch (error) {
        console.error("Error dispatching webhooks:", error);
        throw error;
    }
}

async function sendWebhook(url: string, secret: string, payload: WebhookPayload) {
    const body = JSON.stringify(payload);
    const signature = crypto.createHmac("sha256", secret).update(body).digest("hex");

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Webhook-Signature": signature,
            "X-Webhook-Event": payload.event,
        },
        body,
    });

    if (!response.ok) {
        throw new Error(`Webhook failed: ${response.status} ${response.statusText}`);
    }

    return response;
}

export function generateWebhookSecret(): string {
    return crypto.randomBytes(32).toString("hex");
}
