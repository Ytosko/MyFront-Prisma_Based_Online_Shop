import { NextRequest, NextResponse } from "next/server";
import { getWebhooks, createWebhook } from "@/app/actions/webhook";

export async function GET() {
    const webhooks = await getWebhooks();
    return NextResponse.json(webhooks);
}

export async function POST(request: NextRequest) {
    const body = await request.json();
    const webhook = await createWebhook(body);
    return NextResponse.json(webhook);
}
