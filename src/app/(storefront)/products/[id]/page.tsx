import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ProductDetailClient } from "@/components/storefront/product-detail-client";

export default async function ProductDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const product = await prisma.product.findUnique({
        where: { id },
    });

    if (!product) {
        notFound();
    }

    return <ProductDetailClient product={product} />;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const product = await prisma.product.findUnique({ where: { id } });

    if (!product) {
        return { title: "Product Not Found" };
    }

    return {
        title: product.name,
        description: product.description.slice(0, 160),
    };
}
