"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../service/supabaseClient";
import { div } from "framer-motion/client";
import OrderDetails from "@/components/OrderDetails";

export type OrderProp = {
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

export type OrderItemProp = {
  id: string;
  order_id: string;
  poster_id: string;
  poster_size: string;
  quantity: number;
  unit_price: number;
  poster_name: PosterNameProp;
};
type PosterNameProp = {
  name: string;
};
type DeliveryLocation = {
  id: string;
  name: string;
  detail: string;
};

type PaymentMode = "onDelivery" | "transfer";
type Status = "pending" | "ordered" | "delivered" | "canceled";
type PayStatus = "pending" | "accepted" | "rejected";
type TransferProvider = "Telebirr" | "CBE";

type OrderStatsProp = {
  pending: number;
  ordered: number;
  delivered: number;
  canceled: number;
};

type CategoryProp = {
  id: string;
  name: string;
};
const statusInducators = [
  { stat: "pending", bgColor: "bg-yellow-400/50" },
  { stat: "accepted", bgColor: "bg-green-400/50" },
  { stat: "delivered", bgColor: "bg-green-400/50" },
  { stat: "rejected", bgColor: "bg-red-400/50" },
  { stat: "canceled", bgColor: "bg-red-200/50" },
  { stat: "ordered", bgColor: "bg-green-200/50" },
];
export default function AdminPage() {
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [tags, setTags] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [categories, setCategories] = useState<CategoryProp[]>([]);
  const [orders, setOrders] = useState<OrderProp[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderProp>();
  const [openOrderDetails, setOpenOrderDetails] = useState(false);
  const [ordersStat, setOrdersStat] = useState<OrderStatsProp>();

  const getOrders = async () => {
    const { data, error } = await supabase.from("orders").select("*");

    if (error) {
      console.error(error);
      return;
    }

    setOrders(data);
    const pending = data.filter((order) => order.status == "pending").length;
    const ordered = data.filter((order) => order.status == "ordered").length;
    const delivered = data.filter(
      (order) => order.status == "delivered",
    ).length;
    const canceled = data.filter((order) => order.status == "canceled").length;
    setOrdersStat({
      pending: pending,
      ordered: ordered,
      delivered: delivered,
      canceled: canceled,
    });
  };

  useEffect(() => {
    async function getCategories() {
      const { data, error } = await supabase.from("categories").select("*");

      if (error) {
        console.error(error);
        return;
      }
      setCategories(data);
    }

    getCategories();
    getOrders();
  }, []);
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name || !categoryId || !file) {
      setMessage("Please fill in all required fields.");
      return;
    }

    try {
      setUploading(true);
      setMessage("");

      // 1. Upload image to Supabase Storage
      const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const fileName = `${crypto.randomUUID()}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from("poster_img")
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      // 2. Get public image URL
      const { data: urlData } = supabase.storage
        .from("poster_img")
        .getPublicUrl(fileName);

      // 3. Convert tags to array
      const tagArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

      // 4. Insert poster into database
      const { error: dbError } = await supabase.from("poster").insert({
        name,
        tags: tagArray,
        poster_img: urlData.publicUrl,
        category_id: categoryId,
      });

      if (dbError) {
        throw dbError;
      }

      setMessage("Poster uploaded successfully.");

      // Reset form
      setName("");
      setCategoryId("");
      setTags("");
      setFile(null);
      setPreview("");
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong while uploading.");
    } finally {
      setUploading(false);
    }
  }
  const [post, setPost] = useState(true);
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
  };

  const updateTableLazyway = async () => {
    await getOrders();
  };
  return (
    <main className="min-h-screen overflow-x-hidden bg-zinc-950 p-4 text-white sm:p-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="mt-1 text-zinc-400">Manage your poster store.</p>
        <OrderDetails
          isOpen={openOrderDetails}
          setView={setOpenOrderDetails}
          order={selectedOrder ?? null}
          updateTable={updateTableLazyway}
        />
        <div className="mt-8 grid gap-8 md:grid-cols-[220px_minmax(0,1fr)]">
          {/* Sidebar */}
          <aside className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 h-fit">
            <nav className="space-y-1">
              <button
                onClick={() => setPost(true)}
                className="w-full rounded-lg hover:bg-zinc-800 active:bg-amber-500/30 px-4 py-2 text-left font-medium text-zinc-400"
              >
                Add Poster
              </button>

              <button
                onClick={() => setPost(false)}
                className="w-full rounded-lg px-4 py-2 text-left text-zinc-400 hover:bg-zinc-800 active:bg-amber-500/30"
              >
                Orders
              </button>
            </nav>
          </aside>

          {/* Main */}
          {post ? (
            <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
              <h2 className="text-xl font-semibold">Add Poster</h2>

              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                {/* Name */}
                <div>
                  <label className="mb-2 block text-sm text-zinc-300">
                    Poster name
                  </label>

                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Naruto Minimalist"
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-amber-500"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="mb-2 block text-sm text-zinc-300">
                    Category
                  </label>

                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-amber-500"
                  >
                    <option value="">Select category</option>

                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tags */}
                <div>
                  <label className="mb-2 block text-sm text-zinc-300">
                    Tags
                  </label>

                  <input
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="naruto, anime, dark, minimalist"
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-amber-500"
                  />

                  <p className="mt-1 text-xs text-zinc-500">
                    Separate tags with commas.
                  </p>
                </div>

                {/* Image */}
                <div>
                  <label className="mb-2 block text-sm text-zinc-300">
                    Poster image
                  </label>

                  <label className="flex min-h-48 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-zinc-700 bg-zinc-950 hover:border-amber-500">
                    {preview ? (
                      <img
                        src={preview}
                        alt="Preview"
                        className="max-h-72 rounded-lg object-contain"
                      />
                    ) : (
                      <div className="text-center text-zinc-500">
                        <p>Click to choose an image</p>
                        <p className="mt-1 text-xs">PNG, JPG or WEBP</p>
                      </div>
                    )}

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Message */}
                {message && (
                  <p className="rounded-lg bg-zinc-950 p-3 text-sm text-zinc-300">
                    {message}
                  </p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={uploading}
                  className="w-full rounded-lg bg-amber-500 px-5 py-3 font-semibold text-black hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {uploading ? "Uploading..." : "Upload Poster"}
                </button>
              </form>
            </section>
          ) : (
            <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 flex flex-col gap-5">
              <div className="flex  justify-around gap-5">
                <button
                  // onClick={}
                  className="flex flex-col gap-4 stat-box w-full p-5 "
                >
                  <h1 className="">Pending </h1>
                  <p>{ordersStat?.pending}</p>
                </button>
                <button
                  // onClick={}
                  className="flex flex-col gap-4 stat-box w-full p-5 "
                >
                  <h1 className="">Delivering</h1>
                  <p>{ordersStat?.ordered}</p>
                </button>
                <button
                  // onClick={}
                  className="flex flex-col gap-4 stat-box w-full p-5 "
                >
                  <h1 className="">Delivered</h1>
                  <p>{ordersStat?.delivered}</p>
                </button>
                <button
                  // onClick={}
                  className="flex flex-col gap-4 stat-box w-full p-5 "
                >
                  <h1 className="">Canceled</h1>
                  <p>{ordersStat?.canceled}</p>
                </button>
              </div>

              <div className="w-full overflow-x-auto rounded-lg border border-amber-900/20">
                <table className="w-full min-w-[800px] text-left">
                  <thead className="bg-amber-50/10">
                    <tr className="border-b border-amber-900/20">
                      <th className="px-4 py-3 text-sm font-semibold">
                        Customer
                      </th>
                      <th className="px-4 py-3 text-sm font-semibold">Phone</th>
                      <th className="px-4 py-3 text-sm font-semibold">
                        Location
                      </th>
                      <th className="px-4 py-3 text-sm font-semibold">
                        Status
                      </th>
                      <th className="px-4 py-3 text-sm font-semibold">
                        Payment
                      </th>
                      <th className="px-4 py-3 text-sm font-semibold">
                        Payment Status
                      </th>
                      <th className="px-4 py-3 text-sm font-semibold">Time</th>
                    </tr>
                  </thead>

                  <tbody>
                    {orders.map((order: OrderProp) => {
                      const status = statusInducators.find(
                        (S) => S.stat == order.status,
                      );
                      const payStatus = statusInducators.find(
                        (P) => P.stat == order.payment_status,
                      );
                      return (
                        <tr
                          key={order.id}
                          onClick={() => {
                            setSelectedOrder(order);
                            setOpenOrderDetails(true);
                          }}
                          className="border-b border-amber-900/10 hover:bg-amber-50/5"
                        >
                          <td className="px-4 py-4 font-medium">
                            {order.customer_name}
                          </td>

                          <td className="px-4 py-4">{order.phone_number}</td>

                          <td className="px-4 py-4">
                            {order.delivery_location}
                          </td>

                          <td className="px-4 py-4">
                            <span
                              className={`rounded-full px-3 py-1 text-sm ${status?.bgColor || "bg-white/10"}`}
                            >
                              {order.status}
                            </span>
                          </td>

                          <td className="px-4 py-4">{order.payment_method}</td>

                          <td className="px-4 py-4">
                            <span
                              className={`rounded-full px-3 py-1 text-sm ${payStatus?.bgColor || "bg-white/10"}`}
                            >
                              {order.payment_status}
                            </span>
                          </td>

                          <td className="px-4 py-4">
                            {formatDate(order.created_at)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
