import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  addContribution,
  getMosaic,
} from "../services/api.js";

import { saveMosaic } from "../services/mosaicStorage.js";

function MosaicContribution() {
  const { sharedCode } = useParams();

  const [mosaic, setMosaic] = useState(null);
  const [contributorName, setContributorName] = useState("");
  const [message, setMessage] = useState("");

  const [media, setMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState("");
  const [mediaType, setMediaType] = useState("");

  const [loadingMosaic, setLoadingMosaic] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadMosaic = async () => {
      try {
        setError("");

        const data = await getMosaic(sharedCode);

setMosaic(data.mosaic);

saveMosaic(data.mosaic, "visitor");
      } catch (error) {
        setError(error.message);
      } finally {
        setLoadingMosaic(false);
      }
    };

    loadMosaic();
  }, [sharedCode]);

  useEffect(() => {
    return () => {
      if (mediaPreview) {
        URL.revokeObjectURL(mediaPreview);
      }
    };
  }, [mediaPreview]);

  const handleMediaChange = (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    const isImage = selectedFile.type.startsWith("image/");
    const isVideo = selectedFile.type.startsWith("video/");

    if (!isImage && !isVideo) {
      setError("Only image and video files are allowed.");
      return;
    }

    const maximumSize = 50 * 1024 * 1024;

    if (selectedFile.size > maximumSize) {
      setError("The selected file must be smaller than 50 MB.");
      return;
    }

    setMedia(selectedFile);
    setMediaType(isImage ? "image" : "video");
    setMediaPreview(URL.createObjectURL(selectedFile));

    setError("");
    setSuccess("");
  };

  const removeMedia = () => {
    setMedia(null);
    setMediaPreview("");
    setMediaType("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!contributorName.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!message.trim() && !media) {
      setError("Please add a message, photograph or video.");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const contributionData = new FormData();

      contributionData.append(
        "contributorName",
        contributorName.trim()
      );

      contributionData.append("message", message.trim());

      if (media) {
        contributionData.append("media", media);
      }

      const data = await addContribution(
        sharedCode,
        contributionData
      );

      setMosaic((previousMosaic) => ({
        ...previousMosaic,
        contributions: [
          ...(previousMosaic.contributions || []),
          data.contribution,
        ],
      }));

      setContributorName("");
      setMessage("");
      removeMedia();
      saveMosaic(mosaic, "contributor");
      setSuccess("Your memory has been added successfully.");

    } catch (error) {
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingMosaic) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fff8f3]">
        <div className="text-center">
          <div className="mx-auto size-12 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />

          <p className="mt-4 font-medium text-violet-700">
            Opening the mosaic...
          </p>
        </div>
      </main>
    );
  }

  if (!mosaic) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fff8f3] px-4">
        <section className="w-full max-w-md rounded-3xl bg-white p-10 text-center shadow-xl">
          <div className="text-5xl">🔍</div>

          <h1 className="mt-5 text-2xl font-bold text-slate-900">
            Mosaic not found
          </h1>

          <p className="mt-3 text-slate-500">
            {error ||
              "This invitation may be incorrect or expired."}
          </p>

          <a
            href="/"
            className="mt-6 inline-block rounded-xl bg-violet-600 px-6 py-3 font-semibold text-white"
          >
            Return home
          </a>
        </section>
      </main>
    );
  }

  const contributions = mosaic.contributions || [];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#fff8f3] px-4 py-8 text-slate-900 sm:px-6">
      <div className="pointer-events-none absolute -left-32 top-64 size-96 rounded-full bg-pink-200/40 blur-3xl" />

      <div className="pointer-events-none absolute -right-32 top-10 size-96 rounded-full bg-violet-200/50 blur-3xl" />

      <nav className="relative z-10 mx-auto mb-8 flex max-w-6xl items-center justify-between">
        <a href="/" className="text-xl font-bold tracking-tight">
          Memory <span className="text-violet-600">Mosaic</span>
        </a>

        <span className="rounded-full border border-violet-200 bg-white/80 px-4 py-2 text-sm font-semibold text-violet-700 backdrop-blur">
          {mosaic.occasion}
        </span>
      </nav>

      <section className="relative z-10 mx-auto max-w-6xl">

                    <a
                    href={`/mosaic/${sharedCode}/view`}
                    className="rounded-full bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-700"
                    >
                    View presentation
            </a>
        <header className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-violet-700 via-purple-700 to-rose-500 px-6 py-12 text-white shadow-2xl shadow-violet-200 sm:px-12 sm:py-16">
          <div className="relative z-10 max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-200">
              A collection for {mosaic.recipientName}
            </p>

            <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-6xl">
              {mosaic.title}
            </h1>

            <p className="mt-6 max-w-xl leading-7 text-violet-100">
              {mosaic.creatorName} created this space for
              friends and loved ones to preserve meaningful
              moments together.
            </p>

            <div className="mt-8 inline-flex rounded-full bg-white/15 px-4 py-2 text-sm backdrop-blur">
              {contributions.length}{" "}
              {contributions.length === 1
                ? "memory"
                : "memories"}{" "}
              collected
            </div>
          </div>

          <div className="absolute -bottom-24 -right-20 size-80 rounded-full bg-white/10" />

          <div className="absolute -left-20 -top-24 size-64 rounded-full bg-pink-300/20" />
        </header>

        <div className="mt-10 grid items-start gap-10 lg:grid-cols-[1fr_400px]">
          <section>
            <div className="mb-6">
              <p className="text-sm font-semibold text-violet-600">
                The memory wall
              </p>

              <h2 className="mt-1 text-3xl font-bold">
                Moments shared with {mosaic.recipientName}
              </h2>
            </div>

            {contributions.length === 0 ? (
              <div className="rounded-[2rem] border-2 border-dashed border-violet-200 bg-white/70 p-12 text-center backdrop-blur">
                <div className="text-5xl">📷</div>

                <h3 className="mt-5 text-xl font-bold">
                  This mosaic is waiting for its first memory
                </h3>

                <p className="mx-auto mt-3 max-w-md text-slate-500">
                  Add a photograph, video, heartfelt message or
                  funny moment to begin the collection.
                </p>
              </div>
            ) : (
              <div className="columns-1 gap-5 sm:columns-2">
                {contributions.map((contribution, index) => (
                  <article
                    key={contribution._id || index}
                    className={`mb-5 break-inside-avoid overflow-hidden rounded-3xl bg-white p-3 shadow-lg shadow-violet-100 transition duration-300 hover:-translate-y-1 hover:shadow-xl ${
                      index % 2 === 0
                        ? "rotate-[-0.5deg]"
                        : "rotate-[0.5deg]"
                    }`}
                  >
                    {contribution.mediaUrl &&
                      contribution.type === "video" && (
                        <video
                          src={contribution.mediaUrl}
                          controls
                          preload="metadata"
                          className="max-h-[420px] w-full rounded-2xl bg-black object-contain"
                        >
                          Your browser does not support video
                          playback.
                        </video>
                      )}

                    {contribution.mediaUrl &&
                      contribution.type !== "video" && (
                        <img
                          src={contribution.mediaUrl}
                          alt={`Memory from ${contribution.contributorName}`}
                          loading="lazy"
                          className="max-h-[420px] w-full rounded-2xl object-cover"
                        />
                      )}

                    <div className="p-4">
                      {contribution.message && (
                        <p className="whitespace-pre-wrap leading-7 text-slate-700">
                          “{contribution.message}”
                        </p>
                      )}

                      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                        <p className="font-semibold text-violet-700">
                          {contribution.contributorName}
                        </p>

                        <span className="text-xs text-slate-400">
                          Memory #{index + 1}
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <aside className="lg:sticky lg:top-6">
            <form
              onSubmit={handleSubmit}
              className="rounded-[2rem] border border-white bg-white/90 p-6 shadow-2xl shadow-violet-100 backdrop-blur sm:p-8"
            >
              <p className="text-sm font-semibold text-violet-600">
                Add to the mosaic
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                Share your memory
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Add a personal message, photograph, short video
                or a combination of them.
              </p>

              <div className="mt-7">
                <label
                  htmlFor="contributorName"
                  className="mb-2 block text-sm font-semibold"
                >
                  Your name
                </label>

                <input
                  id="contributorName"
                  name="contributorName"
                  type="text"
                  value={contributorName}
                  onChange={(event) =>
                    setContributorName(event.target.value)
                  }
                  placeholder="How should we credit you?"
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                />
              </div>

              <div className="mt-5">
                <label className="mb-2 block text-sm font-semibold">
                  Photograph or video
                </label>

                {mediaPreview ? (
                  <div className="relative overflow-hidden rounded-2xl bg-slate-950">
                    {mediaType === "image" ? (
                      <img
                        src={mediaPreview}
                        alt="Selected contribution"
                        className="h-56 w-full object-cover"
                      />
                    ) : (
                      <video
                        src={mediaPreview}
                        controls
                        className="h-56 w-full object-contain"
                      />
                    )}

                    <button
                      type="button"
                      onClick={removeMedia}
                      className="absolute right-3 top-3 rounded-full bg-black/70 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-black"
                    >
                      Remove
                    </button>

                    <div className="absolute bottom-3 left-3 rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white">
                      {mediaType === "image"
                        ? "Photograph"
                        : "Video"}
                    </div>
                  </div>
                ) : (
                  <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-violet-200 bg-violet-50/50 px-5 py-8 text-center transition hover:border-violet-400 hover:bg-violet-50">
                    <span className="text-3xl">📷</span>

                    <span className="mt-3 font-semibold text-violet-700">
                      Choose a photo or video
                    </span>

                    <span className="mt-1 text-xs text-slate-500">
                      Images and videos up to 50 MB
                    </span>

                    <input
                      type="file"
                      name="media"
                      accept="image/*,video/*"
                      onChange={handleMediaChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="message"
                    className="text-sm font-semibold"
                  >
                    Your message
                  </label>

                  <span className="text-xs text-slate-400">
                    Optional with media
                  </span>
                </div>

                <textarea
                  id="message"
                  name="message"
                  value={message}
                  onChange={(event) =>
                    setMessage(event.target.value)
                  }
                  placeholder={`Share a moment with ${mosaic.recipientName}...`}
                  rows="5"
                  maxLength="1000"
                  className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                />

                <p className="mt-1 text-right text-xs text-slate-400">
                  {message.length}/1000
                </p>
              </div>

              {error && (
                <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </p>
              )}

              {success && (
                <p className="mt-4 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
                  {success}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="mt-5 w-full rounded-xl bg-violet-600 px-6 py-3.5 font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting
                  ? "Adding your memory..."
                  : "Add memory to mosaic"}
              </button>
            </form>
          </aside>
            <a
                    href={`/mosaic/${sharedCode}/view`}
                      className="mt-5 py-3.5 text-center w-full rounded-xl bg-violet-600  py-3.5 font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                    View presentation
            </a>
        </div>
      </section>
    </main>
  );
}

export default MosaicContribution;