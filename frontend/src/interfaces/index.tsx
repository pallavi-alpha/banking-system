interface Transaction {
  date: string;
  account: string;
  txnId: string;
  type: "D" | "W" | "I";
  amount: number;
  balance: number;
}

interface InterestRule {
  date: string;
  ruleId: string;
  rate: number;
}

interface Transactions {
  [account: string]: Transaction[];
}

interface AccountBalances {
  [account: string]: number;
}

export type { Transaction, InterestRule, Transactions, AccountBalances };
