import { Router } from "express";
import { stripeWebhook } from "../controllers/stripeWebhook.controller.js";
import express from "express";

const router = new Router();
router
  .route("/webhook")
  .post(express.raw({ type: "application/json" }), stripeWebhook);

export default router;
