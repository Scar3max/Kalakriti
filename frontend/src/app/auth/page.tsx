"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

/**
 * Auth page — Login / Register with role selection.
 * Mode is controlled via ?mode=register query param.
 */

function AuthContent() {
    const searchParams = useSearchParams();
    const router = useRouter(); // add this import
    const initialMode = searchParams.get("mode") === "register" ? "register" : "login";
    const [mode, setMode] = useState<"login" | "register">(initialMode);
    const [role, setRole] = useState<"buyer" | "artisan">("buyer");

    // Form state
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

            const payload = mode === "login"
                ? { email, password }
                : { email, password, name, role, phone };

            const res = await fetch(`${baseUrl}${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.detail || "Something went wrong");
            }

            if (mode === "login") {
                // Store token and user data
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));

                // Redirect based on role
                if (data.user.role === "artisan") {
                    try {
                        const profRes = await fetch(`${baseUrl}/api/artisans/${data.user.id}`);
                        if (profRes.ok) {
                            window.location.href = "/artisan/dashboard";
                        } else {
                            window.location.href = "/artisan/complete-profile";
                        }
                    } catch {
                        window.location.href = "/artisan/complete-profile";
                    }
                } else {
                    window.location.href = "/marketplace";
                }
            } else {
                // Registration successful, switch to login
                alert("Account created successfully! Please check your email to verify your account before logging in.");
                setMode("login");
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl gradient-saffron flex items-center justify-center shadow-md">
                            <span className="text-white font-bold text-xl">K</span>
                        </div>
                        <span className="text-2xl font-bold">
                            <span className="text-gradient">Kala</span>-Kriti
                        </span>
                    </Link>
                </div>

                {/* Card */}
                <div className="rounded-2xl border border-border bg-card p-8">
                    <h2 className="text-2xl font-bold text-center mb-1">
                        {mode === "login" ? "Welcome Back" : "Create Account"}
                    </h2>
                    <p className="text-sm text-muted-foreground text-center mb-6">
                        {mode === "login"
                            ? "Sign in to your Kala-Kriti account"
                            : "Join the Kala-Kriti marketplace"}
                    </p>

                    {error && (
                        <div className="p-3 mb-4 text-sm text-red-500 bg-red-50 rounded-lg">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {mode === "register" && (
                            <>
                                <div>
                                    <label className="text-sm font-medium mb-1.5 block">Full Name</label>
                                    <Input
                                        placeholder="Enter your full name"
                                        className="rounded-lg"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>

                                {/* Role selector */}
                                <div>
                                    <label className="text-sm font-medium mb-1.5 block">I am a</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {(["buyer", "artisan"] as const).map((r) => (
                                            <button
                                                key={r}
                                                type="button"
                                                onClick={() => setRole(r)}
                                                className={`p-3 rounded-xl border text-center transition-all ${role === r
                                                    ? "border-primary bg-primary/5 text-foreground"
                                                    : "border-border text-muted-foreground hover:border-primary/40"
                                                    }`}
                                            >
                                                <div className="text-2xl mb-1">
                                                    {r === "buyer" ? "🛍️" : "🎨"}
                                                </div>
                                                <div className="text-sm font-medium capitalize">{r}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {role === "artisan" && (
                                    <div>
                                        <label className="text-sm font-medium mb-1.5 block">Phone Number</label>
                                        <Input
                                            placeholder="+91 XXXXX XXXXX"
                                            className="rounded-lg"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                        />
                                    </div>
                                )}
                            </>
                        )}

                        <div>
                            <label className="text-sm font-medium mb-1.5 block">Email</label>
                            <Input
                                type="email"
                                placeholder="you@example.com"
                                className="rounded-lg"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-1.5 block">Password</label>
                            <Input
                                type="password"
                                placeholder="Enter your password"
                                className="rounded-lg"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-xl h-12 gradient-saffron text-white border-0 font-semibold text-base hover:opacity-90 disabled:opacity-50"
                        >
                            {loading ? "Please wait..." : (mode === "login" ? "Sign In" : "Create Account")}
                        </Button>
                    </form>

                    <Separator className="my-6" />

                    <p className="text-sm text-center text-muted-foreground">
                        {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
                        <button
                            onClick={() => {
                                setMode(mode === "login" ? "register" : "login");
                                setError("");
                            }}
                            className="text-primary font-medium hover:underline"
                        >
                            {mode === "login" ? "Sign Up" : "Sign In"}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function AuthPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
        }>
            <AuthContent />
        </Suspense>
    );
}
