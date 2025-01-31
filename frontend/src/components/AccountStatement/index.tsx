// React
import React, { useState } from "react";

// Third-party libraries
import moment from "moment";

// Absolute imports
import { Transaction, InterestRule } from "@/interfaces";
import { calculateInterest } from "@/utils/interestCalculation";
import { getYearMonthlyTransactionsByAccount } from "@/services/transactions";

// UI components
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableHeader,
} from "@/components/ui/table";

// Components
import MainMenuActions from "../MainMenu";

interface AccountStatementInputProps {
  interestRules: InterestRule[];
  handleMenuSelection: (action: string | null) => void;
}

const INPUT_FORMAT_EXAMPLE = "Enter Account and YYYYMM";
const ERROR_MESSAGES = {
  EMPTY_INPUT: "Input cannot be empty.",
  INVALID_FORMAT:
    "Please enter account and month in <Account> <Year><Month> format.",
  INVALID_DATE: "Invalid date format. Please use YYYYMM.",
  NO_TRANSACTIONS: (account: string, monthYear: string) =>
    `No transactions found for account ${account} in ${monthYear}.`,
};

const PrintStatement: React.FC<AccountStatementInputProps> = ({
  interestRules,
  handleMenuSelection,
}) => {
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [accountStatement, setAccountStatement] = useState<Transaction[]>([]);

  const retrieveMonthlyTransactions = async (
    account: string,
    monthYear: string
  ) => {
    try {
      const year = monthYear.substring(0, 4);
      const month = monthYear.substring(4, 6);
      const response = await getYearMonthlyTransactionsByAccount(
        account.toLowerCase(),
        year,
        month
      );

      if (!response || !response.data || response.data.length === 0) {
        setError(ERROR_MESSAGES.NO_TRANSACTIONS(account, monthYear));
        setAccountStatement([]);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error("Error retrieving monthly transactions:", error);
      setAccountStatement([]);
    }
  };

  const validateInput = (inputValue: string): [string, string] | null => {
    if (!inputValue.trim()) {
      setError(ERROR_MESSAGES.EMPTY_INPUT);
      return null;
    }

    const parts = inputValue.trim().split(" ");
    if (parts.length !== 2) {
      setError(ERROR_MESSAGES.INVALID_FORMAT);
      return null;
    }

    const [account, monthYear] = parts;
    if (!moment(monthYear, "YYYYMM", true).isValid()) {
      setError(ERROR_MESSAGES.INVALID_DATE);
      return null;
    }

    return [account, monthYear];
  };

  const createInterestTransaction = (
    monthlyTransactions: Transaction[],
    interestEarned: number,
    monthYear: string
  ): Transaction => {
    const lastTransaction = monthlyTransactions[monthlyTransactions.length - 1];
    const currentBalance = lastTransaction.balance + interestEarned;

    return {
      date: moment(monthYear, "YYYYMM").endOf("month").format("YYYYMMDD"),
      account: lastTransaction.account,
      txnId: "",
      type: "I",
      amount: interestEarned,
      balance: currentBalance,
    };
  };

  const handleGenerateStatement = async () => {
    setError(null);
    const validatedInput = validateInput(input);
    if (!validatedInput) return;

    const [account, monthYear] = validatedInput;
    const monthlyTransactions = await retrieveMonthlyTransactions(
      account,
      monthYear
    );

    if (!monthlyTransactions || monthlyTransactions.length === 0) {
      setAccountStatement([]);
      return;
    }

    const interestEarned = calculateInterest(
      monthlyTransactions,
      interestRules,
      monthYear
    );
    const interestTransaction = createInterestTransaction(
      monthlyTransactions,
      interestEarned,
      monthYear
    );

    setAccountStatement([...monthlyTransactions, interestTransaction]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (!input.trim()) return handleMenuSelection(null);

      handleGenerateStatement();
    }
  };

  return (
    <Card className="p-6 max-w-3xl mx-auto mt-10">
      <CardContent>
        <Header />
        <InputSection
          input={input}
          error={error}
          onInputChange={setInput}
          onKeyPress={handleKeyPress}
        />
        <ActionButtons
          onGenerate={handleGenerateStatement}
          onBack={() => handleMenuSelection("")}
        />
        <TransactionsTable transactions={accountStatement} />
        <MainMenuActions
          onSelect={handleMenuSelection}
          variant="otherOptions"
          hideAccountStatementsOption={true}
        />
      </CardContent>
    </Card>
  );
};

const Header = () => (
  <h1 className="text-xl font-bold mb-4 mt-4">Print Statement</h1>
);

const InputSection: React.FC<{
  input: string;
  error: string | null;
  onInputChange: (value: string) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}> = ({ input, error, onInputChange, onKeyPress }) => (
  <>
    <p className="mb-2 text-sm">
      {`Please enter account and month to generate the statement and press enter key (or leave blank to go back):`}
      <br />
      <span className="text-xs text-gray-400">(e.g. AC001 202306)</span>
    </p>
    <Input
      value={input}
      onChange={(e) => onInputChange(e.target.value)}
      placeholder={INPUT_FORMAT_EXAMPLE}
      className="mb-4"
      onKeyDown={onKeyPress}
    />
    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
  </>
);

const ActionButtons: React.FC<{
  onGenerate: () => void;
  onBack: () => void;
}> = ({ onGenerate, onBack }) => (
  <div className="mt-2 flex space-x-2 mx-auto justify-center">
    <Button onClick={onBack} className="mb-6">
      Main
    </Button>
  </div>
);

const TransactionsTable: React.FC<{ transactions: Transaction[] }> = ({
  transactions,
}) => (
  <>
    <h2 className="text-lg font-semibold mt-6">Transactions:</h2>
    <Table className="mt-4">
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Txn ID</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Balance</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5}>No transactions found.</TableCell>
          </TableRow>
        ) : (
          transactions.map((transaction, index) => (
            <TransactionRow key={index} transaction={transaction} />
          ))
        )}
      </TableBody>
    </Table>
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
    <TableCell>{transaction.balance.toFixed(2)}</TableCell>
  </TableRow>
);

export default PrintStatement;
