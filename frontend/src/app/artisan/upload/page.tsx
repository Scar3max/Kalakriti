"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

/**
 * Upload Product Page — Full artisan listing workflow:
 * 1. Upload product image
 * 2. Record voice description
 * 3. Enter price
 * 4. Generate AI listing
 * 5. Review & Publish
 */

type Step = "upload" | "review" | "published";

export default function UploadPage() {
    const [step, setStep] = useState<Step>("upload");

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const user = JSON.parse(storedUser);
            if (user.role !== "artisan") {
                window.location.href = "/marketplace";
            }
        } else {
            window.location.href = "/auth";
        }
    }, []);

    // --- Upload state ---
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [price, setPrice] = useState("");
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    // --- AI Generated state ---
    const [generatedContent, setGeneratedContent] = useState<{
        title: string;
        description: string;
        cultural_story: string;
        category: string;
        tags: string[];
    } | null>(null);

    // Handle image upload
    const handleImageChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) {
                setImageFile(file);
                const reader = new FileReader();
                reader.onloadend = () => setImagePreview(reader.result as string);
                reader.readAsDataURL(file);
            }
        },
        []
    );

    // Voice recording handlers
    const startRecording = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) audioChunksRef.current.push(e.data);
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
                setAudioBlob(blob);
                setAudioUrl(URL.createObjectURL(blob));
                // Stop all tracks to release microphone
                stream.getTracks().forEach((t) => t.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (err) {
            alert("Microphone access is required to record your voice description.");
        }
    }, []);

    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    }, [isRecording]);

    const [productId, setProductId] = useState<string | null>(null);

    // Generate AI content via backend API
    const handleGenerate = useCallback(async () => {
        setIsGenerating(true);
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

            // 1. Upload Image
            const formDataImage = new FormData();
            formDataImage.append("file", imageFile!);
            const imgRes = await fetch(`${baseUrl}/api/upload/image`, {
                method: "POST",
                body: formDataImage,
            });
            const imgData = await imgRes.json();
            if (!imgRes.ok) throw new Error(imgData.detail || "Image upload failed");

            // 2. Upload Audio
            let uploadedAudioUrl = "";
            if (audioBlob) {
                const formDataAudio = new FormData();
                formDataAudio.append("file", audioBlob, "recording.webm");
                const audioRes = await fetch(`${baseUrl}/api/upload/audio`, {
                    method: "POST",
                    body: formDataAudio,
                });
                const audioData = await audioRes.json();
                if (!audioRes.ok) throw new Error(audioData.detail || "Audio upload failed");
                uploadedAudioUrl = audioData.url;
            }

            // 3. Create Product Draft
            const userStr = localStorage.getItem("user");
            const artisan_id = userStr ? JSON.parse(userStr).id : "dummy-artisan-id";

            const prodRes = await fetch(`${baseUrl}/api/products/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    artisan_id: artisan_id,
                    price: parseFloat(price),
                    image_url: imgData.url,
                    audio_url: uploadedAudioUrl || null,
                }),
            });
            const prodData = await prodRes.json();
            if (!prodRes.ok) throw new Error(prodData.detail || "Creating product failed");

            const newProductId = prodData.product_id;
            setProductId(newProductId);

            // 4. Trigger AI Generation
            const aiRes = await fetch(`${baseUrl}/api/products/${newProductId}/generate`, {
                method: "POST",
            });
            const aiData = await aiRes.json();
            if (!aiRes.ok) throw new Error(aiData.detail || "AI generation failed");

            setGeneratedContent({
                title: aiData.product.title || "AI Generated Title",
                description: aiData.product.full_description || "AI Generated Description",
                cultural_story: aiData.product.cultural_story || "AI Generated Cultural Story",
                category: aiData.product.category || "General",
                tags: aiData.product.tags || ["craft"],
            });

            setStep("review");
        } catch (err: any) {
            alert(err.message);
        } finally {
            setIsGenerating(false);
        }
    }, [imageFile, audioBlob, price]);

    const handlePublish = useCallback(async () => {
        if (!productId) return;
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
            const res = await fetch(`${baseUrl}/api/products/${productId}/publish`, {
                method: "POST",
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.detail || "Failed to publish product");
            }
            setStep("published");
        } catch (err: any) {
            alert(err.message);
        }
    }, [productId]);

    return (
        <div className="min-h-screen bg-background">
            {/* Page header */}
            <div className="gradient-hero text-white py-10">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-2xl sm:text-3xl font-bold">
                        {step === "upload" && "List Your Product"}
                        {step === "review" && "Review AI-Generated Listing"}
                        {step === "published" && "Product Published! 🎉"}
                    </h1>
                    <p className="text-white/70 mt-2 text-sm">
                        {step === "upload" &&
                            "Upload an image, record a voice description, and let AI create your listing."}
                        {step === "review" && "Review the AI-generated content and edit if needed."}
                        {step === "published" && "Your product is now live on the marketplace."}
                    </p>

                    {/* Progress steps */}
                    <div className="mt-6 flex items-center gap-3">
                        {["Upload", "Review", "Published"].map((label, idx) => {
                            const stepMap: Step[] = ["upload", "review", "published"];
                            const current = stepMap.indexOf(step);
                            const isActive = idx <= current;
                            return (
                                <div key={label} className="flex items-center gap-3">
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${isActive
                                            ? "gradient-saffron text-white"
                                            : "bg-white/20 text-white/50"
                                            }`}
                                    >
                                        {idx + 1}
                                    </div>
                                    <span
                                        className={`text-sm ${isActive ? "text-white" : "text-white/40"}`}
                                    >
                                        {label}
                                    </span>
                                    {idx < 2 && (
                                        <div
                                            className={`w-8 h-0.5 ${idx < current ? "bg-saffron-light" : "bg-white/20"
                                                }`}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* ===== STEP 1: UPLOAD ===== */}
                {step === "upload" && (
                    <div className="space-y-8">
                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-semibold mb-3">
                                Product Image
                            </label>
                            <div className="border-2 border-dashed border-border rounded-2xl p-8 text-center hover:border-primary/50 transition-colors">
                                {imagePreview ? (
                                    <div className="relative">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="max-h-64 mx-auto rounded-lg object-contain"
                                        />
                                        <button
                                            onClick={() => {
                                                setImageFile(null);
                                                setImagePreview(null);
                                            }}
                                            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="text-4xl mb-3">📸</div>
                                        <p className="text-muted-foreground text-sm mb-3">
                                            Drag & drop or click to upload a photo of your craft
                                        </p>
                                        <input
                                            type="file"
                                            accept="image/jpeg,image/png,image/webp"
                                            onChange={handleImageChange}
                                            className="hidden"
                                            id="image-upload"
                                        />
                                        <label
                                            htmlFor="image-upload"
                                            className="inline-flex items-center justify-center rounded-full border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors"
                                        >
                                            Choose Image
                                        </label>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Voice Recording */}
                        <div>
                            <label className="block text-sm font-semibold mb-3">
                                Voice Description
                            </label>
                            <p className="text-sm text-muted-foreground mb-3">
                                Record yourself describing your craft in any language. Talk about
                                materials, techniques, and the story behind it.
                            </p>

                            <div className="flex items-center gap-4">
                                {!isRecording && !audioUrl && (
                                    <Button
                                        onClick={startRecording}
                                        className="rounded-full gradient-saffron text-white border-0 gap-2 hover:opacity-90"
                                    >
                                        <span className="w-3 h-3 rounded-full bg-white animate-pulse" />
                                        Start Recording
                                    </Button>
                                )}

                                {isRecording && (
                                    <Button
                                        onClick={stopRecording}
                                        variant="destructive"
                                        className="rounded-full gap-2"
                                    >
                                        <span className="w-3 h-3 rounded-full bg-white animate-pulse" />
                                        Stop Recording
                                    </Button>
                                )}

                                {audioUrl && (
                                    <div className="flex items-center gap-3 flex-1">
                                        <audio src={audioUrl} controls className="flex-1 h-10" />
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="rounded-full text-xs"
                                            onClick={() => {
                                                setAudioBlob(null);
                                                setAudioUrl(null);
                                            }}
                                        >
                                            Re-record
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Price */}
                        <div>
                            <label className="block text-sm font-semibold mb-3">Price (₹)</label>
                            <Input
                                type="number"
                                placeholder="Enter price in INR"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="max-w-xs rounded-lg"
                            />
                        </div>

                        <Separator />

                        {/* Generate button */}
                        <Button
                            size="lg"
                            onClick={handleGenerate}
                            disabled={!imagePreview || !price || isGenerating}
                            className="w-full rounded-xl gradient-saffron text-white border-0 font-semibold text-base h-14 hover:opacity-90 disabled:opacity-40"
                        >
                            {isGenerating ? (
                                <span className="flex items-center gap-2">
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    AI is generating your listing...
                                </span>
                            ) : (
                                "✨ Generate AI Listing"
                            )}
                        </Button>
                    </div>
                )}

                {/* ===== STEP 2: REVIEW ===== */}
                {step === "review" && generatedContent && (
                    <div className="space-y-6">
                        {/* Preview card */}
                        <div className="rounded-2xl border border-border bg-card overflow-hidden">
                            {imagePreview && (
                                <img
                                    src={imagePreview}
                                    alt="Product"
                                    className="w-full aspect-[16/9] object-cover"
                                />
                            )}
                            <div className="p-6 space-y-4">
                                <Badge variant="secondary" className="text-xs">
                                    {generatedContent.category}
                                </Badge>
                                <h2 className="text-2xl font-bold">{generatedContent.title}</h2>
                                <p className="text-2xl font-extrabold text-gradient">
                                    ₹{Number(price).toLocaleString("en-IN")}
                                </p>
                                <Separator />
                                <div>
                                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                                        Description
                                    </h3>
                                    <p className="text-foreground/80 leading-relaxed text-sm">
                                        {generatedContent.description}
                                    </p>
                                </div>
                                <div className="p-4 rounded-xl bg-accent/50 border border-border">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span>📖</span>
                                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                                            Cultural Story
                                        </h3>
                                    </div>
                                    <p className="text-foreground/80 leading-relaxed text-sm">
                                        {generatedContent.cultural_story}
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {generatedContent.tags.map((tag) => (
                                        <Badge key={tag} variant="outline" className="text-xs">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                className="flex-1 rounded-xl h-12"
                                onClick={() => setStep("upload")}
                            >
                                ← Edit
                            </Button>
                            <Button
                                className="flex-1 rounded-xl h-12 gradient-saffron text-white border-0 font-semibold hover:opacity-90"
                                onClick={handlePublish}
                            >
                                Publish to Marketplace
                            </Button>
                        </div>
                    </div>
                )}

                {/* ===== STEP 3: PUBLISHED ===== */}
                {step === "published" && (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">🎉</div>
                        <h2 className="text-3xl font-bold mb-3">
                            Your Product is <span className="text-gradient">Live!</span>
                        </h2>
                        <p className="text-muted-foreground max-w-md mx-auto mb-8">
                            Your craft has been published to the marketplace. Buyers can now
                            discover and order your beautiful creation.
                        </p>
                        <div className="flex flex-wrap justify-center gap-3">
                            <Button
                                className="rounded-full gradient-saffron text-white border-0 px-8 hover:opacity-90"
                                onClick={() => {
                                    setStep("upload");
                                    setImageFile(null);
                                    setImagePreview(null);
                                    setPrice("");
                                    setAudioBlob(null);
                                    setAudioUrl(null);
                                    setGeneratedContent(null);
                                }}
                            >
                                List Another Product
                            </Button>
                            <a href="/artisan/dashboard">
                                <Button variant="outline" className="rounded-full px-8">
                                    Go to Dashboard
                                </Button>
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
