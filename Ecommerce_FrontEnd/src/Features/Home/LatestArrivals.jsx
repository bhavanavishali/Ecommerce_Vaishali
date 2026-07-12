"use client";

import { useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "@/components/ui/button";

const BASE_URL = import.meta.env.VITE_BASE_URL;

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

const getProductPricing = (product) => {
  const variant = product?.variants?.find((v) => v.is_default) || product?.variants?.[0];
  const finalPrice = Number(product?.price ?? variant?.total_price ?? product?.fixed_price ?? 0);
  const basePrice = Number(variant?.base_price ?? product?.fixed_price ?? finalPrice);
  const offerPercentage = Number(
    variant?.applied_offer?.offer_percentage || product?.discount || 0
  );
  const stock = Number(product?.stock ?? variant?.stock ?? 0);
  const hasDiscount = offerPercentage > 0 && basePrice > finalPrice;

  return { finalPrice, basePrice, offerPercentage, stock, hasDiscount };
};

const ArrivalCard = ({ product, onClick }) => {
  const { finalPrice, basePrice, offerPercentage, stock, hasDiscount } = getProductPricing(product);
  const imageUrl =
    product?.image?.length > 0 ? `${BASE_URL}${product.image[0].image}` : "/placeholder.svg";
  const isSoldOut = stock === 0;
  const showSale = hasDiscount || product?.product_offer_Isactive;

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
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {offerPercentage > 0 && (
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white border border-gray-300 text-[10px] font-semibold text-gray-800 text-center leading-tight shadow-sm">
              {Math.round(offerPercentage)}% OFF
            </span>
          )}
          {isSoldOut && (
            <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-white border border-gray-300 text-[10px] font-semibold text-gray-700 uppercase tracking-wide">
              Sold Out
            </span>
          )}
        </div>

        <div className="absolute top-3 right-3 flex flex-col gap-1.5 items-end">
          {showSale && !isSoldOut && (
            <span className="px-2 py-0.5 text-[10px] font-semibold text-white bg-emerald-600 rounded-sm uppercase tracking-wide">
              Sale
            </span>
          )}
          {product?.product_offer_Isactive && !isSoldOut && (
            <span className="px-2 py-0.5 text-[10px] font-semibold text-white bg-pink-500 rounded-sm uppercase tracking-wide">
              Top Selling
            </span>
          )}
        </div>
      </div>

      <div className="px-3 py-3 md:px-4 md:py-4">
        <h3 className="font-serif text-sm md:text-base text-gray-900 line-clamp-2 mb-2 min-h-[2.5rem] group-hover:text-[#832729] transition-colors">
          {product.name}
        </h3>
        <div className="flex items-baseline gap-2 flex-wrap">
          {hasDiscount && (
            <span className="text-sm text-gray-400 line-through">{formatPrice(basePrice)}</span>
          )}
          <span className="text-sm md:text-base font-semibold text-gray-900">
            {isSoldOut ? "Out of stock" : formatPrice(finalPrice)}
          </span>
        </div>
      </div>
    </div>
  );
};

const LatestArrivals = ({ products = [], onProductClick, onViewAll }) => {
  const autoplayRef = useRef(null);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: true,
    skipSnaps: false,
    dragFree: true,
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    autoplayRef.current = setInterval(() => {
      emblaApi.scrollNext();
    }, 4000);

    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [emblaApi]);

  const pauseAutoplay = () => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
  };

  const resumeAutoplay = () => {
    if (!emblaApi) return;
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    autoplayRef.current = setInterval(() => emblaApi.scrollNext(), 4000);
  };

  if (products.length === 0) return null;

  return (
    <section className="w-full bg-white py-10 md:py-14 border-t border-gray-100">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        <SectionTitle title="Latest Arrivals" />

        <div
          className="relative"
          onMouseEnter={pauseAutoplay}
          onMouseLeave={resumeAutoplay}
        >
          <button
            type="button"
            onClick={scrollPrev}
            className="absolute -left-2 md:-left-5 top-[38%] -translate-y-1/2 z-10 w-9 h-9 md:w-10 md:h-10 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors"
            aria-label="Previous products"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>

          <div className="overflow-hidden px-6 md:px-8" ref={emblaRef}>
            <div className="flex gap-4 md:gap-5">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="min-w-0 shrink-0 basis-[72%] sm:basis-[45%] md:basis-[30%] lg:basis-[23%] xl:basis-[18%]"
                >
                  <ArrivalCard
                    product={product}
                    onClick={() => onProductClick(product.id)}
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

        <div className="flex justify-center mt-10">
          <Button
            onClick={onViewAll}
            className="rounded-full bg-gray-900 hover:bg-gray-800 text-white px-8 py-2.5 text-sm font-medium tracking-wide"
          >
            View all
          </Button>
        </div>
      </div>
    </section>
  );
};

export default LatestArrivals;
