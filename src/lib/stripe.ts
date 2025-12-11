import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

export const stripe = stripeSecretKey
    ? new Stripe(stripeSecretKey, {
        apiVersion: "2023-10-16",
    })
    : null;

export async function createCheckoutSession(
    items: Array<{ name: string; price: number; quantity: number; image?: string }>,
    successUrl: string,
    cancelUrl: string,
    metadata?: Record<string, string>
) {
    if (!stripe) {
        throw new Error("Stripe not configured");
    }

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((item) => ({
        price_data: {
            currency: "usd",
            product_data: {
                name: item.name,
                images: item.image ? [item.image] : [],
            },
            unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata,
    });

    return session;
}

export async function verifyWebhookSignature(
    payload: string | Buffer,
    signature: string,
    endpointSecret: string
): Promise<Stripe.Event> {
    if (!stripe) {
        throw new Error("Stripe not configured");
    }

    return stripe.webhooks.constructEvent(payload, signature, endpointSecret);
}
