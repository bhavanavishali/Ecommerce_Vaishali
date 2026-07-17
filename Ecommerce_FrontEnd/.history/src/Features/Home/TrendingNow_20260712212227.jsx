"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "@/components/ui/button";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price || 0);

const SectionTitle = ({ title }) => (
  <div className="text-center mb-8 md:mb-10">
    <h2 className="font-serif text-2xl md:text-[28px] text-gray-900 tracking-wide">{title}</h2>
    <div className="flex justify-center mt-3">
      <div className="relative w-24 h-px bg-gray-300">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-0.5 bg-gray-900" />
      </div>
    </div>
  </div>
);

const trendingProducts = [
  {
    id: 1,
    name: "Mul Cotton",
 
    image: "/placeholder.svg",
    badge: "Trending"
  },
  {
    id: 2,
    name: "Lotus Charm Bangles",
    
    image: "/placeholder.svg",
    badge: "Hot"
  },
  {
    id: 3,
    name: "Diamond Stud Collection",
 
    image: "/placeholder.svg",
    badge: "Bestseller"
  }
];

const TrendingCard = ({ product, onClick }) => {
  return (
    <div
      className="group cursor-pointer bg-white border border-gray-200 rounded-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
    >
      <div className="relative aspect-square bg-[#f8f6f3] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />


        <div className="absolute top-3 right-3">
          <span className="px-2 py-0.5 text-[10px] font-semibold text-white bg-[#023d12]  rounded-sm uppercase tracking-wide">
            {product.badge}
          </span>
        </div>
      </div>

      <div className="px-3 py-3 md:px-4 md:py-4">
        <h3 className="font-serif text-sm md:text-base text-gray-900 line-clamp-2 mb-2 min-h-[2.5rem] group-hover:text-[#023d12]  transition-colors">
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
    dragFree: true,
  });

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  return (
    <section className="w-full bg-white py-10 md:py-14 border-t border-gray-100">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        <SectionTitle title="Trending Now" />

        <div className="relative">
          <button
            type="button"
            onClick={scrollPrev}
            className="absolute -left-2 md:-left-5 top-[38%] -translate-y-1/2 z-10 w-9 h-9 md:w-10 md:h-10 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors"
            aria-label="Previous products"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>

          <div className="overflow-hidden px-6 md:px-8" ref={emblaRef}>
            <div className="flex gap-4 md:gap-6 justify-center">
              {trendingProducts.map((product) => (
                <div
                  key={product.id}
                  className="min-w-0 shrink-0 basis-[85%] sm:basis-[60%] md:basis-[40%] lg:basis-[30%] xl:basis-[25%]"
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
            className="absolute -right-2 md:-right-5 top-[38%] -translate-y-1/2 z-10 w-9 h-9 md:w-10 md:h-10 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors"
            aria-label="Next products"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        
      </div>
    </section>
  );
};

export default TrendingNow;
