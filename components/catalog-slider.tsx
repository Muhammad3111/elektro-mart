"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=300&fit=crop",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?w=1200&h=300&fit=crop",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=1200&h=300&fit=crop",
  }
];

export function CatalogSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <section className="bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="relative w-full overflow-hidden rounded-2xl border-2 border-primary/20 shadow-xl bg-gradient-to-r from-primary/5 to-primary/10">
          <div className="relative h-[250px] md:h-[300px]">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                  index === currentSlide
                    ? "opacity-100 translate-x-0"
                    : index < currentSlide
                    ? "opacity-0 -translate-x-full"
                    : "opacity-0 translate-x-full"
                }`}
              >
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${slide.image})` }}
                />
              </div>
            ))}
          </div>

          {/* Navigation buttons */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white backdrop-blur-sm z-10 h-12 w-12 rounded-full border-2 border-primary/30 shadow-lg transition-all hover:scale-110"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-6 w-6 text-primary" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white backdrop-blur-sm z-10 h-12 w-12 rounded-full border-2 border-primary/30 shadow-lg transition-all hover:scale-110"
            onClick={nextSlide}
          >
            <ChevronRight className="h-6 w-6 text-primary" />
          </Button>

          {/* Dots indicator */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2.5 rounded-full transition-all cursor-pointer border border-white/50 ${
                  index === currentSlide 
                    ? "w-8 bg-primary shadow-lg shadow-primary/50" 
                    : "w-2.5 bg-white/60 hover:bg-white/80"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
