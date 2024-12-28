import { startServer } from "./apollo/server.js";
import { connectToDatabase } from "./db.js";

await connectToDatabase();
await startServer();
