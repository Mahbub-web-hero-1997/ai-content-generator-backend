import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
// import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import webhookRoute from "./routes/stripeWebhook.route.js";
// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ------------------ MIDDLEWARES ------------------

// Security HTTP headers
app.use(helmet());

// CORS
app.use(
  cors({
    origin: process.env.FRONT_END_URL || "*",
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
  message: "Too many requests from this IP, please try again later.",
});
app.use("/api", limiter);
// Stripe webhook endpoint url
app.use("/api/v1/stripe", webhookRoute);
// Body parser
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// Data sanitization against NoSQL injection & XSS
// app.use(mongoSanitize());

// Logging HTTP requests (development only)
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Static files
app.use(express.static(path.join(__dirname, "../public")));

// ------------------ ROUTES ------------------
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

// Health check route
app.get("/", (req, res) => {
  res.status(200).json({ message: "API is running" });
});

// ------------------ GLOBAL ERROR HANDLER ------------------
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(err.status || 500).json({
//     success: false,
//     message: err.message || "Internal Server Error",
//     ...(process.env.NODE_ENV === "development" ? { stack: err.stack } : {}),
//   });
// });

export default app;
