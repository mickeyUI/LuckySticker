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
      className={`relative mx-0 grid h-80 w-full max-w-[600px] flex-1 grid-cols-2 overflow-hidden rounded-[20px] border border-white/15 transition-colors duration-300 sm:h-96 lg:h-120`}
    >
      {/* Title positioned at top left with max-width to allow wrapping (e.g., "Beauty & Health") */}
      <div className="absolute inset-y-0 left-0 z-10 flex w-20 items-center justify-center">
        <h3 className="whitespace-nowrap text-3xl font-bold leading-tight text-white [writing-mode:vertical-rl] rotate-180 sm:text-4xl lg:text-5xl">
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
          className="absolute bottom-0 right-0 w-64 object-cover object-right-bottom [mask-image:linear-gradient(to_right,transparent,black_15%)] sm:w-80 lg:w-90"
        />
      </div>
    </a>
  );
};

export default CategoryCard;
