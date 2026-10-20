import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getSavedMosaics,
  removeSavedMosaic,
} from "../services/mosaicStorage.js";

function RecentMosaics() {
  const [mosaics, setMosaics] = useState(
    getSavedMosaics
  );

  useEffect(() => {
    const updateMosaics = () => {
      setMosaics(getSavedMosaics());
    };

    window.addEventListener(
      "mosaic-storage-updated",
      updateMosaics
    );

    window.addEventListener("storage", updateMosaics);

    return () => {
      window.removeEventListener(
        "mosaic-storage-updated",
        updateMosaics
      );

      window.removeEventListener(
        "storage",
        updateMosaics
      );
    };
  }, []);

  if (mosaics.length === 0) {
    return null;
  }

  const removeMosaic = (sharedCode) => {
    removeSavedMosaic(sharedCode);
    setMosaics(getSavedMosaics());
  };

  return (
    <section className="border-y border-slate-800 bg-slate-900/50 px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="font-semibold text-pink-400">
              Saved in this browser
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              Your recent mosaics
            </h2>

            <p className="mt-3 max-w-xl text-slate-400">
              Quickly return to mosaics you created, visited or
              contributed to.
            </p>
          </div>

          <Link
            to="/create"
            className="w-fit rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-pink-100"
          >
            Create another
          </Link>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {mosaics.map((mosaic) => (
            <article
              key={mosaic.sharedCode}
              className="rounded-3xl border border-slate-800 bg-slate-950 p-6 transition hover:-translate-y-1 hover:border-purple-500/60"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="rounded-full bg-purple-500/15 px-3 py-1 text-xs font-semibold capitalize text-purple-300">
                  {mosaic.relationship}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    removeMosaic(mosaic.sharedCode)
                  }
                  className="text-sm text-slate-500 transition hover:text-red-400"
                  aria-label={`Remove ${mosaic.title}`}
                >
                  Remove
                </button>
              </div>

              <h3 className="mt-5 text-xl font-bold">
                {mosaic.title}
              </h3>

              {mosaic.recipientName && (
                <p className="mt-2 text-sm text-slate-400">
                  For {mosaic.recipientName}
                </p>
              )}

              <div className="mt-5 flex items-center justify-between text-xs text-slate-500">
                <span>
                  {mosaic.occasion || "Special occasion"}
                </span>

                <span>{mosaic.sharedCode}</span>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <Link
                  to={`/mosaic/${mosaic.sharedCode}`}
                  className="rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-3 text-center text-sm font-semibold text-white"
                >
                  Open
                </Link>

                <Link
                  to={`/mosaic/${mosaic.sharedCode}/view`}
                  className="rounded-xl border border-slate-700 px-4 py-3 text-center text-sm font-semibold text-slate-200 transition hover:bg-slate-900"
                >
                  View
                </Link>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-6 text-sm text-slate-500">
          These mosaics are stored only on this browser and
          device.
        </p>
      </div>
    </section>
  );
}

export default RecentMosaics;