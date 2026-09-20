"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import CartPannel from "../../components/CartPannel";
import CategoryCarousel from "../../components/CategoryCarousel";
import { supabase } from "@/service/supabaseClient";
import { useSearchParams } from "next/navigation";

type poster = {
  id: string;
  name: string;
  poster_img: string;
  tags: string[];
};

export default function Search() {
  const [posters, setPosters] = useState<poster[]>([]);
  const [query, setQuery] = useState<string>("");
  const params = new URLSearchParams();
  const searchParams = useSearchParams();

  useEffect(() => {
    const searchQuery = searchParams.get("q");
    const tags = searchQuery?.split(" ");
    const filters = tags.map((tag) => `tags.cs.{${tag}}`).join(",");

    const search = async () => {
      const { data, error } = await supabase
        .from("poster")
        .select("id, name, poster_img, tags")
        .or(filters);
      setPosters(data);
      if (error) {
        console.log(error);
      }
    };
    search();
  }, []);

  const parameterSearch = () => {
    if (!query) return;
    params.set("q", query);
  };

  //   if (!searchQuery) return;
  return (
    <div>
      <section className="uppersection grid grid-cols-[2fr_4fr]  p-5 mx-3 mb-4">
        <div className="flex items-center">
          <Link href="/" className="text-3xl font-bold text-amber-100/90">
            Lucky Sticker
          </Link>
        </div>
        <div className="flex justify-end gap-5">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-amber-100/20 border-2 border-white/10 w-[40%] rounded-3xl text-black/80 text-[18px] pl-4 focus:outline-none focus:bg-amber-100/70 focus:border-white/30 transition-all ease-in-out"
          />
          <button
            onClick={parameterSearch}
            className="bg-heighlight/70 hover:bg-heighlight py-2 px-4 rounded-3xl transition-all ease-in-out"
          >
            Search
          </button>
          <CartPannel />
        </div>
      </section>

      <section className="cards-display">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 p-10 w-fit">
          {posters.map((poster) => (
            <div key={poster.id} className="poster-card rounded-[10px] h-fit">
              <div className="poster-image">
                <img
                  src={poster.poster_img}
                  alt="img"
                  className="h-[300px] w-[200px] object-cover"
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
