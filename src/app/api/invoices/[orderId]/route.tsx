import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: Promise<{ orderId: string }> }) {
    const { orderId } = await params;
    const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { items: { include: { product: true } } }
    });

    if (!order) return new NextResponse("Not found", { status: 404 });

    // Generate HTML invoice
    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Invoice #${order.id.slice(0, 8)}</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; }
        h1 { color: #333; border-bottom: 2px solid #333; padding-bottom: 10px; }
        .info { margin: 20px 0; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background: #f5f5f5; }
        .total { font-size: 1.2em; font-weight: bold; text-align: right; margin-top: 20px; }
        @media print { body { margin: 0; } }
    </style>
</head>
<body>
    <h1>Invoice #${order.id.slice(0, 8)}</h1>
    <div class="info">
        <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
        <p><strong>Status:</strong> ${order.status}</p>
    </div>
    <table>
        <thead>
            <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody>
            ${order.items.map((item: { product?: { name: string } | null; quantity: number; price: number }) => `
                <tr>
                    <td>${item.product?.name || 'Product'}</td>
                    <td>${item.quantity}</td>
                    <td>$${item.price.toFixed(2)}</td>
                    <td>$${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
            `).join('')}
        </tbody>
    </table>
    <div class="total">
        <p>Total: $${order.total.toFixed(2)}</p>
    </div>
    <script>window.onload = () => window.print();</script>
</body>
</html>
    `;

    return new NextResponse(html, {
        headers: {
            'Content-Type': 'text/html',
        },
    });
}
