import { Button, Input, Label } from "@sqlrooms/ui";
import { KeyRound } from "lucide-react";
import { useState } from "react";

export interface TokenConfig {
  mdToken: string;
  openaiApiKey: string;
  anthropicApiKey: string;
  groqApiKey: string;
}

interface TokenInputProps {
  onSubmit: (config: TokenConfig) => void;
}

export const TokenInput = ({ onSubmit }: TokenInputProps) => {
  const [mdToken, setMdToken] = useState(() => {
    return localStorage.getItem("md-token") || "";
  });
  const [openaiApiKey, setOpenaiApiKey] = useState(() => {
    return localStorage.getItem("openai-api-key") || "";
  });
  const [anthropicApiKey, setAnthropicApiKey] = useState(() => {
    return localStorage.getItem("anthropic-api-key") || "";
  });
  const [groqApiKey, setGroqApiKey] = useState(() => {
    return localStorage.getItem("groq-api-key") || "";
  });
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mdToken.trim()) {
      setError("Please enter a valid MotherDuck token");
      return;
    }
    if (!openaiApiKey.trim() && !anthropicApiKey.trim() && !groqApiKey.trim()) {
      setError("Please enter at least one LLM API key");
      return;
    }
    // Save tokens to localStorage for convenience
    localStorage.setItem("md-token", mdToken.trim());
    localStorage.setItem("openai-api-key", openaiApiKey.trim());
    localStorage.setItem("anthropic-api-key", anthropicApiKey.trim());
    localStorage.setItem("groq-api-key", groqApiKey.trim());
    onSubmit({
      mdToken: mdToken.trim(),
      openaiApiKey: openaiApiKey.trim(),
      anthropicApiKey: anthropicApiKey.trim(),
      groqApiKey: groqApiKey.trim(),
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6 rounded-lg border bg-card p-8 shadow-lg">
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="rounded-full bg-primary/10 p-3">
            <KeyRound className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Configuration</h1>
          <p className="text-sm text-muted-foreground">
            Enter your tokens and API keys to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mdToken">MotherDuck Token *</Label>
            <Input
              id="mdToken"
              type="password"
              placeholder="Enter your MotherDuck token..."
              value={mdToken}
              onChange={(e) => {
                setMdToken(e.target.value);
                setError("");
              }}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
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

          <div className="border-t pt-4">
            <p className="text-sm font-medium mb-3">LLM API Keys (at least one required)</p>

            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="openaiApiKey">OpenAI API Key</Label>
                <Input
                  id="openaiApiKey"
                  type="password"
                  placeholder="sk-..."
                  value={openaiApiKey}
                  onChange={(e) => {
                    setOpenaiApiKey(e.target.value);
                    setError("");
                  }}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="anthropicApiKey">Anthropic API Key</Label>
                <Input
                  id="anthropicApiKey"
                  type="password"
                  placeholder="sk-ant-..."
                  value={anthropicApiKey}
                  onChange={(e) => {
                    setAnthropicApiKey(e.target.value);
                    setError("");
                  }}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="groqApiKey">Groq API Key</Label>
                <Input
                  id="groqApiKey"
                  type="password"
                  placeholder="gsk_..."
                  value={groqApiKey}
                  onChange={(e) => {
                    setGroqApiKey(e.target.value);
                    setError("");
                  }}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" className="w-full">
            Continue
          </Button>
        </form>
      </div>
    </div>
  );
};
