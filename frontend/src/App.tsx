// React
import React, { useState, useEffect } from "react";

// Third-party libraries
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";

// Absolute imports
import { Transaction, Transactions, InterestRule } from "@/interfaces";
import { getInterestRules } from "./services/interestRules";
import { getAllTransactions, addTransaction } from "./services/transactions";

// Relative imports (components and utils)
import MainMenu from "./components/MainMenu";
import TransactionInput from "./components/TransactionInput";
import InterestRules from "./components/InterestRules";
import PrintStatement from "./components/AccountStatement";
import Quit from "./components/Quit";
import { groupTransactionsByAccount } from "./utils/transaction";

export const App: React.FC = () => {
  const [menuOption, setMenuOption] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transactions>({});
  const [interestRules, setInterestRules] = useState<InterestRule[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchInterestRules();
  }, []);

  useEffect(() => {
    fetchAllTransactions();
  }, []);

  const fetchInterestRules = async () => {
    try {
      const response = await getInterestRules();
      setInterestRules(response?.data || []);
    } catch (error) {
      console.error("Error fetching interest rules:", error);
      setInterestRules([]);
    }
  };

  const fetchAllTransactions = async () => {
    try {
      const response = await getAllTransactions();
      const transactions: Transaction[] = response.data || [];

      if (!transactions || !transactions.length) {
        setTransactions({});
        return;
      }

      // Group transactions by account
      const groupedTransactionsByAccount =
        groupTransactionsByAccount(transactions);
      setTransactions(groupedTransactionsByAccount);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setTransactions({});
    }
  };

  const performNewTransaction = async (
    date: string,
    account: string,
    type: string,
    amount: number
  ) => {
    try {
      const response = await addTransaction(date, account, type, amount);

      if (!response.success) {
        toast({
          title: "Error",
          description: response.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: `Transaction added successfully!`,
      });

      fetchAllTransactions();
    } catch (error) {
      console.error("Error adding new transaction:", error);
      toast({
        title: "Error",
        description: "Failed to add transaction.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {!menuOption && <MainMenu onSelect={setMenuOption} />}
      {menuOption === "T" && (
        <TransactionInput
          transactions={transactions}
          handleMenuSelection={setMenuOption}
          performNewTransaction={performNewTransaction}
        />
      )}
      {menuOption === "I" && (
        <InterestRules
          interestRules={interestRules}
          setInterestRules={setInterestRules}
          handleMenuSelection={setMenuOption}
        />
      )}
      {menuOption === "P" && (
        <PrintStatement
          interestRules={interestRules}
          handleMenuSelection={setMenuOption}
        />
      )}
      {menuOption === "Q" && <Quit handleMenuSelection={setMenuOption} />}
      <Toaster />
    </div>
  );
};

export default App;
