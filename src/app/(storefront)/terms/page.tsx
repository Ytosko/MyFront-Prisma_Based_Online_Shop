import { getStoreSettings } from "@/app/actions/settings";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms of Service",
    description: "Our terms of service outline the rules and regulations for using our website.",
};

export default async function TermsPage() {
    const config = await getStoreSettings();

    return (
        <div className="max-w-4xl mx-auto px-4 py-16">
            <h1 className="text-4xl font-bold text-slate-900 mb-8">Terms of Service</h1>
            <div className="prose prose-slate prose-lg max-w-none">
                <p className="text-slate-500 text-lg mb-8">
                    Last updated: {new Date().toLocaleDateString()}
                </p>

                <section className="mb-10">
                    <h2 className="text-2xl font-semibold text-slate-900 mb-4">1. Acceptance of Terms</h2>
                    <p className="text-slate-600">
                        By accessing and using {config.storeName}, you accept and agree to be bound by these Terms of Service.
                    </p>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-semibold text-slate-900 mb-4">2. Products and Services</h2>
                    <p className="text-slate-600 mb-4">
                        All products are subject to availability. We reserve the right to:
                    </p>
                    <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
                        <li>Limit quantities available for purchase</li>
                        <li>Discontinue any product at any time</li>
                        <li>Modify product descriptions and pricing</li>
                    </ul>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-semibold text-slate-900 mb-4">3. Pricing and Payment</h2>
                    <p className="text-slate-600">
                        All prices are displayed in the store's configured currency. Payment must be received before order processing begins.
                    </p>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-semibold text-slate-900 mb-4">4. Shipping and Delivery</h2>
                    <p className="text-slate-600">
                        Shipping times are estimates and not guarantees. We are not responsible for delays caused by carriers or other factors beyond our control.
                    </p>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-semibold text-slate-900 mb-4">5. Returns and Refunds</h2>
                    <p className="text-slate-600 mb-4">
                        We accept returns within 30 days of delivery for most items. Items must be:
                    </p>
                    <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
                        <li>Unused and in original condition</li>
                        <li>In original packaging</li>
                        <li>Accompanied by proof of purchase</li>
                    </ul>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-semibold text-slate-900 mb-4">6. Contact</h2>
                    <p className="text-slate-600">
                        For questions about these Terms of Service, please contact us through our contact page.
                    </p>
                </section>
            </div>
        </div>
    );
}
