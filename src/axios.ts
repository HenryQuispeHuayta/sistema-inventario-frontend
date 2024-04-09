import axios from "axios";

export default axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  httpsAgent:
    process.env.NODE_ENV === "development" ? { rejectUnauthorized: false } : {},
});
