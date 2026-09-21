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
      setPosters(data);
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
      <section className="uppersection grid grid-cols-[2fr_4fr]  p-5 mx-3 mb-4">
        <div className="flex items-center">
          <Link href="/" className="text-3xl font-bold text-amber-100/90">
            Lucky Sticker
          </Link>
        </div>
        <form onSubmit={parameterSearch}>
          <div className="flex justify-end gap-5">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="text"
              className="bg-amber-100/20 border-2 border-white/10 w-[40%] rounded-3xl text-black/80 text-[18px] pl-4 focus:outline-none focus:bg-amber-100/70 focus:border-white/30 transition-all ease-in-out"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 p-10 w-fit">
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
                  className="h-[300px] w-[300px] object-cover"
                />
              </div>

              <div className="info-display">
                <h1 className="text-[20px] font-bold leading-tight h-[40px]">
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
