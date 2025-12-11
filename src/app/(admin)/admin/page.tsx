import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DollarSign, ShoppingBag, Package, Activity, TrendingUp, ArrowUpRight, Clock, Users } from "lucide-react"
import { prisma } from "@/lib/prisma"
import Link from "next/link"

type Order = {
    id: string;
    total: number;
    status: string;
    createdAt: Date;
};

type Product = {
    id: string;
    name: string;
    price: number;
    stock: number;
};

export default async function Dashboard() {
    // Fetch real data
    const [orders, products, recentOrders] = await Promise.all([
        prisma.order.findMany() as Promise<Order[]>,
        prisma.product.findMany() as Promise<Product[]>,
        prisma.order.findMany({
            orderBy: { createdAt: "desc" },
            take: 5,
            include: { items: { include: { product: true } } },
        }),
    ]);

    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    const totalProducts = products.length;
    const lowStockProducts = products.filter((p) => p.stock <= 5).length;

    const stats = [
        {
            title: "Total Revenue",
            value: `$${totalRevenue.toFixed(2)}`,
            change: "+12.5%",
            icon: DollarSign,
            color: "from-green-500 to-emerald-600",
        },
        {
            title: "Total Orders",
            value: totalOrders.toString(),
            change: "+8.2%",
            icon: ShoppingBag,
            color: "from-blue-500 to-indigo-600",
        },
        {
            title: "Products",
            value: totalProducts.toString(),
            change: `${lowStockProducts} low stock`,
            icon: Package,
            color: "from-purple-500 to-violet-600",
        },
        {
            title: "Active Now",
            value: "1",
            change: "You're online",
            icon: Activity,
            color: "from-amber-500 to-orange-600",
        },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">Welcome back! Here's what's happening with your store.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" asChild>
                        <Link href="/admin/products/new">
                            <Package className="h-4 w-4 mr-2" />
                            Add Product
                        </Link>
                    </Button>
                    <Button asChild className="bg-gradient-to-r from-indigo-500 to-purple-600">
                        <Link href="/admin/orders">
                            View Orders
                            <ArrowUpRight className="h-4 w-4 ml-2" />
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, i) => (
                    <Card key={i} className="overflow-hidden border-0 shadow-lg">
                        <div className={`h-1 bg-gradient-to-r ${stat.color}`} />
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {stat.title}
                            </CardTitle>
                            <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color}`}>
                                <stat.icon className="h-4 w-4 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                <TrendingUp className="h-3 w-3 text-green-500" />
                                {stat.change}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Content Grid */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Recent Orders */}
                <Card className="shadow-lg border-0">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Recent Orders</CardTitle>
                                <CardDescription>Latest transactions from your store</CardDescription>
                            </div>
                            <Button variant="outline" size="sm" asChild>
                                <Link href="/admin/orders">View All</Link>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {recentOrders.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <ShoppingBag className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                <p>No orders yet</p>
                                <p className="text-sm">Orders will appear here when customers purchase</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {recentOrders.map((order: any) => (
                                    <div key={order.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                                        <div className="p-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600">
                                            <ShoppingBag className="h-4 w-4 text-white" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm truncate">
                                                Order #{order.id.slice(0, 8)}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {order.items.length} items
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold">${order.total.toFixed(2)}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="shadow-lg border-0">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>Common tasks you might want to do</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            <Link href="/admin/products/new" className="group">
                                <div className="p-4 rounded-xl border bg-card hover:bg-muted transition-colors">
                                    <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 w-fit mb-3 group-hover:scale-110 transition-transform">
                                        <Package className="h-5 w-5 text-white" />
                                    </div>
                                    <h4 className="font-semibold mb-1">Add Product</h4>
                                    <p className="text-xs text-muted-foreground">Create a new product listing</p>
                                </div>
                            </Link>
                            <Link href="/admin/settings" className="group">
                                <div className="p-4 rounded-xl border bg-card hover:bg-muted transition-colors">
                                    <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600 w-fit mb-3 group-hover:scale-110 transition-transform">
                                        <Users className="h-5 w-5 text-white" />
                                    </div>
                                    <h4 className="font-semibold mb-1">Store Settings</h4>
                                    <p className="text-xs text-muted-foreground">Customize your store</p>
                                </div>
                            </Link>
                            <Link href="/admin/orders" className="group">
                                <div className="p-4 rounded-xl border bg-card hover:bg-muted transition-colors">
                                    <div className="p-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 w-fit mb-3 group-hover:scale-110 transition-transform">
                                        <Clock className="h-5 w-5 text-white" />
                                    </div>
                                    <h4 className="font-semibold mb-1">Pending Orders</h4>
                                    <p className="text-xs text-muted-foreground">Review new orders</p>
                                </div>
                            </Link>
                            <Link href="/" target="_blank" className="group">
                                <div className="p-4 rounded-xl border bg-card hover:bg-muted transition-colors">
                                    <div className="p-3 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 w-fit mb-3 group-hover:scale-110 transition-transform">
                                        <ArrowUpRight className="h-5 w-5 text-white" />
                                    </div>
                                    <h4 className="font-semibold mb-1">View Store</h4>
                                    <p className="text-xs text-muted-foreground">See your live storefront</p>
                                </div>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
