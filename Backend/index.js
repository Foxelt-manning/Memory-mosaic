import "dotenv/config"
import app from './src/app.js';
import connectDB from "./src/config/db.js"

const PORT = process.env.PORT;


const startServer = async() => {
  try {
    await connectDB();

    app.listen(PORT,()=>{
      console.log(`Server is running at https:localhost:${PORT}`)
    })

    
  } catch (error) {
    console.log(`Server statup failed due to error:${error.message} `)
    process.exit(1);
  }
}

startServer();