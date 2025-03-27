
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Trade, OrderSide } from "@/utils/types";

interface TradesListProps {
  trades: Trade[];
  limit?: number;
}

const TradesList: React.FC<TradesListProps> = ({ trades, limit = 4 }) => {
  return (
    <Card className="dashboard-card">
      <CardHeader className="p-2 pb-0">
        <CardTitle className="text-sm">Son İşlemler</CardTitle>
        <CardDescription className="text-xs">Sizin adınıza gerçekleştirilen son işlemler</CardDescription>
      </CardHeader>
      <CardContent className="p-2">
        <div className="space-y-1">
          {trades.slice(0, limit).map((trade) => (
            <div key={trade.id} className="flex justify-between items-center p-1 rounded-md hover:bg-secondary/50 transition-colors border border-border/50">
              <div>
                <div className="flex items-center">
                  <span className="font-medium text-xs">{trade.symbol}</span>
                  <span className={`ml-1 text-[10px] px-1 py-0.5 rounded-full ${
                    trade.side === OrderSide.BUY 
                      ? 'bg-signal-success/20 text-signal-success' 
                      : 'bg-signal-danger/20 text-signal-danger'
                  }`}>
                    {trade.side === OrderSide.BUY ? 'ALIŞ' : 'SATIŞ'}
                  </span>
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {trade.exchange} • {trade.quantity} birim
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium text-xs">
                  {trade.price.toFixed(2)} USDT
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {trade.timestamp.toLocaleString('tr-TR')}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-2 text-center">
          <a href="/trades" className="text-[10px] text-primary hover:underline">Tüm işlemleri görüntüle →</a>
        </div>
      </CardContent>
    </Card>
  );
};

export default TradesList;
