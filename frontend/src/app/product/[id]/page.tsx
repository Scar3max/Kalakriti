"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

/**
 * Product detail page — displays image gallery, price, description,
 * cultural story, artisan profile, and contact/order buttons.
 */

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const productId = params?.id as string;

    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isOrdering, setIsOrdering] = useState(false);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        const fetchProduct = async () => {
            try {
                const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
                const res = await fetch(`${baseUrl}/api/products/${productId}`);
                if (res.ok) {
                    const data = await res.json();
                    setProduct(data.product);
                } else {
                    router.push("/marketplace");
                }
            } catch (err) {
                console.error("Failed to fetch product:", err);
                router.push("/marketplace");
            } finally {
                setLoading(false);
            }
        };
        if (productId) {
            fetchProduct();
        }
    }, [productId, router]);

    const handleOrder = async () => {
        setIsOrdering(true);
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
            const res = await fetch(`${baseUrl}/api/orders/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ product_id: productId })
            });
            const data = await res.json();
            if (res.ok) {
                alert(`Order Placed Successfully! Prototype Order ID: ${data.order_id}`);
            } else {
                throw new Error(data.detail || "Failed to place order.");
            }
        } catch (err: any) {
            alert(err.message);
        } finally {
            setIsOrdering(false);
        }
    };

    const handleContact = () => {
        const phone = product?.artisans?.phone || "";
        const message = `Hello ${product?.artisans?.name}, I am interested in your product: ${product?.title}`;
        if (phone) {
            window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
        } else {
            alert(`Thanks for your interest! The artisan ${product?.artisans?.name} will be notified.`);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
        );
    }

    if (!product) return null;

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
                    <Link href="/" className="hover:text-foreground transition-colors">
                        Home
                    </Link>
                    <span>/</span>
                    <Link href="/marketplace" className="hover:text-foreground transition-colors">
                        Marketplace
                    </Link>
                    <span>/</span>
                    <span className="text-foreground">{product.title}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Image */}
                    <div>
                        <div className="rounded-2xl overflow-hidden border border-border bg-muted aspect-[4/5]">
                            <img
                                src={product.image_url || "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=900&h=1100&fit=crop"}
                                alt={product.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    {/* Details */}
                    <div className="flex flex-col">
                        {/* Category badge */}
                        <Badge variant="secondary" className="w-fit mb-3 text-xs">
                            {product.category || "General"}
                        </Badge>

                        <h1 className="text-3xl sm:text-4xl font-bold leading-tight">
                            {product.title}
                        </h1>

                        {/* Price */}
                        <div className="mt-4 flex items-baseline gap-2">
                            <span className="text-3xl font-extrabold text-gradient">
                                ₹{product.price ? product.price.toLocaleString("en-IN") : '0'}
                            </span>
                            <span className="text-sm text-muted-foreground">inclusive of all taxes</span>
                        </div>

                        <Separator className="my-6" />

                        {/* Description */}
                        <div>
                            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                                Description
                            </h2>
                            <p className="text-foreground/80 leading-relaxed">
                                {product.full_description || product.short_description || "Description not available."}
                            </p>
                        </div>

                        {/* Tags */}
                        {product.tags && product.tags.length > 0 && (
                            <div className="mt-6 flex flex-wrap gap-2">
                                {product.tags.map((tag: string) => (
                                    <Badge key={tag} variant="outline" className="text-xs">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        )}

                        <Separator className="my-6" />

                        {/* Cultural Story */}
                        {product.cultural_story && (
                            <>
                                <div className="p-5 rounded-xl bg-accent/50 border border-border">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-xl">📖</span>
                                        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                                            Cultural Story
                                        </h2>
                                    </div>
                                    <p className="text-foreground/80 leading-relaxed text-sm">
                                        {product.cultural_story}
                                    </p>
                                </div>
                                <Separator className="my-6" />
                            </>
                        )}

                        {/* Artisan Profile */}
                        <div className="flex items-start gap-4">
                            <div className="w-14 h-14 rounded-full gradient-saffron flex items-center justify-center shrink-0">
                                <span className="text-white text-xl font-bold">
                                    {product.artisans?.name ? product.artisans.name[0] : "A"}
                                </span>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">{product.artisans?.name || "Unknown Artisan"}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {product.artisans?.location || "India"}
                                </p>
                                <p className="text-sm text-foreground/70 mt-2 leading-relaxed">
                                    {product.artisans?.bio || "Connecting traditional art with the modern world."}
                                </p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-8 flex flex-wrap gap-3 w-full">
                            {user?.role === "artisan" ? (
                                <div className="w-full p-4 rounded-xl bg-orange-50 border border-orange-100 text-orange-800 text-sm">
                                    <span className="font-semibold text-orange-900">Note:</span> Artisans cannot place orders for items. Please log in with a Buyer account to purchase.
                                </div>
                            ) : (
                                <>
                                    <Button
                                        size="lg"
                                        onClick={handleOrder}
                                        disabled={isOrdering || !user}
                                        className="rounded-full gradient-saffron text-white border-0 px-8 font-semibold hover:opacity-90 transition-opacity flex-1 sm:flex-none"
                                    >
                                        {!user ? "Log in to Order" : isOrdering ? "Placing Order..." : "Place Order"}
                                    </Button>
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        onClick={handleContact}
                                        className="rounded-full px-8 flex-1 sm:flex-none"
                                    >
                                        Contact Artisan
                                    </Button>
                                </>
                            )}
                        </div>

                        {user?.role !== "artisan" && (
                            <p className="mt-3 text-xs text-muted-foreground">
                                * This is a prototype order — no real payment will be charged.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
