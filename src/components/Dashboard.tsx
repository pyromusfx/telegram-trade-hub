
import React from "react";
import { 
  ArrowUp, 
  ArrowDown, 
  Zap, 
  BarChart3, 
  AlertCircle 
} from "lucide-react";
import { generateMockTrades, generateMockSignals, OrderSide, SignalStatus } from "@/utils/types";

// Import the newly created components
import StatCard from "./dashboard/StatCard";
import BalanceChart from "./dashboard/BalanceChart";
import SignalsList from "./dashboard/SignalsList";
import TradesList from "./dashboard/TradesList";

const Dashboard: React.FC = () => {
  const trades = generateMockTrades();
  const signals = generateMockSignals();
  
  // Calculate summary statistics
  const activeTrades = trades.filter(t => t.status === "open").length;
  const activeSignals = signals.filter(s => s.status === SignalStatus.ACTIVE).length;
  
  // Calculate performance
  const pnl = trades
    .filter(t => t.pnl !== undefined)
    .reduce((sum, trade) => sum + (trade.pnl || 0), 0);
  
  // Data for chart
  const chartData = Array.from({ length: 14 }, (_, i) => ({
    date: new Date(Date.now() - (13 - i) * 24 * 60 * 60 * 1000).toLocaleDateString("tr-TR", { month: "short", day: "numeric" }),
    value: 10000 + Math.random() * 2000 * (i + 1) + (i * 200), // Bakiye büyümesi
    profit: (Math.random() - 0.3) * 800, // Günlük kar/zarar
  }));

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Kontrol Paneli</h1>
        <div className="text-sm text-muted-foreground">
          Son güncelleme: {new Date().toLocaleTimeString('tr-TR')}
        </div>
      </div>
      
      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
        <StatCard
          title="Aktif Sinyaller"
          value={activeSignals}
          label="İşleme alınacak sinyal"
          icon={<Zap size={16} className="text-signal-warning" />}
        />

        <StatCard
          title="Açık İşlemler"
          value={activeTrades}
          label="Devam eden işlemler"
          icon={<BarChart3 size={16} className="text-primary" />}
        />

        <StatCard
          title="Performans"
          value={`${pnl >= 0 ? '+' : ''}${pnl.toFixed(2)} USDT`}
          label="30 günlük K/Z"
          valueClassName={pnl >= 0 ? 'text-signal-success' : 'text-signal-danger'}
          icon={pnl >= 0 ? (
            <ArrowUp size={16} className="text-signal-success" />
          ) : (
            <ArrowDown size={16} className="text-signal-danger" />
          )}
        />

        <StatCard
          title="API Durumu"
          value={2}
          label="Aktif borsa"
          icon={
            <div className="flex items-center">
              <span className="relative flex h-2 w-2 mr-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-signal-success opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-signal-success"></span>
              </span>
              <span className="text-xs">Bağlı</span>
            </div>
          }
        />
      </div>

      {/* Bakiye Grafiği */}
      <BalanceChart data={chartData} />
      
      {/* Son Sinyaller ve İşlemler */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        <SignalsList signals={signals} />
        <TradesList trades={trades} />
      </div>
    </div>
  );
};

export default Dashboard;
