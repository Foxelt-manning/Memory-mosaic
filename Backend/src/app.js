import express from "express"
import cors from "cors"

import authRoutes from "./routes/authRoutes.js"
import mosaicRoutes from "./routes/mosaicRoutes.js"

const app = express()

app.use(
  cors(
 { 
    origin: process.env.CLIENT_URL,
 }
  )
     );


app.use(express.json());
app.use("/api/auth",authRoutes);
app.use("/api/mosaics",mosaicRoutes);

app.get("/api/health",(req,res) =>{
    res.status(200).json({
    success:     true,
    message:     "Memory Mosaic is up and running",
    environment: process.env.NODE_ENV
    });
});

export default app;
