import express from "express";
import { ENV } from "./config/env.js";

const app = express();
const PORT = ENV.PORT;

app.get("/api/health", (req, res) => {
    res.status(200).json({ status: true, message: "Server is running" });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});