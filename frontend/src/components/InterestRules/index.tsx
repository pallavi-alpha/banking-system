// React
import React, { useState } from "react";

// Absolute imports
import { InterestRule } from "@/interfaces";
import { useToast } from "@/hooks/use-toast";
import { validateDate, validateInterestRate } from "@/utils/validation";
import { defineNewInterestRule } from "../../services/interestRules";

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

// Components
import MainMenuActions from "../MainMenu";

interface InterestRulesProps {
  interestRules: InterestRule[];
  setInterestRules: React.Dispatch<React.SetStateAction<InterestRule[]>>;
  handleMenuSelection: (action: string | null) => void;
}

const INPUT_FORMAT_EXAMPLE =
  "Enter interest rule details (YYYYMMDD RuleId Rate%)";
const INPUT_EXAMPLE = "e.g. 20230501 Rule01 2.5";
const ERROR_MESSAGES = {
  EMPTY_INPUT: "Please input Date, Rule ID, and Rate.",
  INVALID_RATE: "Rate should be between 0 and 100.",
  INVALID_DATE: "Invalid date format. Use YYYYMMDD.",
};

const InterestRules: React.FC<InterestRulesProps> = ({
  interestRules,
  setInterestRules,
  handleMenuSelection,
}) => {
  const [ruleDetails, setRuleDetails] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleAddRule = () => {
    if (!ruleDetails.trim()) return handleMenuSelection(null);

    const [date, ruleId, rateStr] = ruleDetails.trim().split(" ");
    const rate = parseFloat(rateStr);

    if (!date || !ruleId || isNaN(rate)) {
      setError(ERROR_MESSAGES.EMPTY_INPUT);
      return;
    }

    if (!validateDate(date)) {
      setError(ERROR_MESSAGES.INVALID_DATE);
      return;
    }

    if (!validateInterestRate(rate)) {
      setError(ERROR_MESSAGES.INVALID_RATE);
      return;
    }

    addInterestRule(date, ruleId, rate);
  };

  const addInterestRule = async (
    date: string,
    ruleId: string,
    rate: number
  ) => {
    try {
      const response = await defineNewInterestRule(date, ruleId, rate);

      if (!response || !response.data) {
        throw error;
      }

      setInterestRules(response.data);
      setRuleDetails("");
      setError(null);

      toast({
        title: "Success",
        description: `Interest rule ${ruleId} added successfully!`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add interest rule.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="max-w-lg mx-auto">
      <CardContent>
        <h1 className="text-xl font-bold mb-4 mt-4">Define Interest Rules</h1>
        <p className="mb-2 text-sm">
          Please enter interest rules and press enter key (or leave blank to go
          back):
          <br />
          <span className="text-xs text-gray-400">({INPUT_EXAMPLE})</span>
        </p>

        <Input
          className="mb-4"
          placeholder={INPUT_FORMAT_EXAMPLE}
          value={ruleDetails}
          onChange={(e) => setRuleDetails(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddRule()}
        />
        {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

        <div className="mt-2 flex space-x-2 mx-auto justify-center">
          <Button className="mb-6" onClick={() => handleMenuSelection("")}>
            Main
          </Button>
        </div>

        {interestRules.length > 0 && (
          <>
            <h2 className="text-lg font-semibold mt-6">Interest Rules:</h2>
            <Table className="mt-4">
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Rule ID</TableHead>
                  <TableHead>Rate (%)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {interestRules.map(({ date, ruleId, rate }, index) => (
                  <TableRow key={index}>
                    <TableCell>{date}</TableCell>
                    <TableCell>{ruleId.toUpperCase()}</TableCell>
                    <TableCell>{rate.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        )}

        <MainMenuActions
          onSelect={handleMenuSelection}
          variant="otherOptions"
          hideInterestRulesOption={true}
        />
      </CardContent>
    </Card>
  );
};

export default InterestRules;
