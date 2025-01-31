import { Router } from "express";
import {
  getInterestRules,
  addInterestRule,
} from "../controllers/interestRule.controller.js";

const router = Router();

router.route("/").get(getInterestRules);
router.route("/define-interest-rule").post(addInterestRule);

export default router;
