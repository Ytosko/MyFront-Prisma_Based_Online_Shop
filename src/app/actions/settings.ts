"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getStoreSettings() {
    let config = await prisma.storeConfig.findFirst();

    if (!config) {
        config = await prisma.storeConfig.create({
            data: {
                storeName: "My Shop",
                storeDescription: "Welcome to our online store",
                primaryColor: "#6366f1",
                currency: "USD",
            },
        });
    }

    return config;
}

export async function updateStoreSettings(data: {
    storeName?: string;
    storeDescription?: string | null;
    logoUrl?: string | null;
    primaryColor?: string;
    currency?: string;
}) {
    const config = await getStoreSettings();

    const updated = await prisma.storeConfig.update({
        where: { id: config.id },
        data,
    });

    revalidatePath("/");
    revalidatePath("/admin/settings");
    return updated;
}
