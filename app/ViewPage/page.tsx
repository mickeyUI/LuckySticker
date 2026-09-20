"use client";

import { useState, useEffect } from "react";
import { ShoppingBag } from "lucide-react";
import ViewCard from "../../components/ViewCard";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/service/supabaseClient";
import CartPannel from "@/components/CartPannel";

type poster = {
  id: string;
  name: string;
  poster_img: string;
  tags: string[];
};

export default function ViewPage() {
  const [poster, setPoster] = useState<poster>({
    id: "",
    name: "",
    poster_img: "",
    tags: [],
  });
  const searchParams = useSearchParams();
  const posterId = searchParams.get("id");

  useEffect(() => {
    if (!posterId) return;

    const pullPoster = async () => {
      const { data, error } = await supabase
        .from("poster")
        .select("id, name, poster_img, tags")
        .eq("id", posterId)
        .maybeSingle();
      console.log(data);
      if (error) {
        console.log(error);
        return;
      }

      if (data) setPoster(data);
    };
    pullPoster();
  }, [posterId]);
  return (
    <div>
      <section className="uppersection grid grid-cols-[2fr_4fr]  p-5 mb-5">
        <div className="flex items-center">
          <a href="#" className="text-3xl font-bold text-amber-100/90">
            Lucky Sticker
          </a>
        </div>
        <div className="flex justify-end gap-5">
          <input
            type="text"
            className="bg-amber-100/20 border-2 border-white/10 w-[40%] rounded-3xl text-black/80 text-[18px] pl-4 focus:outline-none focus:bg-amber-100/70 focus:border-white/30 transition-all ease-in-out"
          />
          <button className="bg-heighlight/70 hover:bg-heighlight py-2 px-4 rounded-3xl transition-all ease-in-out">
            Search
          </button>
          <CartPannel />
        </div>
      </section>

      <ViewCard
        id={poster.id}
        name={poster.name}
        poster_img={poster.poster_img}
        tags={poster.tags}
      />

      {/* <section className="cards-display">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 p-10 w-fit">
          {poster.map((poster) => (
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
      </section> */}
    </div>
  );
}
