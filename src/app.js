import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// CORS
app.use(cors({
    origin: "http://localhost:3000", // change to your frontend
    credentials: true
}));

// Static files
app.use(express.static(path.join(__dirname, "../public")));

// Routes
app.get("/", (req, res) => {
    res.status(200).json({ message: "API is running" });
});

export default app;
