import { Transaction, InterestRule } from "@/interfaces";

export function calculateInterest(
  transactions: Transaction[],
  interestRules: InterestRule[],
  monthYear: string
) {
  // Helper function to format Date object to 'YYYYMMDD'
  const formatDate = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}${m}${d}`;
  };

  // Filter out interest transactions and sort by date
  const filteredTxns = transactions.filter((t) => t.type !== "I");
  filteredTxns.sort((a, b) => a.date.localeCompare(b.date));

  // Create a map of date to EOD balance
  const balanceMap: { [key: string]: number } = {};
  let lastBalance = 0;
  for (const txn of filteredTxns) {
    const date = txn.date;
    balanceMap[date] = txn.balance;
    lastBalance = balanceMap[date];
  }

  // Determine the month's start and end dates
  const year = parseInt(monthYear.slice(0, 4));
  const month = parseInt(monthYear.slice(4, 6)) - 1; // JS months are 0-based
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);

  // Generate EOD balances for each day of the month
  const eodBalances = [];
  let currentBalance = 0;
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateStr = formatDate(d);
    if (balanceMap.hasOwnProperty(dateStr)) {
      currentBalance = balanceMap[dateStr];
    }
    eodBalances.push({ date: dateStr, balance: currentBalance });
  }

  // Sort interest rules in descending order of their dates
  const sortedRules = [...interestRules].sort((a, b) =>
    b.date.localeCompare(a.date)
  );

  // Generate periods by checking each day's rate and balance
  const periods = [];
  let currentPeriod = null;

  for (const day of eodBalances) {
    const dateStr = day.date;
    const balance = day.balance;

    // Find applicable interest rate
    const applicableRule = sortedRules.find((rule) => rule.date <= dateStr);
    const rate: number = applicableRule ? applicableRule["rate"] : 0;
    const ruleId = applicableRule ? applicableRule.ruleId : "";

    if (
      currentPeriod &&
      currentPeriod.rate === rate &&
      currentPeriod.balance === balance
    ) {
      currentPeriod.endDate = dateStr;
      currentPeriod.numDays += 1;
    } else {
      if (currentPeriod) {
        periods.push(currentPeriod);
      }
      currentPeriod = {
        startDate: dateStr,
        endDate: dateStr,
        numDays: 1,
        balance: balance,
        rate: rate,
        ruleId: ruleId,
      };
    }
  }

  if (currentPeriod) {
    periods.push(currentPeriod);
  }

  // Calculate total interest
  let totalInterest = 0;
  for (const period of periods) {
    const interest = period.balance * (period.rate / 100) * period.numDays;
    totalInterest += interest;
  }

  // Annualize and round
  totalInterest = totalInterest / 365;
  const roundedInterest = Math.round(totalInterest * 100) / 100;

  return roundedInterest;
}
