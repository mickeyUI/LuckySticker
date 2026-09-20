"use client";

import { useState } from "react";
import RadioCards from "./RadioCards";
import { useCart } from "@/context/Context";
import { CartItem } from "@/context/Context";

type ViewCardProps = {
  id: string;
  name: string;
  poster_img: string;
  tags: string[];
};

type CardSizeProp = {
  id: string;
  label: string;
  price: number;
};

export default function ViewCard({
  id,
  name,
  poster_img,
  tags,
}: ViewCardProps) {
  const [selectedCard, setSelectedCard] = useState<string>("A1");
  const cardSize: CardSizeProp[] = [
    { id: "A1", label: "A1", price: 150 },
    { id: "A2", label: "A2", price: 120 },
    { id: "A3", label: "A3", price: 70 },
    { id: "A4", label: "A4", price: 50 },
  ];
  const tagsString = tags.join(", ");
  const posterSize =
    cardSize.find((card) => card.id === selectedCard) ?? cardSize[0];

  const { addToCart } = useCart();

  const handleAddToCart = () => {
    try {
      const item: CartItem = {
        id,
        name,
        poster_img,
        size: selectedCard,
        price: posterSize.price,
        quantity: 1,
      };
      addToCart(item);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <section className="location p-25">
      <div className="grid lg:grid-cols-[3fr_2fr] gap-0 px-20">
        <div className="image overflow-hidden border-2 border-amber-500/20 rounded-[20px] shadow-amber-500/20 shadow-2xl lg:h-[600px] aspect-[1/1.4142]">
          {poster_img && (
            <img
              src={poster_img}
              alt={name}
              className="h-full w-full object-cover object-center"
            />
          )}
        </div>

        <div className="location-card flex flex-col w-fit h-fit p-10 gap-2">
          <h2 className="font-display text-4xl font-bold ">{name}</h2>
          <p className="text-amber-100">{tagsString}</p>

          <div>
            <RadioCards
              cardSize={cardSize}
              selectedCard={selectedCard}
              setSelectedCard={setSelectedCard}
            />
          </div>

          <div className="mt-1 flex items-center gap-2">
            <p className="text-[20px] text-amber-100">Price </p>
            <div className="border w-fit px-1 rounded-[5px] border-amber-400 bg-amber-500/5">
              <p className="text-[18px] text-amber-500">{posterSize.price}</p>
            </div>
          </div>
          <button
            onClick={handleAddToCart}
            className="p-4 rounded-4xl hover:bg-black/50 bg-black transform transition-all ease-in-out"
          >
            + Add To Cart
          </button>
        </div>
      </div>
    </section>
  );
}
