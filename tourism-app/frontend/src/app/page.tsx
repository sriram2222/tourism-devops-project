import HeroSlider from "@/components/HeroSlider";
import StatsBar from "@/components/StatsBar";
import RegionCards from "@/components/RegionCards";
import WhyVisit from "@/components/WhyVisit";
import SearchSection from "@/components/SearchSection";
import FeaturedPlaces from "@/components/FeaturedPlaces";
import GalleryPreview from "@/components/GalleryPreview";

export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <StatsBar />
      <RegionCards />
      <WhyVisit />
      <SearchSection />
      <FeaturedPlaces />
      <GalleryPreview />
    </>
  );
}
