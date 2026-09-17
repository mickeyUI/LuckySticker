import Link from "next/link";
import CartPannel from "../../components/CartPannel";
import CategoryCarousel from "../../components/CategoryCarousel";

export default function Categories() {
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
            className="bg-amber-100/20 border-2 border-white/10 w-[40%] rounded-3xl text-black/80 text-[18px] pl-4 focus:outline-none focus:bg-amber-100/70 focus:border-white/30 transition-all ease-in-out"
          />
          <button className="bg-heighlight/70 hover:bg-heighlight py-2 px-4 rounded-3xl transition-all ease-in-out">
            Search
          </button>
          <CartPannel />
        </div>
      </section>

      <CategoryCarousel />

      <section className="cards-display">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 p-10 w-fit">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((keyx) => (
            <div key={keyx} className="poster-card rounded-[10px]">
              <div className="poster-image">
                <img
                  src="https://picsum.photos/id/237/200/300"
                  alt="d"
                  className="h-[300px] w-[300px] object-cover"
                />
              </div>

              <div className="info-display">
                <h1 className="text-[25px] font-bold leading-tight">title</h1>
                <p className="text-sm font-semibold uppercase tracking-[0.22em]">
                  category
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
