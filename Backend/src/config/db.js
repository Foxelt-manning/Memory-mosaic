import mongoose from 'mongoose';

const connectDB = async() =>{
 const connection = await mongoose.connect(process.env.MONGODB_URI);

  console.log(`Memory mosaic database connected successfully @ ${connection.connection.host}`)
}

export default connectDB; 