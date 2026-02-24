export interface PlaceImage {
  id: number;
  url: string;
  caption: string | null;
  is_primary: boolean;
}

export interface Place {
  id: number;
  region_id: number;
  region_name: string;
  name: string;
  slug: string;
  category: string;
  short_description: string;
  full_description: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  entry_fee: string;
  timings: string;
  best_time_to_visit: string;
  distance_from_city: string;
  is_featured: boolean;
  is_active: boolean;
  primary_image: string | null;
  images: PlaceImage[];
}

export interface Region {
  id: number;
  name: string;
  slug: string;
  description: string;
  banner_image: string | null;
}

export interface GalleryItem {
  id: number;
  region_id: number | null;
  title: string | null;
  image_url: string;
  tag: string | null;
  created_at: string;
}
