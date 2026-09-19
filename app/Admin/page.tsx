"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../service/supabaseClient";

export default function AdminPage() {
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [tags, setTags] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [categories, setCategories] = useState([]);

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
      const fileName = `${Date.now()}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from("poster_img")
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      // 2. Get public image URL
      const { data: urlData } = supabase.storage
        .from("posters")
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

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="mt-1 text-zinc-400">Manage your poster store.</p>

        <div className="mt-8 grid gap-8 md:grid-cols-[220px_1fr]">
          {/* Sidebar */}
          <aside className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
            <nav className="space-y-1">
              <button className="w-full rounded-lg bg-amber-500 px-4 py-2 text-left font-medium text-black">
                Add Poster
              </button>

              <button className="w-full rounded-lg px-4 py-2 text-left text-zinc-400 hover:bg-zinc-800">
                Posters
              </button>

              <button className="w-full rounded-lg px-4 py-2 text-left text-zinc-400 hover:bg-zinc-800">
                Categories
              </button>

              <button className="w-full rounded-lg px-4 py-2 text-left text-zinc-400 hover:bg-zinc-800">
                Orders
              </button>
            </nav>
          </aside>

          {/* Main */}
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
                <label className="mb-2 block text-sm text-zinc-300">Tags</label>

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
        </div>
      </div>
    </main>
  );
}
