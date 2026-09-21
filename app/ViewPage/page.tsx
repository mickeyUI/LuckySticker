"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronLeftCircle, ShoppingBag } from "lucide-react";
import ViewCard from "../../components/ViewCard";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/service/supabaseClient";
import CartPannel from "@/components/CartPannel";
import Link from "next/link";
import { useRouter } from "next/navigation";
type Poster = {
  id: string;
  name: string;
  poster_img: string;
  tags: string[];
};

export default function ViewPage() {
  const [poster, setPoster] = useState<Poster>({
    id: "",
    name: "",
    poster_img: "",
    tags: [],
  });
  const [similarPosters, setSimilarPosters] = useState<Poster[]>([]);
  const searchParams = useSearchParams();
  const posterId = searchParams.get("id");

  useEffect(() => {
    if (!posterId) return;

    const loadPoster = async () => {
      const { data, error } = await supabase
        .from("poster")
        .select("id, name, poster_img, tags")
        .eq("id", posterId)
        .maybeSingle();
      if (error) {
        console.log(error);
        return;
      }

      if (!data) return;

      setPoster(data);

      const posterTags = data.tags.map((tag: string) =>
        tag.trim().toLowerCase(),
      );
      if (posterTags.length === 0) {
        setSimilarPosters([]);
        return;
      }

      const { data: similarData, error: similarError } = await supabase
        .from("poster")
        .select("id, name, poster_img, tags")
        .neq("id", data.id);

      if (similarError) {
        console.log(similarError);
        return;
      }

      setSimilarPosters(
        (similarData ?? []).filter((candidate) =>
          candidate.tags.some((tag: string) =>
            posterTags.includes(tag.trim().toLowerCase()),
          ),
        ),
      );
    };

    loadPoster();
  }, [posterId]);

  const router = useRouter();
  const [query, setQuery] = useState("");
  const parameterSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!query) return;
    params.set("q", query);
    router.push(`/Search?${params.toString()}`);
  };

  const params = new URLSearchParams();
  const handleViewingRoute = (id: string) => {
    if (!id) return;
    params.set("id", id);
    router.push(`/ViewPage?${params.toString()}`);
  };
  return (
    <div>
      <section className="uppersection grid grid-cols-[2fr_4fr]  p-5 mb-5">
        <div className="flex items-center">
          <Link href={"/"} className="text-3xl font-bold text-amber-100/90">
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
      <div className="">
        <Link href={"/Categories"}>
          <ChevronLeftCircle className="h-10 w-10 rounded-[100%] text-amber-200/50 hover:text-amber-400/80 hover:bg-amber-500/20 ml-5 transition-all ease-in-out" />
        </Link>
      </div>

      <ViewCard
        id={poster.id}
        name={poster.name}
        poster_img={poster.poster_img}
        tags={poster.tags}
      />
      <section className="cards-display">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 p-10 w-full">
          {similarPosters.map((poster) => (
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
