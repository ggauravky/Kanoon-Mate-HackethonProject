import dns from "node:dns";
import mongoose from "mongoose";
import { seedLegalServices } from "../seeds/legalServices.seed.js";

const getMongoDnsServers = () => {
    const configuredServers = process.env.MONGO_DNS_SERVERS
        ?.split(",")
        .map((server) => server.trim())
        .filter(Boolean);

    if (configuredServers?.length) {
        return configuredServers;
    }

    const currentServers = dns.getServers();
    const usesLocalDnsProxy = currentServers.some((server) =>
        ["127.0.0.1", "::1"].includes(server)
    );

    return usesLocalDnsProxy ? ["8.8.8.8", "1.1.1.1"] : [];
};

export const connectDB = async () => {
    try{
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is missing in .env");
        }

        if (process.env.MONGO_URI.startsWith("mongodb+srv://")) {
            const mongoDnsServers = getMongoDnsServers();

            if (mongoDnsServers.length) {
                dns.setServers(mongoDnsServers);
                console.log(`MongoDB DNS servers: ${mongoDnsServers.join(", ")}`);
            }
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected successfully");

        // Seed sample Legal Services if collection is empty
        await seedLegalServices();
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
};

export default connectDB;
