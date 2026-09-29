import "dotenv/config"
import express from "express"
import cors from "cors"

const app = express()

app.use(cors({
  origin: process.env.CLIENT_URL,
}
));


app.use(express.json());


app.get("/api/health",(req,res) =>{
    res.status(200).json({
    success:     true,
    message:     "Memory Mosaic is up and running",
    environment: process.env.NODE_ENV
    });
});


const PORT = process.env.PORT;
app.listen(PORT, ()=>{
 console.log(`Server running successfully at http://localhost:${PORT}`)
})