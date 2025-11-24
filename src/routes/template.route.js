import { Router } from "express";
import {
  getTemplateBySlug,
  getAllTemplates,
  createTemplate,
  updateTemplate,
  deleteTemplate,
} from "../controllers/template.controller.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = new Router();

router.route("/all").get(getAllTemplates);
router.route("/:slug").get(getTemplateBySlug);
router.route("/create").post(verifyToken, createTemplate);
router.route("/update/:id").put(updateTemplate);
router.route("/delete/:id").delete(deleteTemplate);

export default router;
