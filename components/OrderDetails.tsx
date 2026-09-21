"use client";

import { useState, useEffect } from "react";
import { X, Sparkles, Loader2, Edit, ExternalLink } from "lucide-react";
import { OrderItemProp } from "@/app/Admin/page";
import { supabase } from "@/service/supabaseClient";

type Status = "pending" | "ordered" | "delivered" | "canceled";
type PayStatus = "pending" | "accepted" | "rejected";

type PaymentMode = string;

type OrderProp = {
  id: string;
  customer_name: string;
  phone_number: string;
  delivery_location: string;
  payment_method: PaymentMode;
  status: Status;
  payment_screenshot: string;
  payment_status: PayStatus;
  created_at: string;
};

type OrderDetailsProps = {
  isOpen: boolean;
  setView: (value: boolean) => void;
  order: OrderProp | null;
  updateTable: () => void;
};

export default function OrderDetails({
  isOpen,
  setView,
  order,
  updateTable,
}: OrderDetailsProps) {
  const [orderItems, setOrderItems] = useState<OrderItemProp[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [loading, setLoading] = useState(false);

  const [status, setStatus] = useState<Status>("pending");
  const [paymentStatus, setPaymentStatus] = useState<PayStatus>("pending");

  useEffect(() => {
    if (!order) return;

    setStatus(order.status);
    setPaymentStatus(order.payment_status);

    const getOrderItems = async () => {
      setLoadingItems(true);

      const { data, error } = await supabase
        .from("order_items")
        .select("*")
        .select(`*, poster_name:poster(name)`)
        .eq("order_id", order.id);

      if (error) {
        console.error(error);
        setOrderItems([]);
      } else {
        setOrderItems(data || []);
      }

      setLoadingItems(false);
    };

    getOrderItems();
  }, [order]);

  if (!isOpen || !order) return null;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price: number) => {
    return `${price.toLocaleString()} ETB`;
  };

  const total = orderItems.reduce(
    (sum, item) => sum + item.quantity * item.unit_price,
    0,
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    const { error } = await supabase
      .from("orders")
      .update({
        status: status,
        payment_status: paymentStatus,
      })
      .eq("id", order.id);

    if (error) {
      console.error(error);
      alert("Failed to update order.");
      setLoading(false);
      return;
    }
    updateTable();
    setLoading(false);
    setView(false);
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 select-none">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-amber-950/20 backdrop-blur-md"
        onClick={() => setView(false)}
      />

      {/* Modal */}
      <div
        data-lenis-prevent
        className="relative z-10 max-h-[95vh] w-full max-w-6xl overflow-y-auto bg-black/70 p-4 shadow-2xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] glass-panel rounded-3xl border border-white/10 sm:p-6 md:p-8"
      >
        {/* Close */}
        <button
          onClick={() => setView(false)}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 rounded-xl text-amber-400 bg-white/5">
            <Edit className="w-5 h-5" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-white">Order Details</h2>

            <p className="text-sm text-slate-400">
              Order #{order.id.slice(0, 8)}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Customer Information */}
          <section>
            <h3 className="text-sm font-semibold text-amber-400 mb-4 uppercase tracking-wide">
              Customer Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-xl p-4">
                <p className="text-xs text-slate-400 mb-1">Customer Name</p>
                <p className="text-white font-medium">{order.customer_name}</p>
              </div>

              <div className="bg-white/5 rounded-xl p-4">
                <p className="text-xs text-slate-400 mb-1">Phone Number</p>
                <p className="text-white font-medium">{order.phone_number}</p>
              </div>

              <div className="bg-white/5 rounded-xl p-4">
                <p className="text-xs text-slate-400 mb-1">Delivery Location</p>
                <p className="text-white font-medium">
                  {order.delivery_location}
                </p>
              </div>

              <div className="bg-white/5 rounded-xl p-4">
                <p className="text-xs text-slate-400 mb-1">Order Date</p>
                <p className="text-white font-medium">
                  {formatDate(order.created_at)}
                </p>
              </div>
            </div>
          </section>

          {/* Payment Information */}
          <section>
            <h3 className="text-sm font-semibold text-amber-400 mb-4 uppercase tracking-wide">
              Payment Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-xl p-4">
                <p className="text-xs text-slate-400 mb-1">Payment Method</p>
                <p className="text-white font-medium">{order.payment_method}</p>
              </div>

              {/* Payment Status */}
              <div className="bg-white/5 rounded-xl p-4">
                <label className="block text-xs text-slate-400 mb-2">
                  Payment Status
                </label>

                <select
                  value={paymentStatus}
                  onChange={(e) =>
                    setPaymentStatus(e.target.value as PayStatus)
                  }
                  className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-amber-400"
                >
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

            {/* Payment Screenshot */}
            {order.payment_screenshot && (
              <div className="mt-4 bg-white/5 rounded-xl p-4">
                <p className="text-xs text-slate-400 mb-3">
                  Payment Screenshot
                </p>

                <a
                  href={order.payment_screenshot}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative inline-block group"
                >
                  <img
                    src={order.payment_screenshot}
                    alt="Payment screenshot"
                    className="max-h-64 max-w-full rounded-lg border border-white/10 object-contain"
                  />

                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                    <div className="flex items-center gap-2 text-white">
                      <ExternalLink className="w-4 h-4" />
                      <span className="text-sm">Open image</span>
                    </div>
                  </div>
                </a>
              </div>
            )}
          </section>

          {/* Order Status */}
          <section>
            <h3 className="text-sm font-semibold text-amber-400 mb-4 uppercase tracking-wide">
              Order Status
            </h3>

            <div className="bg-white/5 rounded-xl p-4">
              <label className="block text-xs text-slate-400 mb-2">
                Status
              </label>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Status)}
                className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-amber-400"
              >
                <option value="pending">Pending</option>
                <option value="ordered">Ordered</option>
                <option value="delivered">Delivered</option>
                <option value="canceled">Canceled</option>
              </select>
            </div>
          </section>

          {/* Order Items */}
          <section>
            <h3 className="text-sm font-semibold text-amber-400 mb-4 uppercase tracking-wide">
              Order Items
            </h3>

            <div className="overflow-x-auto rounded-xl border border-white/10">
              <table className="w-full text-left">
                <thead className="bg-white/5">
                  <tr className="border-b border-white/10">
                    <th className="px-4 py-3 text-sm font-semibold text-slate-300">
                      Poster
                    </th>

                    <th className="px-4 py-3 text-sm font-semibold text-slate-300">
                      Size
                    </th>

                    <th className="px-4 py-3 text-sm font-semibold text-slate-300">
                      Quantity
                    </th>

                    <th className="px-4 py-3 text-sm font-semibold text-slate-300">
                      Unit Price
                    </th>

                    <th className="px-4 py-3 text-sm font-semibold text-slate-300 text-right">
                      Subtotal
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {loadingItems ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-8 text-center text-slate-400"
                      >
                        <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                      </td>
                    </tr>
                  ) : orderItems.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-8 text-center text-slate-400"
                      >
                        No items found.
                      </td>
                    </tr>
                  ) : (
                    orderItems.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b border-white/5 hover:bg-white/5"
                      >
                        <td className="px-4 py-4 text-white font-medium">
                          {item.poster_name.name}
                        </td>

                        <td className="px-4 py-4 text-slate-300">
                          {item.poster_size}
                        </td>

                        <td className="px-4 py-4 text-slate-300">
                          {item.quantity}
                        </td>

                        <td className="px-4 py-4 text-slate-300">
                          {formatPrice(item.unit_price)}
                        </td>

                        <td className="px-4 py-4 text-white font-medium text-right">
                          {formatPrice(item.quantity * item.unit_price)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>

                {!loadingItems && orderItems.length > 0 && (
                  <tfoot>
                    <tr className="bg-white/5">
                      <td
                        colSpan={4}
                        className="px-4 py-4 text-right font-semibold text-slate-300"
                      >
                        Total
                      </td>

                      <td className="px-4 py-4 text-right text-lg font-bold text-amber-400">
                        {formatPrice(total)}
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </section>

          {/* Actions */}
          <div className="flex gap-4 pt-3">
            <button
              type="button"
              onClick={() => setView(false)}
              className="flex-1 py-3 px-4 bg-slate-900/50 hover:bg-slate-900 border border-white/5 hover:border-white/10 text-slate-300 font-semibold rounded-xl transition-all duration-200 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 px-4 bg-[#717171] hover:bg-[#4d4d4d] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <span>Update Order</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
