"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

/**
 * Main navigation bar — sticky, glassmorphism background.
 * Links: Home, Marketplace, Dashboard (artisan), Upload.
 */
export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [user, setUser] = useState<{ name: string; role: string; email: string } | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleSignOut = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        window.location.href = "/";
    };

    return (
        <header className="sticky top-0 z-50 glass border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-9 h-9 rounded-lg gradient-saffron flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                            <span className="text-white font-bold text-lg">K</span>
                        </div>
                        <span className="text-xl font-bold tracking-tight">
                            <span className="text-gradient">Kala</span>
                            <span className="text-foreground">-Kriti</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-1">
                        <Link
                            href="/"
                            className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent transition-colors"
                        >
                            Home
                        </Link>
                        <Link
                            href="/marketplace"
                            className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent transition-colors"
                        >
                            Marketplace
                        </Link>
                        {user?.role === "artisan" && (
                            <>
                                <Link
                                    href="/artisan/dashboard"
                                    className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent transition-colors"
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href="/artisan/upload"
                                    className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent transition-colors"
                                >
                                    List Product
                                </Link>
                            </>
                        )}
                    </nav>

                    {/* Desktop CTA */}
                    <div className="hidden md:flex items-center gap-3">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-medium">Hi, {user.name}</span>
                                <Button onClick={handleSignOut} variant="outline" size="sm" className="rounded-full">
                                    Sign Out
                                </Button>
                            </div>
                        ) : (
                            <>
                                <Link href="/auth">
                                    <Button variant="outline" size="sm" className="rounded-full">
                                        Sign In
                                    </Button>
                                </Link>
                                <Link href="/auth?mode=register">
                                    <Button
                                        size="sm"
                                        className="rounded-full gradient-saffron text-white border-0 hover:opacity-90 transition-opacity"
                                    >
                                        Join as Artisan
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile hamburger */}
                    <button
                        className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Toggle menu"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            {mobileOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl">
                    <nav className="flex flex-col px-4 py-4 gap-1">
                        <Link
                            href="/"
                            className="px-4 py-3 rounded-lg text-sm font-medium hover:bg-accent transition-colors"
                            onClick={() => setMobileOpen(false)}
                        >
                            Home
                        </Link>
                        <Link
                            href="/marketplace"
                            className="px-4 py-3 rounded-lg text-sm font-medium hover:bg-accent transition-colors"
                            onClick={() => setMobileOpen(false)}
                        >
                            Marketplace
                        </Link>
                        {user?.role === "artisan" && (
                            <>
                                <Link
                                    href="/artisan/dashboard"
                                    className="px-4 py-3 rounded-lg text-sm font-medium hover:bg-accent transition-colors"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href="/artisan/upload"
                                    className="px-4 py-3 rounded-lg text-sm font-medium hover:bg-accent transition-colors"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    List Product
                                </Link>
                            </>
                        )}
                        <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-border/50">
                            {user ? (
                                <>
                                    <div className="px-4 py-2 text-sm font-medium text-center">
                                        Hi, {user.name}
                                    </div>
                                    <Button
                                        onClick={() => {
                                            handleSignOut();
                                            setMobileOpen(false);
                                        }}
                                        variant="outline"
                                        className="w-full rounded-full"
                                        size="sm"
                                    >
                                        Sign Out
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Link href="/auth" className="flex-1 w-full" onClick={() => setMobileOpen(false)}>
                                        <Button variant="outline" className="w-full rounded-full" size="sm">
                                            Sign In
                                        </Button>
                                    </Link>
                                    <Link href="/auth?mode=register" className="flex-1 w-full" onClick={() => setMobileOpen(false)}>
                                        <Button
                                            className="w-full rounded-full gradient-saffron text-white border-0"
                                            size="sm"
                                        >
                                            Join as Artisan
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}
