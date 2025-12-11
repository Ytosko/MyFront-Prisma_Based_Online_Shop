"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function TopLoader() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Reset on route change complete
        setLoading(false);
        setProgress(100);
        const timer = setTimeout(() => setProgress(0), 200);
        return () => clearTimeout(timer);
    }, [pathname, searchParams]);

    useEffect(() => {
        let progressInterval: NodeJS.Timeout;

        const handleStart = () => {
            setLoading(true);
            setProgress(10);
            progressInterval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 90) return prev;
                    return prev + Math.random() * 10;
                });
            }, 200);
        };

        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const anchor = target.closest("a");
            if (anchor?.href && !anchor.target && !anchor.href.startsWith("#")) {
                const url = new URL(anchor.href);
                if (url.origin === window.location.origin && url.pathname !== pathname) {
                    handleStart();
                }
            }
        };

        document.addEventListener("click", handleClick);
        return () => {
            document.removeEventListener("click", handleClick);
            clearInterval(progressInterval);
        };
    }, [pathname]);

    if (!loading && progress === 0) return null;

    return (
        <div
            className="fixed top-0 left-0 right-0 z-[9999] h-1 bg-transparent"
            style={{ opacity: loading ? 1 : 0, transition: "opacity 200ms" }}
        >
            <div
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-lg shadow-indigo-500/50"
                style={{
                    width: `${progress}%`,
                    transition: loading ? "width 200ms ease" : "width 100ms ease",
                }}
            />
            {loading && (
                <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-white/30 to-transparent animate-pulse" />
            )}
        </div>
    );
}
