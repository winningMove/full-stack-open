import "dotenv/config";

const { PORT, USER_SECRET } = process.env;
const MONGO_URI =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_MONGO_URI
    : process.env.MONGO_URI;

export { MONGO_URI, PORT, USER_SECRET };
