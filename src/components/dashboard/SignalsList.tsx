
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Signal, OrderSide, SignalStatus } from "@/utils/types";

interface SignalsListProps {
  signals: Signal[];
  limit?: number;
}

const SignalsList: React.FC<SignalsListProps> = ({ signals, limit = 4 }) => {
  return (
    <Card className="dashboard-card">
      <CardHeader className="p-2 pb-0">
        <CardTitle className="text-sm">Son Sinyaller</CardTitle>
        <CardDescription className="text-xs">Kanaldan gelen son işlem sinyalleri</CardDescription>
      </CardHeader>
      <CardContent className="p-2">
        <div className="space-y-1">
          {signals.slice(0, limit).map((signal) => (
            <div key={signal.id} className="flex justify-between items-center p-1 rounded-md hover:bg-secondary/50 transition-colors border border-border/50">
              <div>
                <div className="flex items-center">
                  <span className="font-medium text-xs">{signal.symbol}</span>
                  <span className={`ml-1 text-[10px] px-1 py-0.5 rounded-full ${
                    signal.side === OrderSide.BUY 
                      ? 'bg-signal-success/20 text-signal-success' 
                      : 'bg-signal-danger/20 text-signal-danger'
                  }`}>
                    {signal.side === OrderSide.BUY ? 'ALIŞ' : 'SATIŞ'}
                  </span>
                </div>
                <div className="text-[10px] text-muted-foreground">
                  Giriş: {signal.entryPrice.toFixed(2)} USDT
                </div>
              </div>
              <div className="text-right">
                <div className={`status-badge ${
                  signal.status === SignalStatus.ACTIVE ? 'success' : 
                  signal.status === SignalStatus.FILLED ? 'warning' : 'danger'
                }`}>
                  {signal.status === SignalStatus.ACTIVE ? 'AKTİF' : 
                   signal.status === SignalStatus.FILLED ? 'DOLU' : 'İPTAL'}
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {signal.timestamp.toLocaleString('tr-TR')}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-2 text-center">
          <a href="/signals" className="text-[10px] text-primary hover:underline">Tüm sinyalleri görüntüle →</a>
        </div>
      </CardContent>
    </Card>
  );
};

export default SignalsList;
