"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import api from "../../api";
import banner1 from "/banner1.webp";
import banner2 from "/banner2.webp";
import banner3 from "/banner3.webp";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const fallbackBanners = [banner1, banner2, banner3];

const HomeBanner = () => {
  const [banners, setBanners] = useState(fallbackBanners);
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await api.get("offer/banners/");
        const urls = response.data
          .map((b) => b.image_url || (b.banner_image ? `${BASE_URL}${b.banner_image}` : null))
          .filter(Boolean);
        if (urls.length > 0) setBanners(urls);
      } catch {
        // keep fallback banners
      }
    };
    fetchBanners();
  }, []);

  const resetInterval = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 5000);
  };

  useEffect(() => {
    resetInterval();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [banners.length]);

  const goTo = (index) => {
    setCurrent(index);
    resetInterval();
  };

  const change = (dir) => {
    setCurrent((prev) =>
      dir === "next" ? (prev + 1) % banners.length : (prev - 1 + banners.length) % banners.length
    );
    resetInterval();
  };

  return (
    <section className="w-full bg-[#FFFDF8]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pt-4 pb-2">
        <div className="relative overflow-hidden rounded-sm">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {banners.map((image, index) => (
              <div key={index} className="w-full flex-shrink-0">
                <div className="relative w-full h-[220px] sm:h-[260px] md:h-[300px] lg:h-[320px]">
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`Promotional banner ${index + 1}`}
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              </div>
            ))}
          </div>

          {banners.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => change("prev")}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-1.5 rounded-full shadow-sm transition-all"
                aria-label="Previous banner"
              >
                <ChevronLeft className="h-5 w-5 text-gray-700" />
              </button>
              <button
                type="button"
                onClick={() => change("next")}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-1.5 rounded-full shadow-sm transition-all"
                aria-label="Next banner"
              >
                <ChevronRight className="h-5 w-5 text-gray-700" />
              </button>
            </>
          )}
        </div>

        {banners.length > 1 && (
          <div className="flex justify-center items-center gap-3 mt-4 mb-2">
            {banners.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => goTo(index)}
                aria-label={`Go to banner ${index + 1}`}
                className={`w-2.5 h-2.5 rotate-45 transition-all duration-300 ${
                  current === index
                    ? "bg-[#0B3D2E] scale-110"
                    : "bg-[#E8DFC6] hover:bg-[#D4AF37]"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default HomeBanner;
