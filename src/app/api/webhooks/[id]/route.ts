import { NextRequest, NextResponse } from "next/server";
import { updateWebhook, deleteWebhook } from "@/app/actions/webhook";

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const body = await request.json();
    const webhook = await updateWebhook(id, body);
    return NextResponse.json(webhook);
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    await deleteWebhook(id);
    return NextResponse.json({ success: true });
}
