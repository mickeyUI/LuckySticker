"use client";

import { Suspense, useState, useEffect } from "react";
import { ChevronLeft, ChevronLeftCircle, ShoppingBag } from "lucide-react";
import ViewCard from "../../components/ViewCard";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/service/supabaseClient";
import CartPannel from "@/components/CartPannel";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Poster = {
  id: string;
  name: string;
  poster_img: string;
  tags: string[];
};

function ViewPageContent() {
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
      <section className="uppersection mb-5 grid gap-4 p-4 sm:p-5 lg:grid-cols-[2fr_4fr]">
        <div className="flex items-center">
          <Link
            href={"/"}
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
        <div className="grid w-full grid-cols-1 gap-6 p-4 sm:grid-cols-2 sm:gap-8 sm:p-6 lg:grid-cols-4 lg:p-10 xl:grid-cols-5">
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

export default function ViewPage() {
  return (
    <Suspense fallback={null}>
      <ViewPageContent />
    </Suspense>
  );
}
