"use client";

import { useState } from "react";
import { submitContact } from "@/app/actions/contact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone, Send, CheckCircle, Loader2 } from "lucide-react";

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const result = await submitContact(formData);

        if (result.error) {
            setError(result.error);
        } else {
            setSubmitted(true);
        }
        setIsSubmitting(false);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-16">
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Get in Touch</h1>
                <p className="text-lg text-slate-500 max-w-xl mx-auto">
                    Have a question or feedback? We'd love to hear from you.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-12">
                {/* Contact Info */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <div className="p-3 rounded-xl bg-indigo-100 w-fit mb-4">
                            <Mail className="w-6 h-6 text-indigo-600" />
                        </div>
                        <h3 className="text-slate-900 font-semibold mb-2">Email</h3>
                        <p className="text-slate-500 text-sm">support@example.com</p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <div className="p-3 rounded-xl bg-purple-100 w-fit mb-4">
                            <Phone className="w-6 h-6 text-purple-600" />
                        </div>
                        <h3 className="text-slate-900 font-semibold mb-2">Phone</h3>
                        <p className="text-slate-500 text-sm">+1 (555) 123-4567</p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <div className="p-3 rounded-xl bg-pink-100 w-fit mb-4">
                            <MapPin className="w-6 h-6 text-pink-600" />
                        </div>
                        <h3 className="text-slate-900 font-semibold mb-2">Address</h3>
                        <p className="text-slate-500 text-sm">123 Shop Street<br />New York, NY 10001</p>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="md:col-span-2">
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                        {submitted ? (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle className="w-8 h-8 text-green-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-3">Message Sent!</h3>
                                <p className="text-slate-500">
                                    Thank you for reaching out. We'll get back to you soon.
                                </p>
                                <Button
                                    className="mt-8"
                                    onClick={() => setSubmitted(false)}
                                    variant="outline"
                                >
                                    Send Another Message
                                </Button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Name *</label>
                                        <Input
                                            name="name"
                                            required
                                            placeholder="John Doe"
                                            className="h-12 rounded-xl"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Email *</label>
                                        <Input
                                            name="email"
                                            type="email"
                                            required
                                            placeholder="john@example.com"
                                            className="h-12 rounded-xl"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Subject</label>
                                    <Input
                                        name="subject"
                                        placeholder="How can we help?"
                                        className="h-12 rounded-xl"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Message *</label>
                                    <Textarea
                                        name="message"
                                        required
                                        placeholder="Tell us more about your inquiry..."
                                        rows={6}
                                        className="rounded-xl resize-none"
                                    />
                                </div>

                                {error && (
                                    <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
                                        {error}
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="h-12 px-8 bg-indigo-600 hover:bg-indigo-700 rounded-full font-medium"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4 mr-2" />
                                            Send Message
                                        </>
                                    )}
                                </Button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
