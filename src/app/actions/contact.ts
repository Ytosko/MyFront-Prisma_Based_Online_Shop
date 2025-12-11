"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function submitContact(formData: FormData) {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const subject = formData.get("subject") as string;
    const message = formData.get("message") as string;

    if (!name || !email || !message) {
        return { error: "Please fill in all required fields" };
    }

    try {
        await prisma.contact.create({
            data: {
                name,
                email,
                subject: subject || null,
                message,
            },
        });

        return { success: true };
    } catch (error) {
        console.error("Failed to submit contact:", error);
        return { error: "Failed to submit. Please try again." };
    }
}

export async function getContacts() {
    return prisma.contact.findMany({
        orderBy: { createdAt: "desc" },
    });
}

export async function updateContactStatus(id: string, status: string) {
    await prisma.contact.update({
        where: { id },
        data: { status },
    });
    revalidatePath("/admin/contacts");
}

export async function deleteContact(id: string) {
    await prisma.contact.delete({
        where: { id },
    });
    revalidatePath("/admin/contacts");
}
