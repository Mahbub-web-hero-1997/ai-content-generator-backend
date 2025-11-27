import { Router } from "express";
import {
  createPayment,
  deletePayment,
  getAllPayments,
  getOwnPayments,
  getPaymentById,
  verifyPayment,
} from "../controllers/payment.controller.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = new Router();

router.route("/create-checkout-session").post(verifyToken, createPayment);
router.route("/verify").get(verifyToken, verifyPayment);
router.route("/all").get(verifyToken, getAllPayments);
router.route("/own-payments").get(verifyToken, getOwnPayments);
router.route("/single/:id").get(verifyToken, getPaymentById);
router.route("/delete/:id").delete(verifyToken, deletePayment);

export default router;
