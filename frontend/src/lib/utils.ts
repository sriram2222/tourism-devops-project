import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getImageUrl(path: string | null | undefined): string {
  if (!path) return "/images/placeholder.jpg";

  // if already full URL
  if (path.startsWith("http")) return path;

  const base = "http://localhost:5000";

  // if backend already sending /api/uploads/...
  if (path.startsWith("/api/uploads")) {
    return `${base}${path}`;
  }

  // if only filename
  return `${base}/api/uploads/${path}`;
}



export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const CATEGORY_COLORS: Record<string, string> = {
  nature:    "bg-green-600 text-white",
  temple:    "bg-orange-600 text-white",
  waterfall: "bg-blue-600 text-white",
  dam:       "bg-cyan-600 text-white",
  viewpoint: "bg-purple-600 text-white",
  market:    "bg-yellow-600 text-white",
  other:     "bg-gray-600 text-white",
};

export const CATEGORY_GRADIENTS: Record<string, string> = {
  nature:    "from-green-900 to-green-700",
  temple:    "from-orange-900 to-orange-700",
  waterfall: "from-blue-900 to-blue-700",
  dam:       "from-cyan-900 to-cyan-700",
  viewpoint: "from-purple-900 to-purple-700",
  market:    "from-yellow-900 to-yellow-700",
  other:     "from-gray-900 to-gray-700",
};
