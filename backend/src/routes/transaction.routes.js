import { Router } from "express";
import {
  addTransaction,
  getTransactionsByYearMonth,
  getAllTransactions,
} from "../controllers/transaction.controller.js";

const router = Router();

router.route("/addTransaction").post(addTransaction);
router.route("/").get(getAllTransactions);
router.route("/getMonthlyTransactions").get(getTransactionsByYearMonth);

export default router;
