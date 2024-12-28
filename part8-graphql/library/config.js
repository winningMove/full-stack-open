import "dotenv/config";

// token verification always fails if the secret is a plain utf-8 string
export const JWT_SECRET = Buffer.from(process.env.JWT_SECRET, "base64");

export const { MONGO_URI, PORT } = process.env;
