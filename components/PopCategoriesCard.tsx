import React from "react";

// Define the props exactly as requested
export interface CategoryCardProps {
  title: string;
  imageUrl: string;
  link: string;
  bgColor: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  title,
  imageUrl,
  link,
  bgColor = "",
}) => {
  return (
    <a
      className={`border grid grid-cols-2 border-white/15  rounded-[20px]  relative  h-120 w-120 max-w-[600px] flex-1 transition-colors duration-300 overflow-hidden mx-0`}
    >
      {/* Title positioned at top left with max-width to allow wrapping (e.g., "Beauty & Health") */}
      <div className="absolute inset-y-0 left-0 z-10 flex w-20 items-center justify-center">
        <h3 className="whitespace-nowrap text-5xl font-bold leading-tight text-white [writing-mode:vertical-rl] rotate-180">
          {title}
        </h3>
      </div>
      <div
        className={`bg-gradient-to-l ${bgColor ? bgColor : "from-red-500 to-white"} `}
      ></div>

      {/* Image positioned at the bottom right */}
      <div className="">
        <img
          src={imageUrl}
          alt={title}
          className="[mask-image:linear-gradient(to_right,transparent,black_15%)] absolute bottom-0 right-0  w-90 object-cover object-right-bottom"
        />
      </div>
    </a>
  );
};

export default CategoryCard;
