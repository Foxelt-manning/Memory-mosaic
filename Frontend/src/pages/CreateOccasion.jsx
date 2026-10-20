import { useState } from "react";
import { createMosaic } from "../services/api.js";

const initialForm = {
  title: "",
  creatorName: "",
  recipientName: "",
  occasion: "",
};

function CreateOccasion() {
  const [formData, setFormData] = useState(initialForm);
  const [createdMosaic, setCreatedMosaic] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const data = await createMosaic(formData);
      setCreatedMosaic(data.mosaic);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const siteName =
    import.meta.env.VITE_SITE_NAME || "Memory Mosaic";

  const siteUrl =
    import.meta.env.VITE_SITE_URL || window.location.origin;

  const shareLink = createdMosaic
    ? `${siteUrl}/mosaic/${createdMosaic.sharedCode}`
    : "";

  const invitationMessage = createdMosaic
    ? `You're invited to contribute to "${createdMosaic.title}" on ${siteName}.

Share a message, picture or special memory for ${createdMosaic.recipientName} here:

${shareLink}`
    : "";

  const copyInvite = async () => {
    try {
      await navigator.clipboard.writeText(invitationMessage);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setError("Unable to copy the invitation.");
    }
  };

  const createAnother = () => {
    setCreatedMosaic(null);
    setFormData(initialForm);
    setCopied(false);
    setError("");
  };

  return (
    <main className="min-h-screen bg-[#fffaf5] px-4 py-8 text-slate-900 sm:px-6">
      <nav className="mx-auto mb-10 flex max-w-6xl items-center justify-between">
        <a href="/" className="text-xl font-bold tracking-tight">
          Memory <span className="text-violet-600">Mosaic</span>
        </a>

        <span className="rounded-full bg-violet-100 px-4 py-2 text-sm font-medium text-violet-700">
          Step 1 of 3
        </span>
      </nav>

      <section className="mx-auto grid max-w-6xl overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-violet-100 lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="relative overflow-hidden bg-gradient-to-br from-violet-700 via-purple-700 to-rose-500 p-8 text-white sm:p-12">
          <div className="relative z-10">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-violet-200">
              Create together
            </p>

            <h1 className="max-w-md text-4xl font-bold leading-tight sm:text-5xl">
              Turn shared moments into something unforgettable.
            </h1>

            <p className="mt-6 max-w-md text-base leading-7 text-violet-100">
              Create a private mosaic, invite friends and collect messages,
              photographs and memories in one beautiful place.
            </p>

            <div className="mt-10 space-y-4">
              {[
                "Create your memory mosaic",
                "Share the contribution link",
                "Collect messages and pictures",
              ].map((item, index) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="flex size-8 items-center justify-center rounded-full bg-white/20 text-sm font-bold">
                    {index + 1}
                  </span>

                  <span className="text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute -bottom-20 -right-16 size-64 rounded-full bg-white/10" />
          <div className="absolute -left-16 -top-20 size-52 rounded-full bg-pink-300/20" />
        </aside>

        <section className="p-6 sm:p-10 lg:p-12">
          {!createdMosaic ? (
            <>
              <div className="mb-8">
                <p className="text-sm font-semibold text-violet-600">
                  New mosaic
                </p>

                <h2 className="mt-2 text-3xl font-bold">
                  What are we celebrating?
                </h2>

                <p className="mt-2 text-slate-500">
                  Create the mosaic now and personalise its appearance later.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <FormField
                  label="Mosaic title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Ama's graduation memories"
                />

                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField
                    label="Your name"
                    name="creatorName"
                    value={formData.creatorName}
                    onChange={handleChange}
                    placeholder="Musah"
                  />

                  <FormField
                    label="Recipient's name"
                    name="recipientName"
                    value={formData.recipientName}
                    onChange={handleChange}
                    placeholder="Ama"
                  />
                </div>

                <div>
                  <label
                    htmlFor="occasion"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Occasion
                  </label>

                  <select
                    id="occasion"
                    name="occasion"
                    value={formData.occasion}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                  >
                    <option value="">Select an occasion</option>
                    <option value="Birthday">Birthday</option>
                    <option value="Graduation">Graduation</option>
                    <option value="Wedding">Wedding</option>
                    <option value="Anniversary">Anniversary</option>
                    <option value="Farewell">Farewell</option>
                    <option value="Other">Something else</option>
                  </select>
                </div>

                {error && (
                  <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-violet-600 px-6 py-3.5 font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Creating your mosaic..." : "Create mosaic"}
                </button>
              </form>
            </>
          ) : (
            <div className="flex min-h-[450px] flex-col items-center justify-center text-center">
              <div className="mb-5 flex size-16 items-center justify-center rounded-full bg-green-100 text-2xl font-bold text-green-600">
                ✓
              </div>

              <p className="text-sm font-semibold text-green-600">
                Mosaic created successfully
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                {createdMosaic.title}
              </h2>

              <p className="mt-3 max-w-md text-slate-500">
                Copy the invitation below and send it to friends who should
                contribute.
              </p>

              <div className="mt-7 w-full rounded-2xl border border-violet-100 bg-violet-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-violet-500">
                  Share code
                </p>

                <p className="mt-2 text-2xl font-bold tracking-[0.2em] text-violet-800">
                  {createdMosaic.sharedCode}
                </p>
              </div>

              <div className="mt-4 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Invitation preview
                </p>

                <p className="whitespace-pre-line text-sm leading-6 text-slate-600">
                  {invitationMessage}
                </p>
              </div>

              {error && (
                <p className="mt-4 w-full rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </p>
              )}

              <button
                type="button"
                onClick={copyInvite}
                className="mt-5 w-full rounded-xl bg-violet-600 px-6 py-3.5 font-semibold text-white transition hover:bg-violet-700"
              >
                {copied ? "Invitation copied!" : "Copy invitation"}
              </button>

              <a
                href={shareLink}
                className="mt-3 w-full rounded-xl border border-violet-200 px-6 py-3.5 font-semibold text-violet-700 transition hover:bg-violet-50"
              >
                Open contribution page
              </a>

              <button
                type="button"
                onClick={createAnother}
                className="mt-4 text-sm font-semibold text-slate-500 hover:text-violet-600"
              >
                Create another mosaic
              </button>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

function FormField({
  label,
  name,
  value,
  onChange,
  placeholder,
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-semibold text-slate-700"
      >
        {label}
      </label>

      <input
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
      />
    </div>
  );
}

export default CreateOccasion;