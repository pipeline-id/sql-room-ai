import { Button, Input, Label } from "@sqlrooms/ui";
import { KeyRound } from "lucide-react";
import { useState } from "react";

interface TokenInputProps {
  onSubmit: (token: string) => void;
}

export const TokenInput = ({ onSubmit }: TokenInputProps) => {
  const [token, setToken] = useState(() => {
    // Try to get token from localStorage
    return localStorage.getItem("md-token") || "";
  });
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) {
      setError("Please enter a valid MotherDuck token");
      return;
    }
    // Save token to localStorage for convenience
    localStorage.setItem("md-token", token.trim());
    onSubmit(token.trim());
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6 rounded-lg border bg-card p-8 shadow-lg">
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="rounded-full bg-primary/10 p-3">
            <KeyRound className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">MotherDuck Token</h1>
          <p className="text-sm text-muted-foreground">
            Enter your MotherDuck access token to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="token">Access Token</Label>
            <Input
              id="token"
              type="password"
              placeholder="Enter your MotherDuck token..."
              value={token}
              onChange={(e) => {
                setToken(e.target.value);
                setError("");
              }}
              className="w-full"
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>

          <Button type="submit" className="w-full">
            Continue
          </Button>
        </form>

        <p className="text-center text-xs text-muted-foreground">
          Get your token from{" "}
          <a
            href="https://app.motherduck.com/settings/tokens"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline hover:no-underline"
          >
            MotherDuck Settings
          </a>
        </p>
      </div>
    </div>
  );
};
