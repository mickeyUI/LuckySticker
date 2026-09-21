"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import CartPannel from "../../components/CartPannel";
import CategoryCarousel from "../../components/CategoryCarousel";
import { supabase } from "@/service/supabaseClient";
import { useRouter } from "next/navigation";

type poster = {
  id: string;
  name: string;
  poster_img: string;
  tags: string[];
  category: CategoryProp;
};

type CategoryProp = {
  name: string;
};

export default function Categories() {
  const router = useRouter();
  const [posters, setPosters] = useState<poster[]>([]);
  const [query, setQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const params = new URLSearchParams();
  useEffect(() => {
    const loadData = async () => {
      const { data, error } = await supabase
        .from("poster")
        .select("id, name, poster_img, tags").select(`
    *,
    category:categories (
      name
    )
  `);
      setPosters(data ?? []);
      if (error) {
        console.log(error);
      }
    };
    loadData();
  }, []);
  const filteredPosters =
    selectedCategory == "All"
      ? posters
      : posters.filter((poster) => poster.category.name == selectedCategory);
  const parameterSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!query) return;
    params.set("q", query);
    router.push(`/Search?${params.toString()}`);
  };

  const handleViewingRoute = (id: string) => {
    if (!id) return;
    params.set("id", id);
    router.push(`/ViewPage?${params.toString()}`);
  };
  return (
    <div>
      <section className="uppersection mx-3 mb-4 grid gap-4 p-4 sm:p-5 lg:grid-cols-[2fr_4fr]">
        <div className="flex items-center">
          <Link
            href="/"
            className="text-2xl font-bold text-amber-100/90 sm:text-3xl"
          >
            Lucky Sticker
          </Link>
        </div>
        <form onSubmit={parameterSearch}>
          <div className="flex flex-wrap justify-end gap-3 sm:gap-5">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="text"
              className="min-w-0 flex-1 rounded-3xl border-2 border-white/10 bg-amber-100/20 pl-4 text-[18px] text-black/80 transition-all ease-in-out focus:border-white/30 focus:bg-amber-100/70 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-heighlight/70 hover:bg-heighlight py-2 px-4 rounded-3xl transition-all ease-in-out"
            >
              Search
            </button>
            <CartPannel />
          </div>
        </form>
      </section>

      <CategoryCarousel
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <section className="cards-display">
        <div className="grid w-full grid-cols-1 gap-6 p-4 sm:grid-cols-2 sm:gap-8 sm:p-6 lg:grid-cols-4 lg:p-10 xl:grid-cols-5">
          {filteredPosters.map((poster) => (
            <div
              key={poster.id}
              onClick={() => handleViewingRoute(poster.id)}
              className="poster-card rounded-[10px] h-fit"
            >
              <div className="poster-image">
                <img
                  src={poster.poster_img}
                  alt="img"
                  className="aspect-square h-auto w-full object-cover"
                />
              </div>

              <div className="info-display">
                <h1 className="min-h-10 text-[20px] font-bold leading-tight">
                  {poster.name}
                </h1>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
