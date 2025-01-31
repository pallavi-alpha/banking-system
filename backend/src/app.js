import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//routes import
import transactionRouter from "./routes/transaction.routes.js";
import interestRuleRouter from "./routes/interestRule.routes.js";

//routes declaration
app.use("/api/v1/transactions", transactionRouter);
app.use("/api/v1/interest-rules", interestRuleRouter);

export { app };
