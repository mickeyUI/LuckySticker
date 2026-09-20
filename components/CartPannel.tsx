"use client";

import { ShoppingBag, X, MinusIcon, PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import CheckoutModal from "./CheckoutModal";
import { useCart } from "@/context/Context";

export default function CartPannel() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const {
    items,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  } = useCart();
  const cartTotal = items.reduce(
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
        {items.length > 0 && (
          <div className="h-[30px] flex items-center">
            <button
              onClick={() => clearCart()}
              className="text-gray-200/70 hover:text-gray-50"
            >
              clear
            </button>
          </div>
        )}

        <div className="flex flex-1 flex-col gap-3 overflow-y-auto py-0">
          {items.map((item) => (
            <div
              key={`${item.id}-${item.size}`}
              className="grid grid-cols-[5fr_2fr] border border-white/10 bg-white/[0.04] rounded-2xl"
            >
              <div className="info flex gap-3 rounded-[10px]  p-3">
                <div className="h-20 w-16 rounded-[8px] bg-amber-600/15" />
                <div className="flex flex-1 flex-col justify-center">
                  <h3 className="font-semibold text-amber-50">{item.name}</h3>
                  <p className="text-sm text-amber-100/60">
                    {item.quantity} {item.size}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-heighlight">
                    {item.price * item.quantity} birr
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2 justify-center items-center">
                <div className="bg-white/30 flex rounded-2xl p-1 gap-1 shadow-2xl shadow-black">
                  <MinusIcon
                    onClick={() => decreaseQuantity(item.id, item.size)}
                    className="bg-amber-100/50 rounded-l-2xl hover:bg-black/10"
                  />
                  <h1>{item.quantity}</h1>
                  <PlusIcon
                    onClick={() => increaseQuantity(item.id, item.size)}
                    className="bg-amber-100/50 rounded-r-2xl hover:bg-black/10"
                  />
                </div>

                <button
                  onClick={() => removeFromCart(item.id, item.size)}
                  className="bg-black/50 shadow shadow-amber-100/10 hover:shadow-amber-50/0 hover:bg-black/80 py-1.5 px-3.5 rounded-2xl flex justify-center items-center"
                >
                  <h1>remove</h1>
                </button>
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
        {items.length > 0 && (
          <div className="badge text-sm rounded-2xl bg-red-500 absolute left-4 -top-1 w-5 h-5 flex items-center justify-center">
            <h1>{items.length}</h1>
          </div>
        )}
        <ShoppingBag className="transition text-heighlight hover:text-yellow-700" />
      </button>

      {isMounted
        ? createPortal(
            <>
              {cartPanel}
              <CheckoutModal
                isOpen={isCheckoutOpen}
                items={items}
                onClose={() => setIsCheckoutOpen(false)}
              />
            </>,
            document.body,
          )
        : null}
    </>
  );
}
