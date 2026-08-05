import mongoose from "mongoose";

let connectionPromise: Promise<typeof mongoose> | null = null;

export async function connectDB(){
    try {
        if (mongoose.connection.readyState === 1) {
            return;
        }

        connectionPromise ??= mongoose.connect(process.env.MONGO_URI!);
        await connectionPromise;
        console.log("Mongodb connected successfully!");
    } catch (error) {
        connectionPromise = null;
        console.log("Something went wrong",error);      
        throw error;
    }
}
