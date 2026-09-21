"use client";

import {
  CheckCircle2,
  CreditCard,
  MapPin,
  Package,
  Upload,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { CartItem } from "@/context/Context";
import { supabase } from "@/service/supabaseClient";
import { useCart } from "@/context/Context";

type OrderProp = {
  customer_name: string;
  phone_number: string;
  delivery_location: string;
  payment_method: PaymentMode;
  status: Status;
  payment_screenshot: string;
  payment_status: Status;
};

type OrderItemProp = {
  order_id: string;
  poster_id: string;
  poster_size: string;
  quantity: number;
  unit_price: number;
};

type DeliveryLocation = {
  id: string;
  name: string;
  detail: string;
};

type PaymentMode = "onDelivery" | "transfer";
type Status = "pending";
type TransferProvider = "Telebirr" | "CBE";

type CheckoutModalProps = {
  isOpen: boolean;
  items: CartItem[];
  onClose: () => void;
};

const sampleDeliveryLocations: DeliveryLocation[] = [
  {
    id: "bole",
    name: "Bole",
    detail: "Next to the airport between 7:00 AM-8:00 AM",
  },
  {
    id: "4-kilo",
    name: "4 Kilo",
    detail: "Near AAU campus between 12:00 PM-2:00 PM",
  },
  {
    id: "summit",
    name: "Summit",
    detail: "Near Safari mall between 9:00 AM-4:00 PM",
  },
  {
    id: "piazza",
    name: "Piazza",
    detail: "Near St. George Cathedral between 10:00 AM-12:00 PM",
  },
  {
    id: "mexico",
    name: "Mexico",
    detail: "Around Mexico Square between 10:00 AM-1:00 PM",
  },
  {
    id: "kazanchis",
    name: "Kazanchis",
    detail: "Near the business district between 10:00 AM-1:00 PM",
  },
  {
    id: "megenagna",
    name: "Megenagna",
    detail: "Around Megenagna junction between 9:00 AM-3:00 PM",
  },
  {
    id: "cmc",
    name: "CMC",
    detail: "Around CMC area between 10:00 AM-3:00 PM",
  },
  {
    id: "merkato",
    name: "Merkato",
    detail: "Near Anwar Mosque between 10:00 AM-1:00 PM",
  },
  {
    id: "meskel-square",
    name: "Meskel Square",
    detail: "Around Meskel Square between 11:00 AM-2:00 PM",
  },
];

export default function CheckoutModal({
  isOpen,
  items,
  onClose,
}: CheckoutModalProps) {
  const { clearCart } = useCart();
  const [locationId, setLocationId] = useState(
    sampleDeliveryLocations[0]?.id ?? "",
  );
  const [paymentMode, setPaymentMode] = useState<PaymentMode>("onDelivery");
  const [transferProvider, setTransferProvider] =
    useState<TransferProvider>("Telebirr");
  const [receiptName, setReceiptName] = useState("");
  const [customerName, setcustomerName] = useState("");
  const [phoneNumber, setphoneNumber] = useState();
  const [isOrdered, setIsOrdered] = useState(false);
  const [file, setFile] = useState();

  const selectedLocation = sampleDeliveryLocations.find(
    (location) => location.id === locationId,
  );

  const totalAmount = useMemo(
    () => items.reduce((total, item) => total + item.price * item.quantity, 0),
    [items],
  );

  const needsReceipt = paymentMode === "transfer";
  const canOrder =
    items.length > 0 && Boolean(locationId) && (!needsReceipt || receiptName);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setReceiptName(e.target.files?.[0]?.name ?? "");
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    setFile(selectedFile);
  }

  const uploadScreenshot = async () => {
    if (!file) {
      return "";
    }
    // 1. Upload image to Supabase Storage
    const fileName = `${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("payment_screenshot")
      .upload(fileName, file);

    if (uploadError) {
      throw uploadError;
    }

    // 2. Get public image URL
    const { data: urlData } = supabase.storage
      .from("payment_screenshot")
      .getPublicUrl(fileName);
    return urlData.publicUrl;
  };

  async function handleOrder() {
    if (!canOrder) return;
    if (!customerName || !phoneNumber) return;

    const paymentScreenshotUrl = await uploadScreenshot();

    const order: OrderProp = {
      customer_name: customerName,
      phone_number: phoneNumber,
      delivery_location: selectedLocation?.name,
      payment_method: paymentMode,
      status: "pending",
      payment_screenshot: paymentScreenshotUrl,
      payment_status: "pending",
    };

    const { data, error } = await supabase
      .from("orders")
      .insert(order)
      .select();
    console.log(data);

    try {
      items.forEach(async (item) => {
        const orderitem: OrderItemProp = {
          order_id: data?.[0]?.id,
          poster_id: item.id,
          poster_size: item.size,
          quantity: item.quantity,
          unit_price: item.price,
        };
        const { error } = await supabase.from("order_items").insert(orderitem);
      });
    } catch (error) {
      console.log(error);
    }
    clearCart();
    setIsOrdered(true);
  }

  return (
    <div
      className={`fixed inset-0 z-[200] grid place-items-center px-4 py-8 transition ${
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
      aria-hidden={!isOpen}
    >
      <button
        type="button"
        className={`absolute inset-0 bg-black/55 backdrop-blur-md transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
        aria-label="Close checkout"
      />

      <section
        className={`relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[18px] border border-amber-100/20 bg-backgroundd/95 p-5 shadow-[0_28px_100px_rgba(0,0,0,0.62)] backdrop-blur-2xl transition duration-300 sm:p-7 ${
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-title"
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.22em] text-heighlight">
              <Package size={16} />
              Order summary
            </p>
            <h2
              id="checkout-title"
              className="mt-2 text-3xl font-bold text-amber-50 sm:text-4xl"
            >
              Check Out
            </h2>
          </div>

          <button
            type="button"
            className="rounded-full border border-white/10 bg-white/5 p-2 text-amber-50 transition hover:bg-white/10"
            onClick={onClose}
            aria-label="Close checkout"
          >
            <X size={19} />
          </button>
        </div>

        {isOrdered ? (
          <div className="grid min-h-[360px] place-items-center text-center">
            <div>
              <CheckCircle2 className="mx-auto text-heighlight" size={58} />
              <h3 className="mt-5 text-2xl font-bold text-amber-50">
                Order received
              </h3>
              <p className="mx-auto mt-3 max-w-md text-amber-100/70">
                your order has been sent, a conformation SMS message will be
                sent to you in the next 5 to 10 minutes for conformation.
              </p>
              <button
                type="button"
                className="mt-7 rounded-full bg-heighlight px-6 py-3 font-bold text-black transition hover:bg-secondary"
                onClick={() => {
                  onClose();
                  setIsOrdered(false);
                }}
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 py-5 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-amber-50">
                  Items you are purchasing
                </h3>
                <div className="mt-3 space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-4 rounded-[10px] border border-white/10 bg-white/[0.04] p-3"
                    >
                      <div>
                        <h4 className="font-semibold text-amber-50">
                          {item.name}
                        </h4>
                        <p className="text-sm text-amber-100/55">
                          {item.size} x {item.quantity}
                        </p>
                      </div>
                      <p className="shrink-0 font-bold text-heighlight">
                        {item.price * item.quantity} birr
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[10px] border border-heighlight/30 bg-heighlight/10 p-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-amber-100/70">Total amount</span>
                  <strong className="text-2xl text-heighlight">
                    {totalAmount} birr
                  </strong>
                </div>
              </div>

              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-amber-100/70">
                  <MapPin size={16} />
                  Delivery location
                </span>
                <select
                  value={locationId}
                  onChange={(event) => setLocationId(event.target.value)}
                  className="w-full rounded-[10px] border border-white/10 bg-black/30 px-4 py-3 text-amber-50 outline-none transition focus:border-heighlight"
                >
                  {sampleDeliveryLocations.map((location) => (
                    <option key={location.id} value={location.id}>
                      {location.name}
                    </option>
                  ))}
                </select>
              </label>

              {selectedLocation ? (
                <p className="rounded-[10px] border border-white/10 bg-white/[0.04] p-3 text-sm text-amber-100/65">
                  {selectedLocation.detail}
                </p>
              ) : null}
            </div>

            <div className="space-y-4">
              <div>
                <span className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-amber-100/70">
                  <CreditCard size={16} />
                  Payment method
                </span>
                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    className={`rounded-[10px] border px-4 py-3 text-left transition ${
                      paymentMode === "onDelivery"
                        ? "border-heighlight bg-heighlight text-black"
                        : "border-white/10 bg-white/[0.04] text-amber-50 hover:bg-white/10"
                    }`}
                    onClick={() => setPaymentMode("onDelivery")}
                  >
                    Pay on delivery
                  </button>
                  <button
                    type="button"
                    className={`rounded-[10px] border px-4 py-3 text-left transition ${
                      paymentMode === "transfer"
                        ? "border-heighlight bg-heighlight text-black"
                        : "border-white/10 bg-white/[0.04] text-amber-50 hover:bg-white/10"
                    }`}
                    onClick={() => setPaymentMode("transfer")}
                  >
                    Bank or wallet
                  </button>
                </div>
              </div>

              {paymentMode === "transfer" ? (
                <div className="space-y-4 rounded-[12px] border border-white/10 bg-white/[0.04] p-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {(["Telebirr", "CBE"] as TransferProvider[]).map(
                      (provider) => (
                        <button
                          type="button"
                          key={provider}
                          className={`rounded-[10px] border px-4 py-3 font-semibold transition ${
                            transferProvider === provider
                              ? "border-heighlight bg-heighlight text-black"
                              : "border-white/10 bg-black/20 text-amber-50 hover:bg-white/10"
                          }`}
                          onClick={() => setTransferProvider(provider)}
                        >
                          {provider}
                        </button>
                      ),
                    )}
                  </div>

                  <label className="block">
                    <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-amber-100/70">
                      <Upload size={16} />
                      Attach transaction screenshot
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full rounded-[10px] border border-dashed border-amber-100/25 bg-black/20 px-4 py-3 text-sm text-amber-100/70 file:mr-4 file:rounded-full file:border-0 file:bg-heighlight file:px-4 file:py-2 file:font-semibold file:text-black"
                    />
                    {receiptName ? (
                      <p className="mt-2 text-sm text-heighlight">
                        Attached: {receiptName}
                      </p>
                    ) : null}
                  </label>

                  <p className="text-sm text-amber-100/55">
                    Selected payment: {transferProvider}
                  </p>
                </div>
              ) : (
                <p className="rounded-[10px] border border-white/10 bg-white/[0.04] p-4 text-sm text-amber-100/65">
                  You will pay when your posters are delivered.
                </p>
              )}

              <input
                type="text"
                value={customerName}
                onChange={(e) => setcustomerName(e.target.value)}
                placeholder="Full Name"
                className="transition-all ease-in-out bg-black/30 w-full border border-amber-200/30 focus:border-amber-50/30 rounded-[10px] px-5 py-3 text-white"
                required
              />
              <input
                type="number"
                value={phoneNumber}
                onChange={(e) => setphoneNumber(e.target.value)}
                placeholder="Phone Number"
                className="transition-all ease-in-out bg-black/30 w-full border border-amber-200/30 focus:border-amber-50/20 rounded-[10px] px-5 py-3 text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                required
              />

              <p className="text-amber-100/50">delivery fee is 0 birr</p>

              <button
                type="button"
                className="w-full rounded-full bg-heighlight px-5 py-3 font-bold text-black transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-45"
                onClick={handleOrder}
                disabled={!canOrder}
              >
                Order
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
