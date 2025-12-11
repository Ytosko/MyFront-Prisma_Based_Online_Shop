"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, Loader2 } from "lucide-react";

interface StoreConfig {
    id: string;
    storeName: string;
    storeDescription: string | null;
    logoUrl: string | null;
    primaryColor: string;
    currency: string;
}

export default function SettingsPage() {
    const [config, setConfig] = useState<StoreConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetch("/api/settings")
            .then((res) => res.json())
            .then((data) => {
                setConfig(data);
                setLoading(false);
            });
    }, []);

    const handleSave = async () => {
        if (!config) return;
        setSaving(true);
        await fetch("/api/settings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(config),
        });
        setSaving(false);
        alert("Settings saved!");
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!config) return null;

    return (
        <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Store Settings</h1>
                <Button onClick={handleSave} disabled={saving}>
                    {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Save Changes
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>General</CardTitle>
                        <CardDescription>Basic store information</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="storeName">Store Name</Label>
                            <Input
                                id="storeName"
                                value={config.storeName}
                                onChange={(e) => setConfig({ ...config, storeName: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label htmlFor="storeDescription">Description</Label>
                            <Textarea
                                id="storeDescription"
                                value={config.storeDescription || ""}
                                onChange={(e) => setConfig({ ...config, storeDescription: e.target.value })}
                                rows={3}
                            />
                        </div>
                        <div>
                            <Label htmlFor="currency">Currency</Label>
                            <Input
                                id="currency"
                                value={config.currency}
                                onChange={(e) => setConfig({ ...config, currency: e.target.value })}
                                placeholder="USD"
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Branding</CardTitle>
                        <CardDescription>Customize your store appearance</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="logoUrl">Logo URL</Label>
                            <Input
                                id="logoUrl"
                                value={config.logoUrl || ""}
                                onChange={(e) => setConfig({ ...config, logoUrl: e.target.value })}
                                placeholder="https://example.com/logo.png"
                            />
                        </div>
                        <div>
                            <Label htmlFor="primaryColor">Primary Color</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="primaryColor"
                                    type="color"
                                    value={config.primaryColor}
                                    onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                                    className="w-20 h-10 p-1"
                                />
                                <Input
                                    value={config.primaryColor}
                                    onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                                    placeholder="#6366f1"
                                />
                            </div>
                        </div>
                        <div className="pt-4">
                            <Label>Preview</Label>
                            <div
                                className="mt-2 p-4 rounded-lg text-white font-medium"
                                style={{ backgroundColor: config.primaryColor }}
                            >
                                {config.storeName}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
