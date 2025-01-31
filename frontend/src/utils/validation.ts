import moment from "moment";

export const validateDate = (date: string): boolean =>
  moment(date, "YYYYMMDD", true).isValid();

export const validateAmount = (amount: number): boolean =>
  amount > 0 && amount.toFixed(2) === amount.toString();

export const validateInterestRate = (rate: number): boolean =>
  rate > 0 && rate < 100;
