interface Props { title: string; lat: number; lng: number; label: string; }

export default function MapEmbed({ title, lat, lng, label }: Props) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;

  return (
    <section className="bg-[#f0f5f0] dark:bg-[#0a150a] px-[5%] py-20">
      <p className="text-xs font-bold tracking-[0.25em] text-green-700 dark:text-green-400 uppercase mb-4">Location</p>
      <h2 className="font-serif text-4xl font-bold text-gray-900 dark:text-white mb-10">{title}</h2>
      <div className="rounded-2xl overflow-hidden h-[420px] border-2 border-gray-100 dark:border-gray-800 shadow-lg">
        {apiKey ? (
          <iframe
            src={`https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${lat},${lng}&zoom=12`}
            width="100%" height="100%" loading="lazy" allowFullScreen
            referrerPolicy="no-referrer-when-downgrade" className="border-none" />
        ) : (
          <div className="h-full bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center text-center px-6">
            <div className="text-6xl mb-5">🗺️</div>
            <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-3">{label}</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">Add a Google Maps API key to enable the interactive map</p>
            <code className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 px-4 py-2 rounded-lg text-xs text-green-700 dark:text-green-300 mb-5">
              NEXT_PUBLIC_GOOGLE_MAPS_KEY=your_key
            </code>
            <p className="text-xs text-gray-400 mb-4">Coordinates: <strong>{lat}° N, {lng}° E</strong></p>
            <a href={`https://www.google.com/maps?q=${lat},${lng}`} target="_blank" rel="noopener noreferrer"
              className="px-6 py-2.5 bg-green-700 text-white rounded-full text-sm font-semibold hover:bg-green-600 transition-colors">
              Open in Google Maps →
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
