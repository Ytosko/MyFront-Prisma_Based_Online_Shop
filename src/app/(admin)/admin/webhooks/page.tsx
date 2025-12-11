"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, RefreshCw, Eye, EyeOff } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface Webhook {
    id: string;
    url: string;
    events: string;
    secret: string;
    active: boolean;
    createdAt: string;
}

const AVAILABLE_EVENTS = [
    "order.created",
    "order.updated",
    "order.completed",
    "order.cancelled",
];

export default function WebhooksPage() {
    const [webhooks, setWebhooks] = useState<Webhook[]>([]);
    const [loading, setLoading] = useState(true);
    const [showSecret, setShowSecret] = useState<Record<string, boolean>>({});
    const [newWebhook, setNewWebhook] = useState({ url: "", events: [] as string[] });
    const [dialogOpen, setDialogOpen] = useState(false);

    const fetchWebhooks = async () => {
        const res = await fetch("/api/webhooks");
        const data = await res.json();
        setWebhooks(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchWebhooks();
    }, []);

    const handleCreate = async () => {
        await fetch("/api/webhooks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newWebhook),
        });
        setNewWebhook({ url: "", events: [] });
        setDialogOpen(false);
        fetchWebhooks();
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this webhook?")) return;
        await fetch(`/api/webhooks/${id}`, { method: "DELETE" });
        fetchWebhooks();
    };

    const handleToggle = async (id: string, active: boolean) => {
        await fetch(`/api/webhooks/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ active: !active }),
        });
        fetchWebhooks();
    };

    const handleRegenerateSecret = async (id: string) => {
        await fetch(`/api/webhooks/${id}/regenerate`, { method: "POST" });
        fetchWebhooks();
    };

    return (
        <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Webhooks</h1>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Webhook
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add Webhook</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                            <div>
                                <Label htmlFor="url">Endpoint URL</Label>
                                <Input
                                    id="url"
                                    placeholder="https://example.com/webhook"
                                    value={newWebhook.url}
                                    onChange={(e) => setNewWebhook({ ...newWebhook, url: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label>Events</Label>
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    {AVAILABLE_EVENTS.map((event) => (
                                        <label key={event} className="flex items-center gap-2 text-sm">
                                            <Checkbox
                                                checked={newWebhook.events.includes(event)}
                                                onCheckedChange={(checked) => {
                                                    if (checked) {
                                                        setNewWebhook({ ...newWebhook, events: [...newWebhook.events, event] });
                                                    } else {
                                                        setNewWebhook({ ...newWebhook, events: newWebhook.events.filter((e) => e !== event) });
                                                    }
                                                }}
                                            />
                                            {event}
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <Button onClick={handleCreate} disabled={!newWebhook.url || newWebhook.events.length === 0}>
                                Create Webhook
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>URL</TableHead>
                            <TableHead>Events</TableHead>
                            <TableHead>Secret</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center h-24">Loading...</TableCell>
                            </TableRow>
                        ) : webhooks.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center h-24">
                                    No webhooks configured.
                                </TableCell>
                            </TableRow>
                        ) : (
                            webhooks.map((webhook) => (
                                <TableRow key={webhook.id}>
                                    <TableCell className="font-mono text-xs max-w-[200px] truncate">
                                        {webhook.url}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {JSON.parse(webhook.events).map((e: string) => (
                                                <Badge key={e} variant="secondary" className="text-xs">
                                                    {e}
                                                </Badge>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <code className="text-xs">
                                                {showSecret[webhook.id] ? webhook.secret.slice(0, 20) + "..." : "••••••••"}
                                            </code>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setShowSecret({ ...showSecret, [webhook.id]: !showSecret[webhook.id] })}
                                            >
                                                {showSecret[webhook.id] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                                            </Button>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={webhook.active ? "bg-green-500" : "bg-gray-500"}>
                                            {webhook.active ? "Active" : "Inactive"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right space-x-1">
                                        <Button variant="ghost" size="sm" onClick={() => handleToggle(webhook.id, webhook.active)}>
                                            {webhook.active ? "Disable" : "Enable"}
                                        </Button>
                                        <Button variant="ghost" size="sm" onClick={() => handleRegenerateSecret(webhook.id)}>
                                            <RefreshCw className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="sm" onClick={() => handleDelete(webhook.id)}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
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
