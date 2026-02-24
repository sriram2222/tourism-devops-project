import PlaceCard from './PlaceCard';
import { Place } from '@/types';

interface PlacesGridProps {
  places: Place[];
  title?: string;
}

export default function PlacesGrid({ places, title }: PlacesGridProps) {
  if (places.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400">
        <div className="text-5xl mb-4">🌿</div>
        <p className="text-lg font-medium">No places yet.</p>
        <p className="text-sm mt-2">
          Add places from the{' '}
          <a href="/admin/dashboard" className="text-green-600 dark:text-green-400 underline">
            Admin Panel
          </a>
        </p>
      </div>
    );
  }

  return (
    <div>
      {title && (
        <h2 className="font-serif text-3xl font-bold text-gray-900 dark:text-white mb-8">{title}</h2>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
        {places.map((place, idx) => (
          <PlaceCard key={place.id} place={place} index={idx} />
        ))}
      </div>
    </div>
  );
}
