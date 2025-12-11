import { getOrders } from "@/app/actions/order";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { FileText, Eye } from "lucide-react";
import Link from "next/link";

const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-500",
    PAID: "bg-blue-500",
    SHIPPED: "bg-purple-500",
    COMPLETED: "bg-green-500",
    CANCELLED: "bg-red-500",
};

export default async function OrdersPage() {
    const orders = await getOrders() as Array<{
        id: string;
        total: number;
        status: string;
        createdAt: Date;
        user: { email: string } | null;
        items: Array<{ id: string }>;
        invoice: { id: string } | null;
    }>;

    return (
        <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
            </div>
            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Items</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center h-24">
                                    No orders yet.
                                </TableCell>
                            </TableRow>
                        ) : (
                            orders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-mono text-xs">
                                        {order.id.slice(0, 8)}...
                                    </TableCell>
                                    <TableCell>{order.user?.email || "Guest"}</TableCell>
                                    <TableCell>{order.items.length} items</TableCell>
                                    <TableCell className="font-medium">
                                        ${order.total.toFixed(2)}
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={statusColors[order.status] || "bg-gray-500"}>
                                            {order.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Link href={`/admin/orders/${order.id}`}>
                                            <Button variant="ghost" size="sm">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        {order.invoice && (
                                            <Link href={`/api/invoices/${order.id}`} target="_blank">
                                                <Button variant="ghost" size="sm">
                                                    <FileText className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
