import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText, Package, User, CreditCard, Calendar } from "lucide-react";
import Link from "next/link";

const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-500",
    PAID: "bg-blue-500",
    SHIPPED: "bg-purple-500",
    COMPLETED: "bg-green-500",
    CANCELLED: "bg-red-500",
};

type OrderItem = {
    id: string;
    quantity: number;
    price: number;
    product: { id: string; name: string; images: string } | null;
};

type Order = {
    id: string;
    total: number;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    user: { id: string; email: string } | null;
    items: OrderItem[];
    invoice: { id: string } | null;
};

export default async function OrderDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const order = await prisma.order.findUnique({
        where: { id },
        include: {
            user: true,
            items: {
                include: { product: true },
            },
            invoice: true,
        },
    }) as Order | null;

    if (!order) {
        notFound();
    }

    return (
        <div className="flex flex-col gap-6 p-4 md:gap-8 md:p-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/orders">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Order Details</h1>
                        <p className="text-sm text-muted-foreground font-mono">#{order.id.slice(0, 8)}...</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Badge className={statusColors[order.status] || "bg-gray-500"}>
                        {order.status}
                    </Badge>
                    {order.invoice && (
                        <Link href={`/api/invoices/${order.id}`} target="_blank">
                            <Button variant="outline" size="sm">
                                <FileText className="h-4 w-4 mr-2" />
                                View Invoice
                            </Button>
                        </Link>
                    )}
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Order Info */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Package className="h-4 w-4" />
                            Order Info
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Order ID</span>
                            <span className="font-mono">{order.id.slice(0, 8)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Status</span>
                            <span>{order.status}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Items</span>
                            <span>{order.items.length}</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Customer Info */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Customer
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Email</span>
                            <span>{order.user?.email || "Guest"}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">User ID</span>
                            <span className="font-mono">{order.user?.id.slice(0, 8) || "N/A"}</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Payment Info */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            Payment
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Total</span>
                            <span className="font-bold">${order.total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Invoice</span>
                            <span>{order.invoice ? "Generated" : "Pending"}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Timeline */}
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Timeline
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-8 text-sm">
                        <div>
                            <span className="text-muted-foreground">Created</span>
                            <p className="font-medium">{new Date(order.createdAt).toLocaleString()}</p>
                        </div>
                        <div>
                            <span className="text-muted-foreground">Last Updated</span>
                            <p className="font-medium">{new Date(order.updatedAt).toLocaleString()}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
                <CardHeader>
                    <CardTitle>Order Items</CardTitle>
                    <CardDescription>Products in this order</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {order.items.map((item) => {
                            const images = item.product?.images ? JSON.parse(item.product.images) : [];
                            const imageUrl = images[0] || "https://placehold.co/100x100/e2e8f0/64748b?text=No+Image";

                            return (
                                <div key={item.id} className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                                    <img
                                        src={imageUrl}
                                        alt={item.product?.name || "Product"}
                                        className="w-16 h-16 rounded-lg object-cover"
                                    />
                                    <div className="flex-1">
                                        <h4 className="font-medium">{item.product?.name || "Unknown Product"}</h4>
                                        <p className="text-sm text-muted-foreground">
                                            Quantity: {item.quantity} × ${item.price.toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold">${(item.quantity * item.price).toFixed(2)}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-6 pt-6 border-t flex justify-end">
                        <div className="text-right">
                            <p className="text-sm text-muted-foreground">Total</p>
                            <p className="text-2xl font-bold">${order.total.toFixed(2)}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
