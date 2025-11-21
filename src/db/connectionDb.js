import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.DATABASE_CONNECTION_URI;

if (!uri) {
    console.error("DATABASE_CONNECTION_URI is not defined in .env");
    process.exit(1);
}

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(uri);
        console.log("MongoDB Connected...", connectionInstance.connection.host);
    } catch (error) {
        console.error("Error connecting to Database:", error.message);
        process.exit(1);
    }
};

export default connectDB;
