import axios from "axios";
import { apiUrl } from "../../config";

export const getInterestRules = async () => {
  try {
    const response = await axios.get(`${apiUrl}/interest-rules`);
    return response.data || [];
  } catch (error) {
    console.error("Error fetching interest rules:", error);
  }
};

export const defineNewInterestRule = async (
  date: string,
  ruleId: string,
  rate: number
) => {
  try {
    const response = await axios.post(
      `${apiUrl}/interest-rules/define-interest-rule`,
      {
        date,
        ruleId,
        rate,
      }
    );

    if (!response || !response.data) {
      return null;
    }

    return response.data;
  } catch (error) {
    console.error("Error adding interest rule:", error);
  }
};
