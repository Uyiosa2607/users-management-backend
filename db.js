import mongoose from "mongoose"

const connectDB = async function() {

    try {

     const conn = await mongoose.connect(process.env.MONGO_URL, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });

         const port = conn.connection.host

        console.log(`DB connected succesfully, Connection Port: ${port}`);

    } catch (error) {
        
        console.log(error)
    }
}

export default connectDB;