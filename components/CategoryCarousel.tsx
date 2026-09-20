"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react"; // Assuming you are using lucide-react
import { supabase } from "@/service/supabaseClient";

type category = {
  id: string;
  name: string;
};
export default function CategoryCarousel() {
  const [categories, setCategories] = useState<category[]>([]);

  useEffect(() => {
    const loadCategories = async () => {
      const { data, error } = await supabase.from("categories").select("*");
      setCategories(data);
      if (error) {
        console.log(error);
      }
    };
    loadCategories();
  }, []);

  const carouselRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = 300; // Adjust this value to scroll more or less per click
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="categories-carousel flex justify-center mb-2 items-center gap-2 w-full max-w-[1450px] mx-auto">
      {/* Left Chevron */}
      <button
        onClick={() => scroll("left")}
        className="bg-amber-50/10 rounded-full p-1.5 opacity-30 hover:opacity-80 hover:bg-amber-50/20 transition-colors shrink-0"
        aria-label="Scroll left"
      >
        <ChevronLeft />
      </button>

      {/* Carousel Container */}
      <div
        ref={carouselRef}
        className="carousel flex gap-3  overflow-x-auto w-full 
        /* Hide scrollbar classes */
        [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {categories.map((category) => (
          <div
            key={category.id}
            // Added whitespace-nowrap so items don't wrap to the next line
            // Added shrink-0 so flexbox doesn't squish them
            className="bg-amber-50/20 text-[18px] flex items-center gap-2 py-1.5 px-3 rounded-2xl whitespace-nowrap shrink-0 cursor-pointer hover:bg-amber-50/30 transition-colors"
          >
            <h1 className="text-base font-medium">{category.name}</h1>
            <div className="text-sm flex items-center justify-center bg-amber-50/40 px-2 py-0.5 rounded-full">
              32
            </div>
          </div>
        ))}
      </div>

      {/* Right Chevron */}
      <button
        onClick={() => scroll("right")}
        className="bg-amber-50/10 rounded-full p-1.5 opacity-30 hover:opacity-80 hover:bg-amber-50/20 transition-colors shrink-0"
        aria-label="Scroll right"
      >
        <ChevronRight />
      </button>
    </section>
  );
}
