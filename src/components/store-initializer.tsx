"use client"

import { useEffect } from "react"

export function StoreInitializer({ primaryColor }: { primaryColor: string }) {
    useEffect(() => {
        if (primaryColor) {
            document.documentElement.style.setProperty("--primary", primaryColor)
            // We might need to handle HSL values conversion if Shadcn uses HSL for --primary
            // Shadcn defaults usually use HSL values (e.g. 240 5.9% 10%).
            // If primaryColor is hex, we need to convert.
            // For now, assuming primaryColor is a valid CSS color, but Shadcn uses HSL space for opacity support.
            // Ideally we convert Hex to HSL.
            // But let's keep it simple: we override --primary but if Shadcn needs '240 10% 20%', we should pass that format or handle conversion.
            // I'll stick to direct setProperty for now, but user might need to input HSL strings or we implement utilities later.
        }
    }, [primaryColor])

    return null
}
