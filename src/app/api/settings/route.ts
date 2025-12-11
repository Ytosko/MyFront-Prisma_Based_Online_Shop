import { NextResponse } from "next/server";
import { getStoreSettings, updateStoreSettings } from "@/app/actions/settings";

export async function GET() {
    const config = await getStoreSettings();
    return NextResponse.json(config);
}

export async function POST(request: Request) {
    const body = await request.json();
    const config = await updateStoreSettings(body);
    return NextResponse.json(config);
}
