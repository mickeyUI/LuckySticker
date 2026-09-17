import RadioCards from "./RadioCards";

export default function ViewCard() {
  return (
    <section className="location p-25">
      <div className="grid lg:grid-cols-[3fr_2fr] gap-0 px-20">
        <div className="image border-2 border-amber-500/20 rounded-[20px] shadow-amber-500/20 shadow-2xl lg:h-[600px] aspect-[1/1.4142]  bg-[url('../public/map.png')] bg-cover bg-center bg-no-repeat"></div>

        <div className="location-card flex flex-col w-fit h-fit p-10 gap-2">
          <h2 className="font-display text-4xl font-bold ">Poster Title</h2>
          <p className="text-amber-100">
            discription of the poster like simplisitic, dark or artistic etc
          </p>

          <div>
            <RadioCards />
          </div>

          <div className="mt-1 flex items-center gap-2">
            <p className="text-[20px] text-amber-100">Price </p>
            <div className="border w-fit px-1 rounded-[5px] border-amber-400 bg-amber-500/5">
              <p className="text-[18px] text-amber-500">70 birr</p>
            </div>
          </div>
          <button className="p-4 rounded-4xl hover:bg-black/50 bg-black transform transition-all ease-in-out">
            + Add To Cart
          </button>
        </div>
      </div>
    </section>
  );
}
