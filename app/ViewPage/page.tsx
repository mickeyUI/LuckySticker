import { ShoppingBag } from "lucide-react";
import ViewCard from "../../components/ViewCard";

export default function Checkout() {
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
          <button className="cart-box relative">
            <div className="badge text-sm  rounded-2xl bg-red-500 absolute left-4 -top-1 w-5 h-5 flex items-center justify-center ">
              <h1 className="">3</h1>
            </div>
            <ShoppingBag className="transition text-heighlight hover:text-yellow-700" />
          </button>
        </div>
      </section>

      <ViewCard />
    </div>
  );
}
