import React, { useState } from 'react';

const occasionTypes = [
  "Birthday",
  "Graduation",
  "Anniversary",
  "Wedding",
  "Retirement",
  "Achievement",
  "Just Because",
];

const CreateOccasion = () => {
  const [formData, setFormData] = useState({
    occasionType: "",
    recipientName: "",
    title: "",
    celebrationDate: "",
    creatorName: "",
    message: "",
    privacy: "private",
    allowPhotos: true,
    allowVideos: true,
  });

  const [errors, setErrors] = useState({});
  const [createdOccasion, setCreatedOccasion] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((previousErrors) => ({
      ...previousErrors,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.occasionType) {
      newErrors.occasionType = "Please select an occasion.";
    }

    if (!formData.recipientName.trim()) {
      newErrors.recipientName = "Enter the recipient's name.";
    }

    if (!formData.title.trim()) {
      newErrors.title = "Enter a title for the celebration.";
    }

    if (!formData.celebrationDate) {
      newErrors.celebrationDate = "Select the celebration date.";
    }

    if (!formData.creatorName.trim()) {
      newErrors.creatorName = "Enter your name.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    const occasionId =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : Date.now().toString();

    const occasion = {
      id: occasionId,
      ...formData,
      createdAt: new Date().toISOString(),
      contributions: [],
    };

    const savedOccasions = JSON.parse(
      localStorage.getItem("occasions") || "[]"
    );

    localStorage.setItem(
      "occasions",
      JSON.stringify([...savedOccasions, occasion])
    );

    setCreatedOccasion({
      ...occasion,
      shareLink: `${window.location.origin}/celebration/${occasionId}`,
    });
  };

  const copyShareLink = async () => {
    if (!createdOccasion) return;

    try {
      await navigator.clipboard.writeText(createdOccasion.shareLink);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Unable to copy link:", error);
    }
  };

  if (createdOccasion) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-5 py-12 text-white">
        <section className="w-full max-w-xl rounded-3xl border border-slate-800 bg-slate-900 p-7 text-center shadow-2xl sm:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/15 text-3xl">
            ✓
          </div>

          <p className="mt-6 text-sm font-semibold uppercase tracking-widest text-pink-400">
            Celebration created
          </p>

          <h1 className="mt-3 text-3xl font-bold">
            {createdOccasion.title}
          </h1>

          <p className="mt-3 text-slate-400">
            Your {createdOccasion.occasionType.toLowerCase()} celebration for{" "}
            <span className="font-semibold text-white">
              {createdOccasion.recipientName}
            </span>{" "}
            is ready.
          </p>

          <div className="mt-8 rounded-2xl border border-slate-700 bg-slate-950 p-4 text-left">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Invitation link
            </p>

            <p className="break-all text-sm text-purple-300">
              {createdOccasion.shareLink}
            </p>
          </div>

          <button
            type="button"
            onClick={copyShareLink}
            className="mt-5 w-full rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 px-6 py-3.5 font-semibold transition hover:opacity-90"
          >
            {copied ? "Link copied!" : "Copy invitation link"}
          </button>

          <button
            type="button"
            onClick={() => setCreatedOccasion(null)}
            className="mt-3 w-full rounded-xl border border-slate-700 px-6 py-3.5 font-semibold text-slate-300 transition hover:bg-slate-800"
          >
            Create another occasion
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-12 text-white">
      <section className="mx-auto max-w-3xl">
        <div className="mb-10 text-center">
          <p className="font-semibold text-pink-400">
            Create something memorable
          </p>

          <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
            Create an occasion
          </h1>

          <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-400">
            Set up a celebration page and invite friends and family to add
            messages, photos, and videos.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl sm:p-10"
        >
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Occasion type */}
            <div>
              <label
                htmlFor="occasionType"
                className="mb-2 block text-sm font-medium"
              >
                Occasion type
              </label>

              <select
                id="occasionType"
                name="occasionType"
                value={formData.occasionType}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-purple-500"
              >
                <option value="">Select an occasion</option>

                {occasionTypes.map((occasion) => (
                  <option key={occasion} value={occasion}>
                    {occasion}
                  </option>
                ))}
              </select>

              {errors.occasionType && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.occasionType}
                </p>
              )}
            </div>

            {/* Recipient */}
            <div>
              <label
                htmlFor="recipientName"
                className="mb-2 block text-sm font-medium"
              >
                Who are you celebrating?
              </label>

              <input
                id="recipientName"
                name="recipientName"
                type="text"
                value={formData.recipientName}
                onChange={handleChange}
                placeholder="For example, Ama"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition placeholder:text-slate-600 focus:border-purple-500"
              />

              {errors.recipientName && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.recipientName}
                </p>
              )}
            </div>

            {/* Celebration title */}
            <div className="sm:col-span-2">
              <label
                htmlFor="title"
                className="mb-2 block text-sm font-medium"
              >
                Celebration title
              </label>

              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                placeholder="Ama's Birthday Surprise"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition placeholder:text-slate-600 focus:border-purple-500"
              />

              {errors.title && (
                <p className="mt-2 text-sm text-red-400">{errors.title}</p>
              )}
            </div>

            {/* Date */}
            <div>
              <label
                htmlFor="celebrationDate"
                className="mb-2 block text-sm font-medium"
              >
                Celebration date
              </label>

              <input
                id="celebrationDate"
                name="celebrationDate"
                type="date"
                value={formData.celebrationDate}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-purple-500"
              />

              {errors.celebrationDate && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.celebrationDate}
                </p>
              )}
            </div>

            {/* Creator */}
            <div>
              <label
                htmlFor="creatorName"
                className="mb-2 block text-sm font-medium"
              >
                Your name
              </label>

              <input
                id="creatorName"
                name="creatorName"
                type="text"
                value={formData.creatorName}
                onChange={handleChange}
                placeholder="Enter your name"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition placeholder:text-slate-600 focus:border-purple-500"
              />

              {errors.creatorName && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.creatorName}
                </p>
              )}
            </div>

            {/* Welcome message */}
            <div className="sm:col-span-2">
              <label
                htmlFor="message"
                className="mb-2 block text-sm font-medium"
              >
                Welcome message{" "}
                <span className="text-slate-500">(optional)</span>
              </label>

              <textarea
                id="message"
                name="message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                placeholder="Write a short message explaining why everyone is celebrating..."
                className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition placeholder:text-slate-600 focus:border-purple-500"
              />
            </div>

            {/* Privacy */}
            <div className="sm:col-span-2">
              <p className="mb-3 text-sm font-medium">Celebration visibility</p>

              <div className="grid gap-3 sm:grid-cols-2">
                <label
                  className={`cursor-pointer rounded-2xl border p-4 transition ${
                    formData.privacy === "private"
                      ? "border-purple-500 bg-purple-500/10"
                      : "border-slate-700 bg-slate-950"
                  }`}
                >
                  <input
                    type="radio"
                    name="privacy"
                    value="private"
                    checked={formData.privacy === "private"}
                    onChange={handleChange}
                    className="mr-3 accent-purple-500"
                  />

                  <span className="font-semibold">Private</span>

                  <p className="ml-7 mt-1 text-sm text-slate-400">
                    Only people with the link can view it.
                  </p>
                </label>

                <label
                  className={`cursor-pointer rounded-2xl border p-4 transition ${
                    formData.privacy === "public"
                      ? "border-purple-500 bg-purple-500/10"
                      : "border-slate-700 bg-slate-950"
                  }`}
                >
                  <input
                    type="radio"
                    name="privacy"
                    value="public"
                    checked={formData.privacy === "public"}
                    onChange={handleChange}
                    className="mr-3 accent-purple-500"
                  />

                  <span className="font-semibold">Public</span>

                  <p className="ml-7 mt-1 text-sm text-slate-400">
                    Anyone can discover and view the celebration.
                  </p>
                </label>
              </div>
            </div>

            {/* Contribution settings */}
            <div className="sm:col-span-2">
              <p className="mb-3 text-sm font-medium">
                What can guests contribute?
              </p>

              <div className="space-y-3 rounded-2xl border border-slate-700 bg-slate-950 p-5">
                <label className="flex cursor-pointer items-center justify-between gap-4">
                  <div>
                    <p className="font-medium">Allow photo uploads</p>
                    <p className="text-sm text-slate-500">
                      Guests can add memorable pictures.
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    name="allowPhotos"
                    checked={formData.allowPhotos}
                    onChange={handleChange}
                    className="h-5 w-5 accent-purple-500"
                  />
                </label>

                <hr className="border-slate-800" />

                <label className="flex cursor-pointer items-center justify-between gap-4">
                  <div>
                    <p className="font-medium">Allow video uploads</p>
                    <p className="text-sm text-slate-500">
                      Guests can record or upload video messages.
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    name="allowVideos"
                    checked={formData.allowVideos}
                    onChange={handleChange}
                    className="h-5 w-5 accent-purple-500"
                  />
                </label>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="mt-8 w-full rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 px-6 py-4 font-semibold shadow-lg shadow-purple-900/30 transition hover:scale-[1.01] hover:opacity-95"
          >
            Create celebration
          </button>

          <p className="mt-4 text-center text-xs text-slate-500">
            You can edit these details after creating the occasion.
          </p>
        </form>
      </section>
    </main>
  );
};

export default CreateOccasion;