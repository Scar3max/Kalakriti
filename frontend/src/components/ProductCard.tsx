"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";

/**
 * Product card for marketplace grid display.
 * Shows image, title, price, artisan name, and category badge.
 */

interface ProductCardProps {
    id: string;
    title: string;
    price: number;
    image: string;
    artisan: string;
    category: string;
    location?: string;
}

export default function ProductCard({
    id,
    title,
    price,
    image,
    artisan,
    category,
    location,
}: ProductCardProps) {
    return (
        <Link href={`/product/${id}`} className="group block">
            <div className="card-hover rounded-xl overflow-hidden border border-border bg-card">
                {/* Image */}
                <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Category badge */}
                    <div className="absolute top-3 left-3">
                        <Badge
                            variant="secondary"
                            className="bg-white/90 backdrop-blur-sm text-xs font-medium"
                        >
                            {category}
                        </Badge>
                    </div>
                    {/* Price tag */}
                    <div className="absolute bottom-3 right-3">
                        <span className="px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-sm text-white text-sm font-semibold">
                            ₹{price.toLocaleString("en-IN")}
                        </span>
                    </div>
                </div>

                {/* Info */}
                <div className="p-4">
                    <h3 className="font-semibold text-sm leading-snug line-clamp-2 group-hover:text-saffron transition-colors">
                        {title}
                    </h3>
                    <div className="mt-2 flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full gradient-saffron flex items-center justify-center">
                            <span className="text-white text-[10px] font-bold">
                                {artisan[0]}
                            </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                            {artisan}
                            {location && ` · ${location}`}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
