
import React from "react";
import ApiKeyManager from "@/components/ApiKeyManager";

const ApiKeysPage = () => {
  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <h1 className="text-lg md:text-xl font-bold mb-2">API Anahtarları</h1>
      <p className="text-xs text-muted-foreground mb-4">
        Otomatik işlem için borsa API anahtarlarınızı yönetin
      </p>
      <ApiKeyManager />
    </div>
  );
};

export default ApiKeysPage;
