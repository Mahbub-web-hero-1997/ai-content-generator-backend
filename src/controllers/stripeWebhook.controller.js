import stripe from "../config/stripe.config.js";
import { Payment } from "../models/payment.model.js";
import apiErrors from "../utils/apiErrors.js";
import apiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const stripeWebhook = asyncHandler(async (req, res) => {
  const signature = req.headers["stripe-signature"];

  // Verify Stripe webhook signature
  const event = stripe.webhooks.constructEvent(
    req.body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET
  );

  let session;

  if (event.type === "checkout.session.completed") {
    session = event.data.object;
  }

  if (!session || !session.id) {
    throw new apiErrors(400, "Invalid Stripe Session Data");
  }

  // Update payment in DB
  const payment = await Payment.findOneAndUpdate(
    { transactionId: session.id },
    { paymentStatus: "paid", paymentDate: new Date() },
    { new: true }
  );

  if (!payment) {
    throw new apiErrors(404, "Payment record not found for this session");
  }

  res
    .status(200)
    .json(
      new apiResponse(200, { received: true }, "Webhook processed successfully")
    );
});

export { stripeWebhook };
