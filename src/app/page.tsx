import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedCategories from "@/components/FeaturedCategories";
import FeaturedDishes from "@/components/FeaturedDishes";
import Reviews from "@/components/Reviews";
import GalleryPreview from "@/components/GalleryPreview";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <FeaturedCategories />
      <FeaturedDishes />
      <Reviews />
      <GalleryPreview />
      <Newsletter />
      <Footer />
    </>
  );
}
