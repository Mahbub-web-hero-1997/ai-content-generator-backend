import { Router } from "express";
import {
  createSubscriptionPlan,
  deleteSubscriptionPlan,
  getAllSubscriptionPlans,
  getSingleSubscriptionPlan,
  updateSubscriptionPlan,
} from "../controllers/subscriptionPlan.controller.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = new Router();
router.route("/create").post(verifyToken, createSubscriptionPlan);
router.route("/all").get(verifyToken, getAllSubscriptionPlans);
router.route("/single/:id").get(verifyToken, getSingleSubscriptionPlan);
router.route("/update/:id").put(verifyToken, updateSubscriptionPlan);
router.route("/delete/:id").delete(verifyToken, deleteSubscriptionPlan);
