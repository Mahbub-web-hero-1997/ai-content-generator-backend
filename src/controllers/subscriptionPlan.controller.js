import { SubscriptionPlan } from "../models/subscriptionPlan.model.js";
import apiErrors from "../utils/apiErrors.js";
import apiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
// Create Subscription
const createSubscriptionPlan = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    price,
    credits,
    features,
    durationInDays,
    isActive,
  } = req.body;
  if (
    (!name,
    !description,
    !price,
    !credits,
    !features,
    !durationInDays,
    !isActive)
  ) {
    throw new apiErrors(400, "All fields are required");
  }
  const exists = await SubscriptionPlan.findOne({ name });
  if (exists) {
    throw new apiErrors(400, "A subscription plan is active");
  }
  const newPlan = await SubscriptionPlan.create({
    name,
    description,
    price,
    credits,
    features,
    durationInDays,
    isActive,
  });
  res
    .status(201)
    .json(new apiResponse(201, { data: newPlan }, "Subscription Successful"));
});

// Get all  subscription plans
const getAllSubscriptionPlans = asyncHandler(async (req, res) => {
  const plan = (await SubscriptionPlan.find()).toSorted({ createdAt: -1 });
  if (!plan) {
    throw new apiErrors(404, "No subscriptions Plan found");
  }
  res
    .status(200)
    .json(
      new apiResponse(
        200,
        { data: plan },
        "Fetch Subscription Plan successfully"
      )
    );
});

// Get single subscription plan

const getSingleSubscriptionPlan = asyncHandler(async (req, res) => {
  const plan = await SubscriptionPlan.findById(req.params.id);
  if (!plan) {
    throw new apiErrors(404, "Subscription plan not found");
  }
  res
    .status(200)
    .json(
      new apiResponse(
        200,
        { data: plan },
        "Fetch subscription plan successfully"
      )
    );
});

// Update Subscription plan

const updateSubscriptionPlan = asyncHandler(async (req, res) => {
  const updatedPlan = await SubscriptionPlan.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  if (!updatedPlan) {
    throw new apiErrors(404, "Subscription plan not found");
  }
  res
    .status(200)
    .json(
      new apiResponse(
        200,
        { data: updatedPlan },
        "Subscription Plan update successfully"
      )
    );
});
// Delete subscription plan

const deleteSubscriptionPlan = asyncHandler(async (req, res) => {
  const deletedPlan = await SubscriptionPlan.findByIdAndDelete(req.params.id);
  if (!deletedPlan) {
    throw new apiErrors(404, "Subscription plan not found");
  }
  res
    .status(200)
    .json(
      new apiResponse(
        200,
        { data: deletedPlan },
        "Subscription Plan delete successful"
      )
    );
});
