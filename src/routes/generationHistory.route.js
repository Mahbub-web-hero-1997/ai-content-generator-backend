import { Router } from "express";
import {
  createGenerationHistory,
  deleteGenerationHistory,
  getAllGenerationHistory,
  getSingleGenerationHistory,
  updateGenerationHistory,
} from "../controllers/generationHistory.controller";
import verifyToken from "../middlewares/verifyToken";

const router = new Router();

router.route("/all").get(verifyToken, getAllGenerationHistory);
router.route("/create").post(verifyToken, createGenerationHistory);
router.route("/single/:id").get(verifyToken, getSingleGenerationHistory);
router.route("/update/:id").put(verifyToken, updateGenerationHistory);
router.route("/delete/:id").delete(verifyToken, deleteGenerationHistory);

export default router;
