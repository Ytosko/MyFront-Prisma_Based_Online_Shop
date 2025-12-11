import { getStoreSettings } from "@/app/actions/settings";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy",
    description: "Our privacy policy explains how we collect, use, and protect your personal information.",
};

export default async function PrivacyPage() {
    const config = await getStoreSettings();

    return (
        <div className="max-w-4xl mx-auto px-4 py-16">
            <h1 className="text-4xl font-bold text-slate-900 mb-8">Privacy Policy</h1>
            <div className="prose prose-slate prose-lg max-w-none">
                <p className="text-slate-500 text-lg mb-8">
                    Last updated: {new Date().toLocaleDateString()}
                </p>

                <section className="mb-10">
                    <h2 className="text-2xl font-semibold text-slate-900 mb-4">1. Information We Collect</h2>
                    <p className="text-slate-600 mb-4">
                        At {config.storeName}, we collect information you provide directly to us, including:
                    </p>
                    <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
                        <li>Name, email address, and contact information</li>
                        <li>Billing and shipping addresses</li>
                        <li>Payment information (processed securely through our payment providers)</li>
                        <li>Order history and preferences</li>
                        <li>Communications with our support team</li>
                    </ul>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-semibold text-slate-900 mb-4">2. How We Use Your Information</h2>
                    <p className="text-slate-600 mb-4">
                        We use the information we collect to:
                    </p>
                    <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
                        <li>Process and fulfill your orders</li>
                        <li>Send order confirmations and updates</li>
                        <li>Respond to your inquiries and support requests</li>
                        <li>Improve our products and services</li>
                        <li>Send promotional communications (with your consent)</li>
                    </ul>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-semibold text-slate-900 mb-4">3. Information Sharing</h2>
                    <p className="text-slate-600">
                        We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as necessary to provide our services (e.g., shipping carriers, payment processors).
                    </p>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-semibold text-slate-900 mb-4">4. Data Security</h2>
                    <p className="text-slate-600">
                        We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                    </p>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-semibold text-slate-900 mb-4">5. Your Rights</h2>
                    <p className="text-slate-600 mb-4">
                        You have the right to:
                    </p>
                    <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
                        <li>Access your personal data</li>
                        <li>Request correction of inaccurate data</li>
                        <li>Request deletion of your data</li>
                        <li>Opt-out of marketing communications</li>
                    </ul>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-semibold text-slate-900 mb-4">6. Contact Us</h2>
                    <p className="text-slate-600">
                        If you have any questions about this Privacy Policy, please contact us through our contact page.
                    </p>
                </section>
            </div>
        </div>
    );
}
