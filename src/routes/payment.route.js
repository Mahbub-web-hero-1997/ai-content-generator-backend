import { Router } from "express";
import {
  createPayment,
  deletePayment,
  getAllPayments,
  getPaymentById,
  verifyPayment,
} from "../controllers/payment.controller";
import verifyToken from "../middlewares/verifyToken";

const router = new Router();

router.route("/create-checkout-session").post(verifyToken, createPayment);
router.route("verify").get(verifyToken, verifyPayment);
router.route("/all").get(verifyToken, getAllPayments);
router.route("/single/:id").get(verifyToken, getPaymentById);
router.route("/delete").delete(verifyToken, deletePayment);

export default router;
