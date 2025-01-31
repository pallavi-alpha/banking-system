// React
import React, { useState, useCallback } from "react";

// Absolute imports
import { Transaction, Transactions } from "@/interfaces";
import { validateDate } from "@/utils/validation";

// UI components
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Specific components
import MainMenuActions from "../MainMenu";

interface TransactionInputProps {
  transactions: Transactions;
  handleMenuSelection: (action: string | null) => void;
  performNewTransaction: (
    date: string,
    account: string,
    type: string,
    amount: number
  ) => void;
}

type TransactionType = "D" | "W";

const ERROR_MESSAGES = {
  EMPTY_INPUT: "Invalid input. Format: YYYYMMDD ACCOUNT TYPE AMOUNT",
  INVALID_DATE: "Invalid date format. Use YYYYMMDD.",
  INVALID_TYPE: "Type must be D (Deposit) or W (Withdraw).",
  INVALID_AMOUNT: "Amount must be a positive number.",
  FIRST_WITHDRAWAL: "First transaction cannot be a withdrawal.",
};

const INPUT_EXAMPLE = "20230626 AC001 W 100.00";

const TransactionInput: React.FC<TransactionInputProps> = ({
  transactions,
  handleMenuSelection,
  performNewTransaction,
}) => {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  // Parse input into structured transaction data
  const parseTransactionInput = useCallback((input: string) => {
    const [date, account, type, amountStr] = input.trim().split(" ");
    return {
      date: date || "",
      account: account?.toLowerCase() || "",
      type: type?.toUpperCase() as TransactionType,
      amount: parseFloat(amountStr || "0"),
    };
  }, []);

  // Validate transaction input
  const validateTransaction = useCallback(
    ({
      date,
      account,
      type,
      amount,
    }: ReturnType<typeof parseTransactionInput>) => {
      if (!date || !account || !type || isNaN(amount) || amount <= 0) {
        return ERROR_MESSAGES.EMPTY_INPUT;
      }
      if (!validateDate(date)) return ERROR_MESSAGES.INVALID_DATE;
      if (!["D", "W"].includes(type)) return ERROR_MESSAGES.INVALID_TYPE;
      if (!transactions[account] && type === "W")
        return ERROR_MESSAGES.FIRST_WITHDRAWAL;
      return null;
    },
    [transactions]
  );

  const handleSubmit = useCallback(() => {
    if (!input.trim()) return handleMenuSelection("");

    const parsed = parseTransactionInput(input);
    const validationError = validateTransaction(parsed);

    if (validationError) {
      setError(validationError);
      return;
    }

    performNewTransaction(
      parsed.date,
      parsed.account,
      parsed.type,
      parsed.amount
    );
    setInput("");
    setError("");
  }, [
    input,
    parseTransactionInput,
    validateTransaction,
    performNewTransaction,
    handleMenuSelection,
  ]);

  return (
    <Card className="max-w-lg mx-auto">
      <CardContent>
        <h1 className="text-xl font-bold mb-4 mt-4">Input Transactions</h1>
        <TransactionForm
          value={input}
          error={error}
          onChange={setInput}
          onSubmit={handleSubmit}
        />
        <BackButton onClick={() => handleMenuSelection("")} />
        <TransactionTables transactions={transactions} />
        <MainMenuActions
          onSelect={handleMenuSelection}
          variant="otherOptions"
          hideTransactionInputOption={true}
        />
      </CardContent>
    </Card>
  );
};

const TransactionForm: React.FC<{
  value: string;
  error: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}> = ({ value, error, onChange, onSubmit }) => (
  <>
    <p className="mb-2 text-sm">
      Enter transaction details and press Enter (or leave blank to go back):
      <br />
      <span className="text-xs text-gray-400">(e.g., {INPUT_EXAMPLE})</span>
    </p>
    <Input
      className="mb-4"
      placeholder="Enter transaction details (YYYYMMDD ACCOUNT TYPE AMOUNT)"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && onSubmit()}
    />
    {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
  </>
);

const BackButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <div className="mt-2 flex space-x-2 mx-auto justify-center">
    <Button className="mb-6" onClick={onClick}>
      Main
    </Button>
  </div>
);

const TransactionTables: React.FC<{ transactions: Transactions }> = ({
  transactions,
}) => (
  <>
    {Object.entries(transactions).map(([account, transactionList]) => (
      <div key={account}>
        <h2 className="text-md font-semibold mt-6">
          Transactions for {account.toUpperCase()}:
        </h2>
        <Table className="mt-4">
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactionList.map((transaction, index) => (
              <TransactionRow key={index} transaction={transaction} />
            ))}
          </TableBody>
        </Table>
      </div>
    ))}
  </>
);

const TransactionRow: React.FC<{ transaction: Transaction }> = ({
  transaction,
}) => (
  <TableRow>
    <TableCell>{transaction.date}</TableCell>
    <TableCell>{transaction.txnId}</TableCell>
    <TableCell>{transaction.type}</TableCell>
    <TableCell>{transaction.amount.toFixed(2)}</TableCell>
  </TableRow>
);

export default TransactionInput;
