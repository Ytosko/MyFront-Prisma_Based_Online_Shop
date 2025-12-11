import { NextRequest, NextResponse } from "next/server";
import { regenerateWebhookSecret } from "@/app/actions/webhook";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const webhook = await regenerateWebhookSecret(id);
    return NextResponse.json(webhook);
}
