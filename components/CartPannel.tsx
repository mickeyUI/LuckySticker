"use client";

import { ShoppingBag, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import CheckoutModal, { CheckoutItem } from "./CheckoutModal";

const sampleCartItems: CheckoutItem[] = [
  {
    id: 1,
    title: "Naruto Wall Poster",
    category: "Anime",
    price: 70,
    quantity: 2,
  },
  {
    id: 2,
    title: "Classic Car Print",
    category: "Cars",
    price: 90,
    quantity: 1,
  },
  {
    id: 3,
    title: "Teddy Afro Poster",
    category: "Music",
    price: 80,
    quantity: 1,
  },
];

export default function CartPannel() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const cartTotal = sampleCartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  useEffect(() => {
    const mountTimer = window.setTimeout(() => {
      setIsMounted(true);
    }, 0);

    return () => window.clearTimeout(mountTimer);
  }, []);

  const cartPanel = (
    <div
      className={`fixed inset-0 z-[100] transition ${
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
      aria-hidden={!isOpen}
    >
      <button
        type="button"
        className={`absolute inset-0 bg-black/45 backdrop-blur-[2px] transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={() => setIsOpen(false)}
        aria-label="Close cart"
      />

      <aside
        className={`absolute right-0 top-0 flex h-full w-full max-w-sm flex-col border-l border-amber-100/15 bg-backgroundd/95 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.45)] transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-heighlight">
              Cart
            </p>
            <h2 className="text-2xl font-bold text-amber-50">Your Posters</h2>
          </div>

          <button
            type="button"
            className="rounded-full border border-white/10 bg-white/5 p-2 text-amber-50 transition hover:bg-white/10"
            onClick={() => setIsOpen(false)}
            aria-label="Close cart"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-3 overflow-y-auto py-5">
          {sampleCartItems.map((item) => (
            <div
              key={item.id}
              className="flex gap-3 rounded-[10px] border border-white/10 bg-white/[0.04] p-3"
            >
              <div className="h-20 w-16 rounded-[8px] bg-amber-100/15" />
              <div className="flex flex-1 flex-col justify-center">
                <h3 className="font-semibold text-amber-50">{item.title}</h3>
                <p className="text-sm text-amber-100/60">
                  {item.category} x {item.quantity}
                </p>
                <p className="mt-1 text-sm font-semibold text-heighlight">
                  {item.price * item.quantity} birr
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-4">
          <div className="mb-4 flex items-center justify-between text-sm text-amber-100/70">
            <span>Subtotal</span>
            <span>{cartTotal} birr</span>
          </div>
          <button
            type="button"
            className="w-full rounded-3xl bg-heighlight px-5 py-3 font-bold text-black transition hover:bg-secondary"
            onClick={() => {
              setIsOpen(false);
              setIsCheckoutOpen(true);
            }}
          >
            Continue to checkout
          </button>
        </div>
      </aside>

    </div>
  );

  return (
    <>
      <button
        type="button"
        className="cart-box relative"
        onClick={() => setIsOpen(true)}
        aria-label="Open cart"
      >
        <div className="badge text-sm rounded-2xl bg-red-500 absolute left-4 -top-1 w-5 h-5 flex items-center justify-center">
          <h1>3</h1>
        </div>
        <ShoppingBag className="transition text-heighlight hover:text-yellow-700" />
      </button>

      {isMounted
        ? createPortal(
            <>
              {cartPanel}
              <CheckoutModal
                isOpen={isCheckoutOpen}
                items={sampleCartItems}
                onClose={() => setIsCheckoutOpen(false)}
              />
            </>,
            document.body,
          )
        : null}
    </>
  );
}
