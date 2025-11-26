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
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

// Static files
app.use(express.static(path.join(__dirname, "../public")));

// All Routes
import userRoute from "./routes/user.route.js";
import templateRoute from "./routes/template.route.js";
import generationHistoryRoute from "./routes/generationHistory.route.js";
import subscriptionPlanRoute from "./routes/subscriptionPlan.route.js";
import paymentRoute from "./routes/payment.route.js";

app.use("/api/v1/auth", userRoute);
app.use("/api/v1/template", templateRoute);
app.use("/api/v1/history", generationHistoryRoute);
app.use("/api/v1/subscription", subscriptionPlanRoute);
app.use("/api/v1/payment", paymentRoute);

app.get("/", (req, res) => {
  res.status(200).json({ message: "API is running" });
});

export default app;
