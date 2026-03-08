"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

/**
 * Artisan Dashboard — View all products, profile summary,
 * and quick actions.
 */


export default function DashboardPage() {
    const [activeTab, setActiveTab] = useState<"products" | "profile">("products");
    const [user, setUser] = useState<any>(null);
    const [artisan, setArtisan] = useState<any>(null);
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);

            // Fetch Artisan Profile & Products
            const fetchData = async () => {
                const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
                try {
                    const profRes = await fetch(`${baseUrl}/api/artisans/${parsedUser.id}`);
                    if (profRes.ok) {
                        const profData = await profRes.json();
                        setArtisan(profData.profile);
                    }

                    const prodRes = await fetch(`${baseUrl}/api/artisans/${parsedUser.id}/products`);
                    if (prodRes.ok) {
                        const prodData = await prodRes.json();
                        setProducts(prodData.products || []);
                    }
                } catch (error) {
                    console.error("Failed to load artisan dashboard data:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        } else {
            // Not logged in -> Redirect
            window.location.href = "/auth";
        }
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background">
                <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
                <p className="text-muted-foreground">Loading your dashboard...</p>
            </div>
        );
    }

    if (!artisan) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6 text-center">
                <h2 className="text-2xl font-bold mb-2">Profile Missing</h2>
                <p className="text-muted-foreground mb-6">We could not find your artisan profile.</p>
                <Link href="/artisan/complete-profile">
                    <Button className="rounded-full gradient-saffron text-white border-0">
                        Complete Profile Now
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Dashboard header */}
            <div className="gradient-hero text-white py-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                        {/* Avatar */}
                        <div className="w-20 h-20 rounded-2xl background-glass flex items-center justify-center shadow-lg border border-white/20">
                            <span className="text-white text-3xl font-bold">
                                {artisan.name?.[0] || "?"}
                            </span>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h1 className="text-2xl font-bold">{artisan.name}</h1>
                                {artisan.verification_status === "verified" && (
                                    <Badge className="bg-jade text-white border-0 text-[10px]">✓ Verified</Badge>
                                )}
                            </div>
                            <p className="text-white/70 text-sm">
                                {artisan.craft_type} · {artisan.location}
                            </p>
                            <p className="text-white/50 text-sm mt-1">⭐ {artisan.rating} rating</p>
                        </div>
                        <div className="sm:ml-auto">
                            <Link href="/artisan/upload">
                                <Button className="rounded-full bg-white text-black hover:bg-white/90 border-0 px-6 font-semibold shadow-md">
                                    + List New Product
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="mt-8 grid grid-cols-3 gap-4 max-w-sm">
                        {[
                            { value: products.length, label: "Products" },
                            { value: 0, label: "Orders" },
                            { value: artisan.rating, label: "Rating" },
                        ].map((stat) => (
                            <div key={stat.label} className="text-center p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
                                <div className="text-xl font-bold text-white">{stat.value}</div>
                                <div className="text-xs text-white/60">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex gap-1 mb-8 border-b border-border text-sm overflow-x-auto custom-scrollbar">
                    {(["products", "profile"] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-3 font-medium capitalize border-b-2 transition-colors whitespace-nowrap ${activeTab === tab
                                ? "border-primary text-primary"
                                : "border-transparent text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            {tab === "products" ? "My Products" : "Profile Settings"}
                        </button>
                    ))}
                </div>

                {/* Products Tab */}
                {activeTab === "products" && (
                    <div className="space-y-4">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card card-hover shadow-sm"
                            >
                                <img
                                    src={product.image_url || "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=300&h=300&fit=crop"}
                                    alt={product.title}
                                    className="w-16 h-16 rounded-lg object-cover"
                                />
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-base truncate">{product.title || "Untitled Draft"}</h3>
                                    <p className="text-sm text-muted-foreground mt-0.5">
                                        ₹{product.price?.toLocaleString("en-IN") || 0}
                                    </p>
                                </div>
                                <Badge
                                    variant={product.status === "published" ? "default" : "secondary"}
                                    className={`text-xs ${product.status === "published" ? "bg-jade text-white border-0" : ""}`}
                                >
                                    {product.status}
                                </Badge>
                                <Link href={`/product/${product.id}`}>
                                    <Button variant="outline" size="sm" className="rounded-full text-xs">
                                        View
                                    </Button>
                                </Link>
                            </div>
                        ))}

                        {products.length === 0 && (
                            <div className="text-center py-20 px-4 border border-dashed border-border rounded-2xl bg-muted/30">
                                <div className="inline-flex w-16 h-16 rounded-full bg-primary/10 items-center justify-center text-primary text-2xl mb-4">
                                    🎨
                                </div>
                                <h3 className="text-lg font-semibold mb-2">No products yet</h3>
                                <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
                                    Start listing your handmade crafts to the marketplace to reach thousands of buyers.
                                </p>
                                <Link href="/artisan/upload">
                                    <Button className="rounded-full gradient-saffron text-white border-0 px-8">
                                        List Your First Product
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                )}

                {/* Profile Tab */}
                {activeTab === "profile" && (
                    <div className="max-w-xl space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 rounded-2xl border border-border bg-card shadow-sm">
                            <div className="col-span-full sm:col-span-1">
                                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Name</label>
                                <p className="mt-1 font-medium">{artisan.name}</p>
                            </div>
                            <div className="col-span-full sm:col-span-1">
                                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Craft Type</label>
                                <p className="mt-1 font-medium">{artisan.craft_type}</p>
                            </div>
                            <div className="col-span-full sm:col-span-1">
                                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Location</label>
                                <p className="mt-1 font-medium">{artisan.location}</p>
                            </div>
                            <div className="col-span-full sm:col-span-1">
                                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</label>
                                <div className="mt-1">
                                    <Badge variant="outline" className="capitalize">{artisan.verification_status}</Badge>
                                </div>
                            </div>
                            <div className="col-span-full">
                                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Bio</label>
                                <p className="mt-1 text-sm text-foreground/80 leading-relaxed">{artisan.bio}</p>
                            </div>
                        </div>

                        <div className="flex justify-end pt-2">
                            <Button variant="outline" className="rounded-full px-6">
                                Edit Profile details
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
