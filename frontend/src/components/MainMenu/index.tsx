import React from "react";

// Third-party libraries
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MenuInputProps {
  variant?: "main" | "otherOptions";
  onSelect: (option: string) => void;
  hideTransactionInputOption?: boolean;
  hideInterestRulesOption?: boolean;
  hideAccountStatementsOption?: boolean;
}

export const MainMenuActions: React.FC<MenuInputProps> = ({
  onSelect,
  variant = "main",
  hideTransactionInputOption = false,
  hideInterestRulesOption = false,
  hideAccountStatementsOption = false,
}) => {
  const handleSelection = (action: string) => {
    onSelect(action);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    const keyMap: Record<string, string> = { t: "T", i: "I", p: "P", q: "Q" };
    if (keyMap[event.key.toLowerCase()])
      handleSelection(keyMap[event.key.toLowerCase()]);
  };

  return (
    <>
      {variant === "main" && (
        <Card
          className="max-w-md mx-auto"
          tabIndex={0}
          onKeyDown={handleKeyPress}
        >
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              Welcome to AwesomeGIC Bank!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg mb-6">What would you like to do?</p>
            <div className="flex flex-col space-y-4">
              <Button variant="default" onClick={() => handleSelection("T")}>
                [T] Input transactions
              </Button>
              <Button variant="default" onClick={() => handleSelection("I")}>
                [I] Define interest rules
              </Button>
              <Button variant="default" onClick={() => handleSelection("P")}>
                [P] Print statement
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleSelection("Q")}
              >
                [Q] Quit
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      {variant === "otherOptions" && (
        <>
          <p className="mt-6">Is there anything else you'd like to do?</p>
          <div className="mt-2 flex space-x-2 mx-auto ">
            {!hideTransactionInputOption && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSelection("T")}
              >
                Input Transactions
              </Button>
            )}
            {!hideInterestRulesOption && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSelection("I")}
              >
                Define Interest Rules
              </Button>
            )}
            {!hideAccountStatementsOption && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSelection("P")}
              >
                Print Statement
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSelection("Q")}
            >
              Quit
            </Button>
          </div>
        </>
      )}
    </>
  );
};

export default MainMenuActions;
