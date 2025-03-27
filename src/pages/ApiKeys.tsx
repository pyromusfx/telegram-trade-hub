
import React from "react";
import ApiKeyManager from "@/components/ApiKeyManager";

const ApiKeysPage = () => {
  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <h1 className="text-xl md:text-2xl font-bold mb-4">API Keys</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Manage your exchange API keys for automated trading
      </p>
      <ApiKeyManager />
    </div>
  );
};

export default ApiKeysPage;
