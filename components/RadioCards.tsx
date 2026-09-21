"use client";

import { useState } from "react";
import { CardSizeProp } from "./ViewCard";

type RadioCardsProp = {
  cardSize: CardSizeProp[];
  selectedCard: string;
  setSelectedCard: React.Dispatch<React.SetStateAction<string>>;
};
export default function RadioCards({
  cardSize,
  selectedCard = "A1",
  setSelectedCard,
}: RadioCardsProp) {
  // Store the ID of the currently selected card (defaulting to 'A1')

  return (
    <div className="w-full max-w-xl mx-auto p-4">
      {/* Grid container: 2 columns on mobile, 4 columns on larger screens */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4" role="radiogroup">
        {cardSize.map((card) => {
          const isSelected = selectedCard === card.id;

          return (
            <button
              key={card.id}
              onClick={() => setSelectedCard(card.id)}
              role="radio"
              aria-checked={isSelected}
              className={`
                aspect-square rounded-2xl border-2 flex flex-col items-center justify-center p-4 
                cursor-pointer transition-all duration-200 select-none outline-none
                ${
                  isSelected
                    ? "border-amber-500 bg-amber-500/10 text-amber-500 shadow-lg scale-[1.02] ring-2 ring-amber-500/30"
                    : "border-white/10 bg-white/5 text-gray-300 hover:border-white/30 hover:bg-white/10"
                }
              `}
            >
              {/* Radio Indicator Circle */}
              <div
                className={`w-4 h-4 rounded-full border-2 mb-3 flex items-center justify-center transition-colors ${
                  isSelected ? "border-amber-500" : "border-gray-500"
                }`}
              >
                {isSelected && (
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                )}
              </div>

              {/* Label */}
              <span className="text-xl font-bold">{card.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
