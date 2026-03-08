/**
 * API client for communicating with the Kala-Kriti FastAPI backend.
 * All API calls are centralized here.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Generic fetch wrapper with error handling.
 */
async function apiFetch<T>(
    endpoint: string,
    options?: RequestInit
): Promise<T> {
    const res = await fetch(`${API_BASE}${endpoint}`, {
        headers: {
            "Content-Type": "application/json",
            ...options?.headers,
        },
        ...options,
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({ detail: "Unknown error" }));
        throw new Error(error.detail || `API error: ${res.status}`);
    }

    return res.json();
}

// --- Auth ---
export const authAPI = {
    register: (data: {
        name: string;
        email: string;
        password: string;
        role: string;
        phone?: string;
        location?: string;
    }) => apiFetch("/api/auth/register", { method: "POST", body: JSON.stringify(data) }),

    login: (email: string, password: string) =>
        apiFetch(`/api/auth/login?email=${email}&password=${password}`, { method: "POST" }),
};

// --- Products ---
export const productsAPI = {
    list: (params?: {
        category?: string;
        craft_type?: string;
        region?: string;
        search?: string;
        page?: number;
        limit?: number;
    }) => {
        const query = new URLSearchParams();
        if (params) {
            Object.entries(params).forEach(([key, val]) => {
                if (val !== undefined) query.append(key, String(val));
            });
        }
        return apiFetch(`/api/products/?${query.toString()}`);
    },

    get: (id: string) => apiFetch(`/api/products/${id}`),

    create: (data: { price: number; image_url?: string; audio_url?: string }) =>
        apiFetch("/api/products/", { method: "POST", body: JSON.stringify(data) }),

    update: (id: string, data: Record<string, unknown>) =>
        apiFetch(`/api/products/${id}`, { method: "PUT", body: JSON.stringify(data) }),

    generateAI: (id: string) =>
        apiFetch(`/api/products/${id}/generate`, { method: "POST" }),

    publish: (id: string) =>
        apiFetch(`/api/products/${id}/publish`, { method: "POST" }),
};

// --- Upload ---
export const uploadAPI = {
    image: async (file: File): Promise<{ url: string }> => {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch(`${API_BASE}/api/upload/image`, {
            method: "POST",
            body: formData,
        });
        if (!res.ok) throw new Error("Image upload failed");
        return res.json();
    },

    audio: async (blob: Blob): Promise<{ url: string }> => {
        const formData = new FormData();
        formData.append("file", blob, "recording.webm");
        const res = await fetch(`${API_BASE}/api/upload/audio`, {
            method: "POST",
            body: formData,
        });
        if (!res.ok) throw new Error("Audio upload failed");
        return res.json();
    },
};

// --- Artisans ---
export const artisansAPI = {
    get: (id: string) => apiFetch(`/api/artisans/${id}`),
    updateProfile: (id: string, data: Record<string, unknown>) =>
        apiFetch(`/api/artisans/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    getProducts: (id: string) => apiFetch(`/api/artisans/${id}/products`),
};

// --- Orders ---
export const ordersAPI = {
    place: (data: {
        product_id: string;
        buyer_name: string;
        buyer_email: string;
        buyer_phone?: string;
        message?: string;
    }) => apiFetch("/api/orders/", { method: "POST", body: JSON.stringify(data) }),

    get: (id: string) => apiFetch(`/api/orders/${id}`),
};
