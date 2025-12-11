"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
import { generateProductDescription } from "@/lib/gemini"

const productSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, "Name is required"),
    description: z.string(),
    price: z.coerce.number().min(0, "Price must be positive"),
    stock: z.coerce.number().int().min(0),
    images: z.string().optional(), // JSON
})

export type ProductState = {
    message?: string
    errors?: Record<string, string[]>
}

export async function upsertProduct(prevState: ProductState, formData: FormData) {
    const rawData = Object.fromEntries(formData.entries())
    const validated = productSchema.safeParse(rawData)

    if (!validated.success) {
        return { message: "Validation error", errors: validated.error.flatten().fieldErrors }
    }

    const { id, ...data } = validated.data

    const productId = id && id !== 'new' ? id : undefined;

    try {
        if (productId) {
            await prisma.product.update({
                where: { id: productId },
                data,
            })
        } else {
            await prisma.product.create({
                data,
            })
        }
    } catch (e) {
        console.error(e)
        return { message: "Database Error" }
    }

    revalidatePath("/admin/products")
    redirect("/admin/products")
}

export async function generateDescriptionAction(name: string) {
    if (!name) return ""
    return await generateProductDescription(name)
}
