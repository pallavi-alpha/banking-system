import axios, { AxiosError } from "axios";
import { apiUrl } from "../../config";

export const addTransaction = async (
  date: string,
  account: string,
  type: string,
  amount: number
) => {
  try {
    const response = await axios.post(`${apiUrl}/transactions/addTransaction`, {
      date,
      account,
      type,
      amount,
    });

    return response.data;
  } catch (error: AxiosError) {
    console.error("Error performing transaction:");

    // Return a structured error response to the UI
    return {
      success: false,
      message: error.response?.data?.message || "Failed to perform transaction",
    };
  }
};

export const getAllTransactions = async () => {
  try {
    const response = await axios.get(`${apiUrl}/transactions`);

    return response.data || [];
  } catch (error) {
    console.error("Error retrieving transactions:", error);
  }
};

export const getYearMonthlyTransactionsByAccount = async (
  account: string,
  year: string,
  month: string
) => {
  try {
    const response = await axios.get(
      `${apiUrl}/transactions/getMonthlyTransactions?account=${account}&year=${year}&month=${month}`
    );

    return response.data || [];
  } catch (error) {
    console.error("Error retrieving monthly transactions:", error);
  }
};
