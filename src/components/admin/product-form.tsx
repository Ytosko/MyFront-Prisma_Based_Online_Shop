"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTransition } from "react";
import { generateDescriptionAction, upsertProduct } from "@/app/actions/product";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Wand2, Image as ImageIcon, Upload, X } from "lucide-react";
import { useState } from "react";

const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    price: z.number().min(0),
    stock: z.number().int().min(0),
    images: z.string().optional(),
    category: z.string().optional(),
});

const categories = [
    "Electronics",
    "Clothing",
    "Home & Garden",
    "Sports",
    "Beauty",
    "Kitchen",
    "Books",
    "Toys",
    "Pet",
    "Office",
];

interface Product {
    id?: string;
    name?: string;
    description?: string;
    price?: number;
    stock?: number;
    images?: string;
    category?: string;
}

export function ProductForm({ product }: { product?: Product }) {
    const [isPending, startTransition] = useTransition();
    const [isGenerating, startGeneration] = useTransition();
    const [imageUrl, setImageUrl] = useState<string>(
        product?.images ? JSON.parse(product.images)[0] || "" : ""
    );

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: product?.name || "",
            description: product?.description || "",
            price: product?.price || 0,
            stock: product?.stock || 0,
            images: product?.images || "[]",
            category: product?.category || "",
        },
    });

    async function onGenerate() {
        const name = form.getValues("name");
        if (!name) return;

        startGeneration(async () => {
            const desc = await generateDescriptionAction(name);
            if (desc) {
                form.setValue("description", desc);
            }
        });
    }

    function handleImageChange(url: string) {
        setImageUrl(url);
        form.setValue("images", JSON.stringify(url ? [url] : []));
    }

    function onSubmit(values: z.infer<typeof formSchema>) {
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
            formData.append(key, String(value));
        });
        if (product?.id) {
            formData.append("id", product.id);
        } else {
            formData.append("id", "new");
        }

        startTransition(async () => {
            await upsertProduct(undefined, formData);
        });
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl">
                {/* Basic Info */}
                <div className="bg-card rounded-xl p-6 border shadow-sm space-y-6">
                    <h3 className="text-lg font-semibold">Basic Information</h3>

                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Product Name *</FormLabel>
                                <FormControl>
                                    <Input placeholder="Premium Wireless Headphones" {...field} className="h-11" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex gap-2 items-end">
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="High-quality product with premium features..."
                                            {...field}
                                            rows={4}
                                            className="resize-none"
                                        />
                                    </FormControl>
                                    <FormDescription>Write a compelling product description</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={onGenerate}
                            disabled={isGenerating}
                            title="Generate with AI"
                            className="mb-6 h-11 w-11"
                        >
                            {isGenerating ? <Loader2 className="h-5 w-5 animate-spin" /> : <Wand2 className="h-5 w-5" />}
                        </Button>
                    </div>

                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <FormControl>
                                    <select
                                        {...field}
                                        className="w-full h-11 rounded-md border bg-background px-3 text-sm"
                                    >
                                        <option value="">Select a category</option>
                                        {categories.map((cat) => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Pricing & Inventory */}
                <div className="bg-card rounded-xl p-6 border shadow-sm space-y-6">
                    <h3 className="text-lg font-semibold">Pricing & Inventory</h3>

                    <div className="grid md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Price ($) *</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                {...field}
                                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                                className="h-11 pl-7"
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="stock"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Stock Quantity *</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            {...field}
                                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                            className="h-11"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                {/* Product Image */}
                <div className="bg-card rounded-xl p-6 border shadow-sm space-y-6">
                    <h3 className="text-lg font-semibold">Product Image</h3>

                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <Input
                                type="url"
                                placeholder="https://example.com/image.jpg"
                                value={imageUrl}
                                onChange={(e) => handleImageChange(e.target.value)}
                                className="h-11 flex-1"
                            />
                            {imageUrl && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleImageChange("")}
                                    className="h-11 w-11"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            )}
                        </div>

                        {imageUrl ? (
                            <div className="relative aspect-video max-w-md rounded-xl overflow-hidden border bg-muted">
                                <img
                                    src={imageUrl}
                                    alt="Product preview"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = "https://placehold.co/400x400/e2e8f0/64748b?text=Invalid+URL";
                                    }}
                                />
                            </div>
                        ) : (
                            <div className="aspect-video max-w-md rounded-xl border-2 border-dashed flex flex-col items-center justify-center text-muted-foreground bg-muted/30">
                                <ImageIcon className="h-12 w-12 mb-2 opacity-50" />
                                <p className="text-sm">Enter an image URL above</p>
                                <p className="text-xs">Recommended: 800x800 or larger</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex gap-4">
                    <Button type="submit" disabled={isPending} className="h-12 px-8">
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {product ? "Update Product" : "Create Product"}
                    </Button>
                    <Button type="button" variant="outline" className="h-12 px-8" asChild>
                        <a href="/admin/products">Cancel</a>
                    </Button>
                </div>
            </form>
        </Form>
    );
}
