import React, { useState } from "react";

// UI components
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface QuitProps {
  handleMenuSelection: (action: string | null) => void;
}

const Quit: React.FC<QuitProps> = ({ handleMenuSelection }) => {
  const [input, setInput] = useState("");
  const [quitMessage, setQuitMessage] = useState<string | null>(null);

  const handleQuit = () => {
    setQuitMessage(
      input.trim().toLowerCase() === "q"
        ? "Thank you for banking with AwesomeGIC Bank. Have a nice day!"
        : null
    );
  };

  return (
    <Card className="p-6 max-w-lg mx-auto mt-10">
      <CardContent>
        <h1 className="text-xl font-bold mb-4">Quit</h1>

        {!quitMessage ? (
          <>
            <p className="mb-2">
              Enter <strong>q</strong> to quit:
            </p>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type 'q' to quit"
              className="mb-4"
              onKeyDown={(e) => e.key === "Enter" && handleQuit()}
            />
          </>
        ) : (
          <p className="text-green-600 font-semibold mt-4">{quitMessage}</p>
        )}

        <div className="mt-2 flex space-x-2 justify-center">
          {!quitMessage && (
            <Button onClick={handleQuit} className="mb-6">
              Submit
            </Button>
          )}
          <Button onClick={() => handleMenuSelection("")} className="mb-6">
            Main
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Quit;
