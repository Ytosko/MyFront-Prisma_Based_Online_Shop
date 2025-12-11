"use client";

import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/cart-store";
import { useCartDrawer } from "./cart-drawer";

export function CartButton() {
    const itemCount = useCartStore((state) => state.getItemCount());
    const { openDrawer } = useCartDrawer();

    return (
        <Button
            variant="outline"
            size="icon"
            className="relative"
            onClick={openDrawer}
        >
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
                    {itemCount > 99 ? "99+" : itemCount}
                </span>
            )}
        </Button>
    );
}
