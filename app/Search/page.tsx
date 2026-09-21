"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import CartPannel from "../../components/CartPannel";
import CategoryCarousel from "../../components/CategoryCarousel";
import { supabase } from "@/service/supabaseClient";
import { useSearchParams } from "next/navigation";
import { ChevronLeftCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { div } from "framer-motion/client";

type poster = {
  id: string;
  name: string;
  poster_img: string;
  tags: string[];
};

function SearchContent() {
  const [posters, setPosters] = useState<poster[]>([]);
  const [query, setQuery] = useState<string>("");
  const params = new URLSearchParams();
  const searchParams = useSearchParams();

  const search = async (filter: string) => {
    const { data, error } = await supabase
      .from("poster")
      .select("id, name, poster_img, tags")
      .or(filter);
    setPosters(data ?? []);
    if (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const searchQuery = searchParams.get("q");
    if (searchQuery) {
      const tags = searchQuery?.split(" ");
      const filters = tags.map((tag) => `tags.cs.{${tag}}`).join(",");
      search(filters);
    }
  }, []);

  const searchQueryFunction = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!query) return;
    const words = query?.split(" ");
    const filter = words.map((word) => `tags.cs.{${word}}`).join(",");
    search(filter);
  };
  const router = useRouter();
  const handleViewingRoute = (id: string) => {
    if (!id) return;
    params.set("id", id);
    router.push(`/ViewPage?${params.toString()}`);
  };

  //   if (!searchQuery) return;
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
        <form onSubmit={searchQueryFunction}>
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

      <div className="flex">
        <Link href={"/Categories"}>
          <ChevronLeftCircle className="h-10 w-10 rounded-[100%] text-amber-200/50 hover:text-amber-400/80 hover:bg-amber-500/20 ml-5 transition-all ease-in-out" />
        </Link>
        {!(posters.length > 0) && (
          <div className="w-full flex justify-center items-center text-gray-100/60">
            <h1>we have no item for you search</h1>
          </div>
        )}
      </div>

      <section className="cards-display">
        <div className="grid w-full grid-cols-1 gap-6 p-4 sm:grid-cols-2 sm:gap-8 sm:p-6 lg:grid-cols-4 lg:p-10 xl:grid-cols-5">
          {posters.map((poster) => (
            <div
              key={poster.id}
              onClick={() => handleViewingRoute(poster.id)}
              className="poster-card rounded-[10px] h-fit"
            >
              <div className="poster-image">
                <img
                  src={poster.poster_img}
                  alt="img"
                  className="aspect-[2/3] h-auto w-full object-cover"
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

export default function Search() {
  return (
    <Suspense fallback={null}>
      <SearchContent />
    </Suspense>
  );
}
