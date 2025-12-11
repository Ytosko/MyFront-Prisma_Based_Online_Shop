import { getContacts, updateContactStatus, deleteContact } from "@/app/actions/contact";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Trash2, CheckCircle, Clock, MessageSquare } from "lucide-react";
import { revalidatePath } from "next/cache";

type Contact = {
    id: string;
    name: string;
    email: string;
    subject: string | null;
    message: string;
    status: string;
    createdAt: Date;
};

export default async function AdminContactsPage() {
    const contacts = await getContacts() as Contact[];

    const newCount = contacts.filter(c => c.status === "NEW").length;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Contact Messages</h1>
                    <p className="text-muted-foreground">View and manage customer inquiries</p>
                </div>
                {newCount > 0 && (
                    <div className="px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-600 text-sm font-medium">
                        {newCount} new message{newCount > 1 ? "s" : ""}
                    </div>
                )}
            </div>

            {contacts.length === 0 ? (
                <Card className="border-0 shadow-lg">
                    <CardContent className="py-16 text-center">
                        <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                        <h3 className="text-lg font-semibold mb-2">No messages yet</h3>
                        <p className="text-muted-foreground">
                            Customer messages will appear here when they use the contact form.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {contacts.map((contact) => (
                        <Card key={contact.id} className={`border-0 shadow-lg overflow-hidden ${contact.status === "NEW" ? "ring-2 ring-indigo-500/20" : ""}`}>
                            <div className={`h-1 ${contact.status === "NEW" ? "bg-indigo-500" : contact.status === "READ" ? "bg-amber-500" : "bg-green-500"}`} />
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600">
                                            <Mail className="h-4 w-4 text-white" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg">{contact.name}</CardTitle>
                                            <p className="text-sm text-muted-foreground">{contact.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${contact.status === "NEW"
                                                ? "bg-indigo-100 text-indigo-700"
                                                : contact.status === "READ"
                                                    ? "bg-amber-100 text-amber-700"
                                                    : "bg-green-100 text-green-700"
                                            }`}>
                                            {contact.status === "NEW" && <Clock className="inline h-3 w-3 mr-1" />}
                                            {contact.status === "REPLIED" && <CheckCircle className="inline h-3 w-3 mr-1" />}
                                            {contact.status}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {new Date(contact.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {contact.subject && (
                                    <p className="font-medium mb-2">Subject: {contact.subject}</p>
                                )}
                                <p className="text-muted-foreground whitespace-pre-wrap">{contact.message}</p>

                                <div className="flex gap-2 mt-6 pt-4 border-t">
                                    {contact.status === "NEW" && (
                                        <form action={async () => {
                                            "use server";
                                            await updateContactStatus(contact.id, "READ");
                                        }}>
                                            <Button type="submit" variant="outline" size="sm">
                                                Mark as Read
                                            </Button>
                                        </form>
                                    )}
                                    {contact.status !== "REPLIED" && (
                                        <form action={async () => {
                                            "use server";
                                            await updateContactStatus(contact.id, "REPLIED");
                                        }}>
                                            <Button type="submit" variant="outline" size="sm" className="text-green-600">
                                                <CheckCircle className="h-4 w-4 mr-1" />
                                                Mark as Replied
                                            </Button>
                                        </form>
                                    )}
                                    <form action={async () => {
                                        "use server";
                                        await deleteContact(contact.id);
                                    }}>
                                        <Button type="submit" variant="outline" size="sm" className="text-red-600">
                                            <Trash2 className="h-4 w-4 mr-1" />
                                            Delete
                                        </Button>
                                    </form>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
