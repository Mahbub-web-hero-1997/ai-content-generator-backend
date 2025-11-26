import stripe from "../config/stripe.config";
import { Payment } from "../models/payment.model";
import apiErrors from "../utils/apiErrors";
import apiResponse from "../utils/apiResponse";
import asyncHandler from "../utils/asyncHandler";

const createPayment = asyncHandler(async (req, res) => {
  const { user, subscriptionPlan, amount, currency, notes } = req.body;
  if (!user || !subscriptionPlan || !amount) {
    throw new apiErrors(
      400,
      "Required fields missing: user, subscriptionPlan, amount"
    );
  }
  const stripeAmount = Math.round(amount * 100);
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: currency || "USD",
          product_data: {
            name: "Subscription Plan Purchase",
          },
          unit_amount: stripeAmount,
        },
        quantity: 1,
      },
    ],
    node: "payment",
    success_url: `${process.env.FRONT_END_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONT_END_URL}/payment-cancel`,
  });
  //   Save Payment on DB

  const payment = await Payment.create({
    user,
    subscriptionPlan,
    amount,
    currency: currency || "USD",
    paymentMethod: paymentMethod || "stripe",
    paymentStatus: paymentStatus || "pending",
    transactionId: session.id,
    notes: notes || "",
  });
  res.status(200).json(
    new apiResponse(
      200,
      {
        sessionId: session.id,
        url: session.url,
        paymentId: payment._id,
      },
      "Stripe checkout session created successfully"
    )
  );
});

// Verify Payment after checkout

const verifyPayment = asyncHandler(async (req, res) => {
  const { session_id } = req.query;
  if (!session_id) {
    throw new apiErrors(400, "Session_id is required");
  }

  const session = await stripe.checkout.sessions.retrieve(session_id);

  if (session.payment_status !== "paid") {
    throw new apiErrors(400, "Payment not completed");
  }

  const updatePayment = await Payment.findOneAndUpdate(
    { transactionId: session_id },
    { paymentStatus: "completed", paymentDate: new Date() },
    { new: true }
  );

  if (!updatePayment) {
    throw new apiErrors(404, "Payment record not found");
  }

  res
    .status(200)
    .json(
      new apiResponse(
        200,
        { payment: updatePayment },
        "Payment verified successfully"
      )
    );
});

// Get all payments

const getAllPayments = asyncHandler(async (req, res) => {
  const payments = await Payment.find()
    .populate("user", "name email")
    .populate("subscriptionPlan", "name price credits");
  if (!payments) {
    throw new apiErrors("Payment not found");
  }
  res
    .status(200)
    .json(new apiResponse(200, { payments }, "Payment fetched successfully"));
});
