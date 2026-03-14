import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("tourism_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== "undefined") {
      if (window.location.pathname.startsWith("/admin/dashboard")) {
        localStorage.removeItem("tourism_token");
        window.location.href = "/admin/login";
      }
    }
    return Promise.reject(err);
  }
);

export const placesApi = {
  getAll:   (params?: Record<string, string>) => api.get("/places/", { params }),
  getBySlug:(slug: string) => api.get(`/places/${slug}`),
  getRegions:() => api.get("/places/regions"),
  create:   (data: Record<string, unknown>) => api.post("/places/", data),
  update:   (id: number, data: Record<string, unknown>) => api.put(`/places/${id}`, data),
  delete:   (id: number) => api.delete(`/places/${id}`),
};

export const galleryApi = {
  getAll:   (params?: Record<string, string>) => api.get("/gallery/", { params }),
  create:   (data: FormData) =>
    api.post("/gallery/", data, { headers: { "Content-Type": "multipart/form-data" } }),
  update:   (id: number, data: Record<string, unknown>) => api.put(`/gallery/${id}`, data),  
  delete:   (id: number) => api.delete(`/gallery/${id}`),
};

export const authApi = {
  login: (username: string, password: string) =>
    api.post("/auth/login", { username, password }),
  me: () => api.get("/auth/me"),
};

export const uploadApi = {
  uploadImage: (file: File, placeId?: number, isPrimary?: boolean) => {
    const form = new FormData();
    form.append("file", file);
    if (placeId)    form.append("place_id",  String(placeId));
    if (isPrimary)  form.append("is_primary", "true");
    return api.post("/upload/image", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  deleteImage: (imageId: number) => api.delete(`/upload/image/${imageId}`),
};

export default api;
