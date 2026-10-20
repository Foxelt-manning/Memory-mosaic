import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import mosaicRoutes from "./routes/mosaicRoutes.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      const isAllowedVercelDeployment =
        origin?.startsWith("https://memory-mosaic-") &&
        origin?.endsWith(
          "-musah-inusahs-projects.vercel.app"
        );

      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        isAllowedVercelDeployment
      ) {
        return callback(null, true);
      }

      return callback(
        new Error(`CORS blocked request from ${origin}`)
      );
    },
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/mosaics", mosaicRoutes);

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Memory Mosaic is up and running",
    environment: process.env.NODE_ENV,
  });
});

export default app;