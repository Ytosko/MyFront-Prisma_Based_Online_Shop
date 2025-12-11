"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface SortSelectProps {
    defaultValue: string;
}

const sortOptions = [
    { value: "newest", label: "Newest" },
    { value: "oldest", label: "Oldest" },
    { value: "price-low", label: "Price: Low" },
    { value: "price-high", label: "Price: High" },
    { value: "name", label: "A-Z" },
];

export function SortSelect({ defaultValue }: SortSelectProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("sort", e.target.value);
        params.set("page", "1");
        router.push(`/products?${params.toString()}`);
    };

    return (
        <select
            defaultValue={defaultValue}
            onChange={handleChange}
            className="h-10 px-4 rounded-full bg-white border border-slate-200 text-slate-700 text-sm cursor-pointer hover:border-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
        >
            {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
    );
}
