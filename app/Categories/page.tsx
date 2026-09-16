export default function Categories() {
  return (
    <div>
      <section className="uppersection flex justify-between">
        <div>
          <h1>Lucky Sticker</h1>
        </div>
        <div>
          <input type="text" className="border bg-amber-50" />
          <button className="">Search</button>
        </div>
        <div>da</div>
      </section>

      <section className="categories-carosel flex ">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((keyx) => (
          <div key={keyx}>
            <h1>Gamminging</h1>
          </div>
        ))}
      </section>

      <section className="cards-display">
        <div className="grid grid-cols-4 gap-20 p-25">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((keyx) => (
            <div key={keyx} className="poster-card">
              <div className="poster-image">
                <img
                  src="https://picsum.photos/id/237/200/300"
                  alt="d"
                  className="object-cover w-[300px]"
                />
              </div>

              <div className="info-display">
                <h1>title</h1>
                <p>category</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
