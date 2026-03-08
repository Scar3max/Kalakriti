"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

/**
 * Marketplace page — browse all products with search, category,
 * and region filters. Grid layout with animated cards.
 */

const categories = ["All", "Pottery", "Textiles", "Painting", "Metal Craft", "Paper Craft", "Wood Craft", "Jewelry"];
const regions = ["All", "Rajasthan", "Varanasi", "Chhattisgarh", "Bihar", "Kashmir", "Lucknow", "Maharashtra", "West Bengal", "Karnataka"];

export default function MarketplacePage() {
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedRegion, setSelectedRegion] = useState("All");
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
                const res = await fetch(`${baseUrl}/api/products/`);
                if (res.ok) {
                    const data = await res.json();
                    setProducts(data.products || []);
                }
            } catch (err) {
                console.error("Failed to fetch products:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const filtered = products.filter((p) => {
        const matchSearch = !search || p.title?.toLowerCase().includes(search.toLowerCase()) || p.artisans?.name?.toLowerCase().includes(search.toLowerCase());
        const matchCategory = selectedCategory === "All" || p.category === selectedCategory;
        const matchRegion = selectedRegion === "All"; // Simplify region matching since we might not have it in MVP or we can match on artisan location
        return matchSearch && matchCategory && matchRegion;
    });

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="gradient-hero text-white py-12 sm:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">
                        Explore the <span className="text-saffron-light">Marketplace</span>
                    </h1>
                    <p className="text-white/70 max-w-xl">
                        Discover authentic Indian handicrafts from artisans across the country.
                    </p>

                    {/* Search bar */}
                    <div className="mt-6 max-w-lg">
                        <div className="relative">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <Input
                                placeholder="Search crafts, artisans..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40 rounded-full h-12"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar filters */}
                    <aside className="lg:w-56 shrink-0">
                        <div className="sticky top-24 space-y-6">
                            {/* Category filter */}
                            <div>
                                <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">
                                    Category
                                </h3>
                                <div className="flex flex-wrap lg:flex-col gap-1.5">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => setSelectedCategory(cat)}
                                            className={`px-3 py-1.5 rounded-lg text-sm text-left transition-colors ${selectedCategory === cat
                                                ? "bg-primary text-primary-foreground font-medium"
                                                : "hover:bg-accent text-muted-foreground"
                                                }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Region filter */}
                            <div>
                                <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">
                                    Region
                                </h3>
                                <div className="flex flex-wrap lg:flex-col gap-1.5">
                                    {regions.map((reg) => (
                                        <button
                                            key={reg}
                                            onClick={() => setSelectedRegion(reg)}
                                            className={`px-3 py-1.5 rounded-lg text-sm text-left transition-colors ${selectedRegion === reg
                                                ? "bg-primary text-primary-foreground font-medium"
                                                : "hover:bg-accent text-muted-foreground"
                                                }`}
                                        >
                                            {reg}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Product grid */}
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-6">
                            <p className="text-sm text-muted-foreground">
                                Showing <strong>{filtered.length}</strong> products
                            </p>
                        </div>

                        {loading ? (
                            <div className="text-center py-20">
                                <div className="w-8 h-8 mx-auto border-2 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
                                <h3 className="text-lg font-semibold">Loading marketplace...</h3>
                            </div>
                        ) : filtered.length === 0 ? (
                            <div className="text-center py-20">
                                <div className="text-4xl mb-3">🔍</div>
                                <h3 className="text-lg font-semibold mb-1">No products found</h3>
                                <p className="text-sm text-muted-foreground">
                                    Try adjusting your search or filters.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                {filtered.map((product) => (
                                    <Link key={product.id} href={`/product/${product.id}`} className="group block">
                                        <div className="card-hover rounded-xl overflow-hidden border border-border bg-card">
                                            <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                                                <img
                                                    src={product.image_url || "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=600&h=750&fit=crop"}
                                                    alt={product.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                                <div className="absolute top-3 left-3">
                                                    <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-xs font-medium">
                                                        {product.category || "Craft"}
                                                    </Badge>
                                                </div>
                                                <div className="absolute bottom-3 right-3">
                                                    <span className="px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-sm text-white text-sm font-semibold">
                                                        ₹{product.price ? product.price.toLocaleString("en-IN") : '0'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="p-4">
                                                <h3 className="font-semibold text-sm leading-snug line-clamp-2">
                                                    {product.title}
                                                </h3>
                                                <div className="mt-2 flex items-center gap-2">
                                                    <div className="w-5 h-5 rounded-full gradient-saffron flex items-center justify-center">
                                                        <span className="text-white text-[10px] font-bold">
                                                            {product.artisans?.name ? product.artisans.name[0] : "A"}
                                                        </span>
                                                    </div>
                                                    <span className="text-xs text-muted-foreground">
                                                        {product.artisans?.name || "Unknown Artisan"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
