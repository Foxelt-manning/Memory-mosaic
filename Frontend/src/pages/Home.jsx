import React from 'react';
import { Link } from 'react-router-dom';
import RecentMosaics from '../components/RecentMosaics.jsx';
  
    const Home = () => {
  const occasions = [
    "Birthdays",
    "Graduations",
    "Anniversaries",
    "Weddings",
    "Achievements",
    "Just Because",
  ];

  const steps = [
    {
      number: "01",
      title: "Create a celebration",
      description:
        "Choose the occasion, add the recipient’s details, and personalize the page.",
    },
    {
      number: "02",
      title: "Invite loved ones",
      description:
        "Share a private link so friends and family can submit messages, photos, and videos.",
    },
    {
      number: "03",
      title: "Reveal the surprise",
      description:
        "Present everything as a beautiful animated experience they can enjoy and remember.",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Navigation */}
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <a href="/" className="text-xl font-bold">
          Wishes<span className="text-pink-400">&</span>Greetings
        </a>

        <div className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
          <a href="#how-it-works" className="hover:text-white">
            How it works
          </a>

          <a href="#occasions" className="hover:text-white">
            Occasions
          </a>
        </div>

        <button className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-pink-100">
          Get started
        </button>
      </nav>

      {/* Hero section */}
      <section className="relative overflow-hidden px-6 py-24 text-center md:py-32">
        <div className="absolute left-0 top-20 h-72 w-72 rounded-full bg-purple-600/30 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-pink-500/30 blur-3xl" />

        <div className="relative mx-auto max-w-4xl">
          <span className="inline-block rounded-full border border-pink-400/30 bg-pink-400/10 px-4 py-2 text-sm text-pink-300">
            Celebrate the people who matter
          </span>

          <h1 className="mt-8 text-4xl font-bold leading-tight sm:text-6xl md:text-7xl">
            Make every special moment{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              unforgettable.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            Create a beautiful digital celebration filled with heartfelt
            messages, photos, videos, and memories from everyone they love.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <button className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-4 font-semibold shadow-lg shadow-pink-500/20 transition hover:scale-105">
               <Link to="/create">
                 Create a celebration
               </Link>
            </button>

            <a
              href="#how-it-works"
              className="rounded-full border border-slate-700 px-8 py-4 font-semibold transition hover:border-slate-400 hover:bg-slate-900"
            >
              See how it works
            </a>
          </div>
        </div>
      </section>
        <RecentMosaics />
      {/* How it works */}
      <section
        id="how-it-works"
        className="border-y border-slate-800 bg-slate-900/50 px-6 py-20"
      >
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="font-semibold text-pink-400">Simple and meaningful</p>

            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Create a surprise in three steps
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {steps.map((step) => (
              <article
                key={step.number}
                className="rounded-3xl border border-slate-800 bg-slate-950 p-8 transition hover:-translate-y-1 hover:border-purple-500/50"
              >
                <span className="text-sm font-bold text-purple-400">
                  STEP {step.number}
                </span>

                <h3 className="mt-5 text-xl font-semibold">{step.title}</h3>

                <p className="mt-3 leading-7 text-slate-400">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Occasions */}
      <section id="occasions" className="px-6 py-20">
        <div className="mx-auto max-w-5xl text-center">
          <p className="font-semibold text-purple-400">
            For every special moment
          </p>

          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            There is always something worth celebrating
          </h2>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {occasions.map((occasion) => (
              <span
                key={occasion}
                className="rounded-full border border-slate-700 bg-slate-900 px-5 py-3 text-slate-300"
              >
                {occasion}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Final call to action */}
      <section className="px-6 pb-20">
        <div className="mx-auto max-w-5xl rounded-3xl bg-gradient-to-r from-purple-600 to-pink-500 px-6 py-16 text-center shadow-2xl shadow-purple-900/30">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Your words can become someone’s favourite memory.
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-purple-50">
            Bring messages, pictures, and videos together to create a surprise
            they will never forget.
          </p>

          <button className="mt-8 rounded-full bg-white px-8 py-4 font-semibold text-purple-700 transition hover:scale-105">
          <Link to="/create">Start creating</Link>  
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 px-6 py-8 text-center text-sm text-slate-500">
        © 2026 Wishes & Greetings. Made for unforgettable moments.
      </footer>
    </main>
  );
};

export default Home;
  