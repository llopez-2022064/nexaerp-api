import { startServer } from "./src/config/app-config.js";
import { connectDB } from "./src/config/database.js";

await connectDB()
startServer()