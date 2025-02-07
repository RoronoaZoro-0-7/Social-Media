import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose.connect(process.env.MONGO_URL);
mongoose.connection.on("error", (err) => {
    console.log("Mongoose connection error : " + err);
    process.exit(1);
});

mongoose.connection.on("connected", () => {
    console.log("Mongoose is connected : "+ process.env.MONGO_URL);
});

export default mongoose;