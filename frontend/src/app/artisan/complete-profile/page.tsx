"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function CompleteProfilePage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [craftType, setCraftType] = useState("");
    const [bio, setBio] = useState("");
    const [state, setState] = useState("");
    const [city, setCity] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const userStr = localStorage.getItem("user");
        if (userStr) {
            const user = JSON.parse(userStr);
            if (user.name) setName(user.name);
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Not authenticated");

            const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
            const res = await fetch(`${baseUrl}/api/artisans/profile`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    name,
                    craft_type: craftType,
                    bio,
                    state,
                    city
                })
            });

            const data = await res.json();
            if (!res.ok) {
                // If it already exists, just proceed
                if (data.detail === "Artisan profile already exists" || res.status === 400) {
                    router.push("/artisan/dashboard");
                    return;
                }
                throw new Error(data.detail || "Failed to create profile");
            }

            router.push("/artisan/dashboard");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4">
            <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-8">
                <h2 className="text-2xl font-bold text-center mb-1">Complete Your Artisan Profile</h2>
                <p className="text-sm text-muted-foreground text-center mb-6">
                    Tell buyers about your craft to get started
                </p>

                {error && (
                    <div className="p-3 mb-4 text-sm text-red-500 bg-red-50 rounded-lg">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm font-medium mb-1.5 block">Display Name</label>
                        <Input
                            placeholder="Your name or studio name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium mb-1.5 block">Craft Type</label>
                        <Input
                            placeholder="e.g. Pottery, Textile, Woodwork"
                            value={craftType}
                            onChange={(e) => setCraftType(e.target.value)}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium mb-1.5 block">State</label>
                            <Input
                                placeholder="e.g. Rajasthan"
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1.5 block">City</label>
                            <Input
                                placeholder="e.g. Jaipur"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium mb-1.5 block">Bio / Your Story</label>
                        <Textarea
                            placeholder="Tell buyers about your journey and traditional techniques..."
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            className="h-24"
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 rounded-xl gradient-saffron text-white font-semibold"
                    >
                        {loading ? "Saving..." : "Complete Profile"}
                    </Button>
                </form>
            </div>
        </div>
    );
}
