import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { getMosaic } from "../services/api.js";

function MosaicViewer() {
  const { sharedCode } = useParams();

  const [mosaic, setMosaic] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const touchStart = useRef(null);

  useEffect(() => {
    const loadMosaic = async () => {
      try {
        const data = await getMosaic(sharedCode);
        setMosaic(data.mosaic);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadMosaic();
  }, [sharedCode]);

  const slides = useMemo(() => {
    if (!mosaic) {
      return [];
    }

    return [
      {
        id: "introduction",
        slideType: "introduction",
      },
      ...(mosaic.contributions || []).map((contribution) => ({
        ...contribution,
        slideType: "contribution",
      })),
      {
        id: "ending",
        slideType: "ending",
      },
    ];
  }, [mosaic]);

  const previousSlide = () => {
    setCurrentIndex((previous) =>
      previous === 0 ? slides.length - 1 : previous - 1
    );
  };

  const nextSlide = () => {
    setCurrentIndex((previous) =>
      previous === slides.length - 1 ? 0 : previous + 1
    );
  };

  useEffect(() => {
    const handleKeyboard = (event) => {
      if (event.key === "ArrowRight") {
        nextSlide();
      }

      if (event.key === "ArrowLeft") {
        previousSlide();
      }
    };

    window.addEventListener("keydown", handleKeyboard);

    return () => {
      window.removeEventListener("keydown", handleKeyboard);
    };
  });

  const handleTouchStart = (event) => {
    touchStart.current = event.touches[0].clientX;
  };

  const handleTouchEnd = (event) => {
    if (touchStart.current === null) {
      return;
    }

    const touchEnd = event.changedTouches[0].clientX;
    const difference = touchStart.current - touchEnd;

    if (difference > 60) {
      nextSlide();
    }

    if (difference < -60) {
      previousSlide();
    }

    touchStart.current = null;
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <div className="mx-auto size-12 animate-spin rounded-full border-4 border-violet-400/30 border-t-violet-400" />

          <p className="mt-4 text-sm text-slate-300">
            Preparing your memories...
          </p>
        </div>
      </main>
    );
  }

  if (!mosaic || error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-5 text-white">
        <section className="max-w-md text-center">
          <p className="text-5xl">🔍</p>

          <h1 className="mt-5 text-3xl font-bold">
            Mosaic not found
          </h1>

          <p className="mt-3 text-slate-400">
            {error || "This mosaic could not be opened."}
          </p>

          <a
            href="/"
            className="mt-7 inline-block rounded-full bg-white px-6 py-3 font-semibold text-slate-950"
          >
            Return home
          </a>
        </section>
      </main>
    );
  }

  const currentSlide = slides[currentIndex];

  return (
    <main
      className="relative min-h-screen overflow-hidden bg-slate-950 text-white"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <SlideBackground slide={currentSlide} />

      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/10 to-black/70" />

      <nav className="absolute left-0 right-0 top-0 z-30 flex items-center justify-between px-5 py-5 sm:px-8">
        <a
          href="/"
          className="font-bold tracking-tight text-white"
        >
          Memory <span className="text-violet-300">Mosaic</span>
        </a>

        <a
          href={`/mosaic/${sharedCode}`}
          className="rounded-full border border-white/20 bg-black/20 px-4 py-2 text-sm font-medium backdrop-blur-md transition hover:bg-white/10"
        >
          Add a memory
        </a>
      </nav>

      <section className="relative z-20 flex min-h-screen items-center justify-center px-5 py-24">
        <div
          key={currentIndex}
          className="w-full max-w-5xl animate-[fadeIn_500ms_ease-out]"
        >
          {currentSlide.slideType === "introduction" && (
            <IntroductionSlide mosaic={mosaic} />
          )}

          {currentSlide.slideType === "contribution" && (
            <ContributionSlide contribution={currentSlide} />
          )}

          {currentSlide.slideType === "ending" && (
            <EndingSlide
              mosaic={mosaic}
              sharedCode={sharedCode}
            />
          )}
        </div>
      </section>

      <button
        type="button"
        onClick={previousSlide}
        aria-label="Previous memory"
        className="absolute left-3 top-1/2 z-30 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/30 text-2xl backdrop-blur-md transition hover:bg-white/20 sm:left-6"
      >
        ‹
      </button>

      <button
        type="button"
        onClick={nextSlide}
        aria-label="Next memory"
        className="absolute right-3 top-1/2 z-30 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/30 text-2xl backdrop-blur-md transition hover:bg-white/20 sm:right-6"
      >
        ›
      </button>

      <footer className="absolute bottom-0 left-0 right-0 z-30 px-5 pb-5 sm:px-8 sm:pb-7">
        <div className="mx-auto max-w-3xl">
          <div className="flex gap-1.5">
            {slides.map((slide, index) => (
              <button
                key={slide._id || slide.id}
                type="button"
                onClick={() => setCurrentIndex(index)}
                aria-label={`Open slide ${index + 1}`}
                className={`h-1.5 flex-1 rounded-full transition ${
                  index === currentIndex
                    ? "bg-white"
                    : "bg-white/25 hover:bg-white/50"
                }`}
              />
            ))}
          </div>

          <div className="mt-3 flex justify-between text-xs text-white/60">
            <span>
              {currentIndex + 1} of {slides.length}
            </span>

            <span>Swipe or use arrow keys</span>
          </div>
        </div>
      </footer>
    </main>
  );
}

function SlideBackground({ slide }) {
  if (
    slide?.slideType === "contribution" &&
    slide.type === "image" &&
    slide.mediaUrl
  ) {
    return (
      <div className="absolute inset-0">
        <img
          src={slide.mediaUrl}
          alt=""
          className="h-full w-full scale-110 object-cover opacity-40 blur-3xl"
        />
      </div>
    );
  }

  return (
    <>
      <div className="absolute -left-32 top-20 size-[28rem] rounded-full bg-violet-700/30 blur-3xl" />

      <div className="absolute -right-32 bottom-20 size-[30rem] rounded-full bg-rose-600/20 blur-3xl" />
    </>
  );
}

function IntroductionSlide({ mosaic }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.35em] text-violet-300">
        {mosaic.occasion}
      </p>

      <h1 className="mt-6 text-5xl font-bold leading-tight sm:text-7xl">
        {mosaic.title}
      </h1>

      <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-slate-300">
        A collection of messages and moments created for{" "}
        <span className="font-semibold text-white">
          {mosaic.recipientName}
        </span>
        .
      </p>

      <div className="mt-10 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-5 py-3 backdrop-blur-md">
        <span className="text-sm text-slate-300">
          Created with love by
        </span>

        <span className="font-semibold">
          {mosaic.creatorName}
        </span>
      </div>
    </div>
  );
}

function ContributionSlide({ contribution }) {
  if (contribution.type === "image" && contribution.mediaUrl) {
    return (
      <div className="mx-auto grid max-w-5xl items-center gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-black/30 p-2 shadow-2xl">
          <img
            src={contribution.mediaUrl}
            alt={`Memory shared by ${contribution.contributorName}`}
            className="max-h-[65vh] w-full rounded-[1.6rem] object-contain"
          />
        </div>

        <MessageContent contribution={contribution} />
      </div>
    );
  }

  if (contribution.type === "video" && contribution.mediaUrl) {
    return (
      <div className="mx-auto max-w-4xl">
        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-black shadow-2xl">
          <video
            src={contribution.mediaUrl}
            controls
            autoPlay
            playsInline
            className="max-h-[65vh] w-full object-contain"
          >
            Your browser does not support video playback.
          </video>
        </div>

        {(contribution.message ||
          contribution.contributorName) && (
          <div className="mt-6 text-center">
            {contribution.message && (
              <p className="text-lg leading-8 text-slate-200">
                “{contribution.message}”
              </p>
            )}

            <p className="mt-3 font-semibold text-violet-300">
              {contribution.contributorName}
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl rounded-[2rem] border border-white/15 bg-white/10 p-8 text-center shadow-2xl backdrop-blur-xl sm:p-14">
      <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-violet-400/20 text-2xl">
        💌
      </div>

      <blockquote className="mt-8 text-2xl font-medium leading-relaxed sm:text-4xl sm:leading-relaxed">
        “{contribution.message}”
      </blockquote>

      <p className="mt-8 font-semibold text-violet-300">
        — {contribution.contributorName}
      </p>
    </div>
  );
}

function MessageContent({ contribution }) {
  return (
    <div className="rounded-[2rem] border border-white/15 bg-black/30 p-7 backdrop-blur-xl sm:p-9">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-300">
        A shared memory
      </p>

      {contribution.message && (
        <blockquote className="mt-5 text-2xl font-medium leading-relaxed">
          “{contribution.message}”
        </blockquote>
      )}

      <p className="mt-7 font-semibold text-white">
        — {contribution.contributorName}
      </p>
    </div>
  );
}

function EndingSlide({ mosaic, sharedCode }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <div className="text-6xl">✨</div>

      <p className="mt-7 text-sm font-semibold uppercase tracking-[0.3em] text-violet-300">
        Made with love
      </p>

      <h2 className="mt-5 text-4xl font-bold sm:text-6xl">
        For {mosaic.recipientName}
      </h2>

      <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-slate-300">
        Every photograph, video and message represents a moment
        worth remembering.
      </p>

      <a
        href={`/mosaic/${sharedCode}`}
        className="mt-9 inline-block rounded-full bg-white px-7 py-3.5 font-semibold text-slate-950 transition hover:bg-violet-100"
      >
        Add another memory
      </a>
    </div>
  );
}

export default MosaicViewer;