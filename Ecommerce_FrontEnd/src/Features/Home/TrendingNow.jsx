"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "@/components/ui/button";
import { useEffect, useCallback } from "react";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price || 0);

const SectionTitle = ({ title }) => (
  <div className="text-center mb-8 md:mb-10">
    <h2 className="font-serif text-2xl md:text-[28px] text-[#1E2C24] tracking-wide">{title}</h2>
    <div className="flex justify-center mt-3">
      <div className="relative w-24 h-px bg-[#E8DFC6]">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-0.5 bg-[#0B3D2E]" />
      </div>
    </div>
  </div>
);

const trendingProducts = [
  {
    id: 1,
    name: "Mul Cotton",

    image: "https://aditistories.com/wp-content/uploads/2025/07/onam-collections-11-S-scaled.jpg",
    badge: "Trending"
  },
  {
    id: 2,
    name: "Lotus Charm Bangles",

    image: "https://i.etsystatic.com/63417411/r/il/fe2c35/7655716099/il_1140xN.7655716099_p53s.jpg",
    badge: "Hot"
  },
  {
    id: 3,
    name: "Kerala Tissue Set Mund",

    image: "https://i.pinimg.com/736x/1a/ea/8b/1aea8b0c5b6c3b39723b577de439714f.jpg",
    badge: "Bestseller"
  },
  {
    id: 4,
    name: "Gold Plated Necklace",

    image: "https://i.pinimg.com/736x/f4/8a/ef/f48aef09665010cbb2cc0a4ad13e4ce3.jpg",
    badge: "New"
  }
];

const TrendingCard = ({ product, onClick }) => {
  return (
    <div
      className="group cursor-pointer bg-[#FFFFFF] border border-[#E8DFC6] rounded-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
    >
      <div className="relative aspect-square bg-[#F7F3EB] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />


        <div className="absolute top-3 right-3">
          <span className="px-2 py-0.5 text-[10px] font-semibold text-white bg-[#D4AF37] rounded-sm uppercase tracking-wide">
            {product.badge}
          </span>
        </div>
      </div>

      <div className="px-3 py-3 md:px-4 md:py-4">
        <h3 className="font-serif text-sm md:text-base text-[#1E2C24] line-clamp-2 mb-2 min-h-[2.5rem] group-hover:text-[#0B3D2E] transition-colors">
          {product.name}
        </h3>
        
      </div>
    </div>
  );
};

const TrendingNow = ({ onProductClick }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: true,
    skipSnaps: false,
    dragFree: false,
    containScroll: "trimSnaps",
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  // Auto-scroll every 3 seconds
  useEffect(() => {
    if (!emblaApi) return;

    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 3000);

    return () => clearInterval(interval);
  }, [emblaApi]);

  return (
    <section className="w-full bg-[#FFFDF8] py-10 md:py-14 border-t border-[#E8DFC6]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        <SectionTitle title="Trending Now" />

        <div className="relative px-6 md:px-8">
          <button
            type="button"
            onClick={scrollPrev}
            className="absolute left-0 md:-left-5 top-[38%] -translate-y-1/2 z-10 w-9 h-9 md:w-10 md:h-10 rounded-full bg-white border border-[#E8DFC6] shadow-sm flex items-center justify-center hover:bg-[#F7F3EB] transition-colors"
            aria-label="Previous products"
          >
            <ChevronLeft className="h-5 w-5 text-[#4B4B4B]" />
          </button>

          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {trendingProducts.map((product) => (
                <div
                  key={product.id}
                  className="min-w-0 shrink-0 w-full sm:w-[60%] md:w-[40%] lg:w-[30%] xl:w-[25%] px-2"
                >
                  <TrendingCard
                    product={product}
                    onClick={() => onProductClick?.(product.id)}
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={scrollNext}
            className="absolute -right-2 md:-right-5 top-[38%] -translate-y-1/2 z-10 w-9 h-9 md:w-10 md:h-10 rounded-full bg-white border border-[#E8DFC6] shadow-sm flex items-center justify-center hover:bg-[#F7F3EB] transition-colors"
            aria-label="Next products"
          >
            <ChevronRight className="h-5 w-5 text-[#4B4B4B]" />
          </button>
        </div>

        
      </div>
    </section>
  );
};

export default TrendingNow;
