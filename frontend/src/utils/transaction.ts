import { Transaction } from "@/interfaces";

// Function to group transactions by account
export const groupTransactionsByAccount = (transactions: Transaction[]) => {
  return transactions.reduce((acc: { [key: string]: Transaction[] }, txn) => {
    if (!acc[txn.account]) {
      acc[txn.account] = [];
    }
    acc[txn.account].push(txn);
    return acc;
  }, {});
};
