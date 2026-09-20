import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-6 text-white">
      {/* Animated background */}
      <div className="not-found-glow glow-one" />
      <div className="not-found-glow glow-two" />

      <div className="floating-shape shape-one">✦</div>
      <div className="floating-shape shape-two">♡</div>
      <div className="floating-shape shape-three">✧</div>
      <div className="floating-shape shape-four">♥</div>

      <section className="relative z-10 max-w-2xl text-center">
        {/* Flying letter */}
        <div className="letter-container mx-auto mb-8">
          <div className="speed-line speed-line-one" />
          <div className="speed-line speed-line-two" />
          <div className="speed-line speed-line-three" />

          <div className="flying-letter">
            <div className="letter-flap" />
            <div className="letter-heart">♥</div>
          </div>
        </div>

        <p className="text-sm font-bold uppercase tracking-[0.4em] text-pink-400">
          Message undelivered
        </p>

        <h1 className="mt-4 bg-gradient-to-r from-purple-400 via-pink-400 to-orange-300 bg-clip-text text-7xl font-black text-transparent sm:text-9xl">
          404
        </h1>

        <h2 className="mt-4 text-2xl font-bold sm:text-4xl">
          This celebration flew away
        </h2>

        <p className="mx-auto mt-5 max-w-lg leading-7 text-slate-400">
          The page you’re looking for may have expired, been removed, or taken
          a wrong turn while delivering its wishes.
        </p>

        <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            to="/"
            className="rounded-full bg-gradient-to-r from-purple-600 to-pink-500 px-8 py-4 font-semibold shadow-lg shadow-pink-500/20 transition hover:scale-105"
          >
            Return home
          </Link>

          <Link
            to="/create"
            className="rounded-full border border-slate-700 bg-slate-900/70 px-8 py-4 font-semibold text-slate-200 transition hover:border-purple-400 hover:bg-slate-800"
          >
            Create an occasion
          </Link>
        </div>
      </section>
    </main>
  );
};

export default NotFound;