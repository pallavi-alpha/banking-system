import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Transaction } from "../models/transaction.models.js";
import moment from "moment";
export const addTransaction = asyncHandler(async (req, res) => {
  try {
    const { date, account, type, amount } = req.body;
    const transactionType = type.toUpperCase();
    const lowerCaseAccount = account.toLowerCase();

    // Validate input format (YYYYMMDD)
    const dateRegex = /^\d{8}$/;
    if (!dateRegex.test(date)) {
      throw new ApiError(400, "Invalid date format. Use YYYYMMDD");
    }

    // Parse transaction date
    const parseDate = (dateString) => {
      const year = dateString.substring(0, 4);
      const month = dateString.substring(4, 6);
      const day = dateString.substring(6, 8);
      return new Date(`${year}-${month}-${day}`);
    };

    const transactionDate = parseDate(date);
    const currentDate = new Date();

    // Date validations
    if (transactionDate > currentDate) {
      throw new ApiError(400, "Transaction date cannot be in the future");
    }

    // Transaction type validation
    if (!["D", "W"].includes(transactionType)) {
      throw new ApiError(400, "Invalid transaction type. Use D or W");
    }

    // Fetch transactions sorted by date
    const transactions = await Transaction.find({ account: lowerCaseAccount })
      .sort({ date: 1 })
      .lean();

    // First transaction validation
    if (transactions.length === 0 && transactionType === "W") {
      throw new ApiError(400, "First transaction cannot be a withdrawal");
    }

    // Date comparison with first transaction
    if (transactions.length > 0) {
      const firstTransactionDate = transactions[0].date;
      if (transactionDate <= parseDate(firstTransactionDate)) {
        throw new ApiError(
          400,
          "Transaction date must be after the account's first transaction"
        );
      }
    }

    // Calculate current balance
    const currentBalance = transactions.reduce((acc, txn) => {
      return txn.type === "D" ? acc + txn.amount : acc - txn.amount;
    }, 0);

    // Balance validation for withdrawal
    if (transactionType === "W" && currentBalance < amount) {
      throw new ApiError(400, "Insufficient funds for withdrawal");
    }

    // Calculate new balance
    const newBalance =
      transactionType === "D"
        ? currentBalance + amount
        : currentBalance - amount;

    // Generate transaction ID
    const sameDateCount = transactions.filter(
      (txn) => txn.date === date
    ).length;
    const txnId = `${date}-${String(sameDateCount + 1).padStart(2, "0")}`;

    // Create and save transaction
    const newTransaction = await Transaction.create({
      date,
      account: lowerCaseAccount,
      type: transactionType,
      amount,
      txnId,
      balance: newBalance,
    });

    res
      .status(201)
      .json(
        new ApiResponse(200, newTransaction, "Transaction created successfully")
      );
  } catch (error) {
    // Handle known errors and pass through ApiError instances
    if (error instanceof ApiError) {
      res
        .status(error.statusCode)
        .json(new ApiResponse(error.statusCode, null, error.message));
    } else {
      // Handle unexpected errors
      console.error("Transaction error:", error);
      res.status(500).json(new ApiResponse(500, null, "Internal server error"));
    }
  }
});

export const getAllTransactions = asyncHandler(async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ date: 1 }); // Sort by date;
    return res
      .status(200)
      .json(
        new ApiResponse(200, transactions, "Transactions fetched successfully")
      );
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

export const getTransactionsByYearMonth = asyncHandler(async (req, res) => {
  try {
    const { account, year, month } = req.query;

    // Validate inputs
    if (!account || !year || !month) {
      throw new ApiError(400, "Account, year, and month are required");
    }

    // Fetch transactions for the account and the given month/year
    const firstDayOfMonth = moment(`${year}${month}`, "YYYYMM")
      .startOf("month")
      .format("YYYYMMDD");
    const lastDayOfMonth = moment(`${year}${month}`, "YYYYMM")
      .endOf("month")
      .format("YYYYMMDD");

    const lowerCaseAccount = account.toLowerCase();
    const transactions = await Transaction.find({
      account: lowerCaseAccount,
      date: { $gte: firstDayOfMonth, $lte: lastDayOfMonth },
    }).sort({ date: 1 }); // Sort by date

    return res
      .status(200)
      .json(
        new ApiResponse(200, transactions, "Transactions fetched successfully")
      );
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});
