import stripe from "../config/stripe.config.js";
import { Payment } from "../models/payment.model.js";
import apiErrors from "../utils/apiErrors.js";
import apiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const createPayment = asyncHandler(async (req, res, next) => {
  const { subscriptionPlan, amount, currency, notes } = req.body;
  const user = req.user._id;
  if (!subscriptionPlan || !amount) {
    throw new apiErrors(400, "Subscription plan and amount required");
  }
  const stripeAmount = Math.round(amount * 100);
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: currency || "USD",
          unit_amount: stripeAmount,
          product_data: { name: "Subscription Plan Purchase" },
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.FRONT_END_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONT_END_URL}/payment-cancel`,
    metadata: {
      userId: user.tostring(),
      subscriptionPlan,
      amount,
      notes: notes || "",
    },
  });
  // Save Pending Payment

  const payment = await Payment.create({
    user,
    subscriptionPlan,
    amount,
    currency: currency || "USD",
    paymentMethod: "stripe",
    paymentStatus: "pending",
    transactionId: session.id,
    notes: notes || "",
  });
  res.status(200).json(
    new apiResponse(200, {
      sessionId: session.id,
      url: session.url,
      paymentId: payment._id,
    })
  );
});

const verifyPayment = asyncHandler(async (req, res) => {
  const { session_id } = req.query;
  if (!session_id) {
    throw new apiErrors(400, "Session_id is required");
  }
  const session = await stripe.checkout.sessions.retrieve(session_id);
  console.log("Check Payment status", session.payment_status);
  if (session.payment_status !== "paid") {
    throw new apiErrors(400, "Payment not completed");
  }
  const updatePayment = await Payment.findOneAndUpdate(
    { transactionId: session_id },
    { paymentStatus: "paid", paymentDate: new Date() },
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

// Get all payments (Only Admin)
const getAllPayments = asyncHandler(async (req, res) => {
  if (req.user.role !== "admin") {
    throw new apiErrors(403, "Forbidden Access");
  }
  const payments = await Payment.find()
    .populate("user", "name email -_id")
    .populate("subscriptionPlan", "name price credits");
  if (!payments) {
    throw new apiErrors(404, "Payment not found");
  }
  res
    .status(200)
    .json(new apiResponse(200, { payments }, "Payment fetched successfully"));
});

// Get Own payments (user)

const getOwnPayments = asyncHandler(async (req, res) => {
  const payments = await Payment.find({ user: req.user._id });
  if (!payments || payments.length === 0) {
    throw new apiErrors(404, "No payments found");
  }
  res
    .status(200)
    .json(
      new apiResponse(200, { data: payments }, "Payments fetched successfully")
    );
});

// Get Single Payment
const getPaymentById = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.id)
    .populate("user", "name email -_id")
    .populate("subscriptionPlan", "name price credits");
  if (!payment) {
    throw new apiErrors("Payment not found");
  }
  res
    .status(200)
    .json(new apiResponse(200, { payment }, "Payment fetched successfully"));
});

// Delete Payment (Only Admin)

const deletePayment = asyncHandler(async (req, res) => {
  const payment = await Payment.findByIdAndDelete(req.params.id);
  if (!payment) {
    throw new apiErrors(404, "Payment not found");
  }
  res
    .status(200)
    .json(new apiResponse(200, {}, "Payment Deleted successfully"));
});

export {
  createPayment,
  verifyPayment,
  getAllPayments,
  getOwnPayments,
  getPaymentById,
  deletePayment,
};
