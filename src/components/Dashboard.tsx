
import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  ArrowUp, 
  ArrowDown, 
  Zap, 
  BarChart3, 
  AlertCircle 
} from "lucide-react";
import { generateMockTrades, generateMockSignals, OrderSide, SignalStatus } from "@/utils/types";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid } from "recharts";

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
        <Card className="dashboard-card">
          <CardHeader className="p-2 pb-1">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              Aktif Sinyaller
              <Zap size={16} className="text-signal-warning" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2 pt-0">
            <div className="stat-value">{activeSignals}</div>
            <div className="stat-label">İşleme alınacak sinyal</div>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader className="p-2 pb-1">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              Açık İşlemler
              <BarChart3 size={16} className="text-primary" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2 pt-0">
            <div className="stat-value">{activeTrades}</div>
            <div className="stat-label">Devam eden işlemler</div>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader className="p-2 pb-1">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              Performans
              {pnl >= 0 ? (
                <ArrowUp size={16} className="text-signal-success" />
              ) : (
                <ArrowDown size={16} className="text-signal-danger" />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2 pt-0">
            <div className={`stat-value ${pnl >= 0 ? 'text-signal-success' : 'text-signal-danger'}`}>
              {pnl >= 0 ? '+' : ''}{pnl.toFixed(2)} USDT
            </div>
            <div className="stat-label">30 günlük K/Z</div>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader className="p-2 pb-1">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              API Durumu
              {true ? (
                <div className="flex items-center">
                  <span className="relative flex h-2 w-2 mr-1">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-signal-success opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-signal-success"></span>
                  </span>
                  <span className="text-xs">Bağlı</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <AlertCircle size={16} className="text-signal-danger" />
                  <span className="text-xs ml-1">Bağlantı Yok</span>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2 pt-0">
            <div className="stat-value">2</div>
            <div className="stat-label">Aktif borsa</div>
          </CardContent>
        </Card>
      </div>

      {/* Bakiye Grafiği */}
      <Card className="dashboard-card">
        <CardHeader className="p-2 pb-0">
          <CardTitle className="text-sm">Bakiye Gelişimi</CardTitle>
          <CardDescription className="text-xs">Portföyünüzün zaman içindeki değişimi</CardDescription>
        </CardHeader>
        <CardContent className="p-1 pt-1">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 15, right: 10, left: 10, bottom: 5 }}
                barGap={0}
                barCategoryGap={5}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                  tickMargin={8}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                  width={50}
                  tickFormatter={(value) => `${(value/1000).toFixed(0)}k`}
                  tickMargin={8}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    borderColor: 'hsl(var(--border))',
                    borderRadius: 'var(--radius)',
                    color: 'hsl(var(--card-foreground))',
                    fontSize: '12px',
                    padding: '8px'
                  }}
                  formatter={(value: number, name: string) => {
                    if (name === 'value') return [`${value.toLocaleString()} USDT`, 'Toplam Bakiye'];
                    if (name === 'profit') return [`${value >= 0 ? '+' : ''}${value.toLocaleString()} USDT`, 'Günlük K/Z'];
                    return [value, name];
                  }}
                  labelStyle={{ color: 'hsl(var(--card-foreground))', fontSize: '10px' }}
                />
                <Bar 
                  dataKey="value" 
                  name="Bakiye"
                  fill="hsl(var(--primary))" 
                  radius={[4, 4, 0, 0]}
                  maxBarSize={18}
                />
                <Bar 
                  dataKey="profit" 
                  name="Kar/Zarar"
                  fill={(data) => data.profit >= 0 ? "hsl(var(--signal-success))" : "hsl(var(--signal-danger))"}
                  radius={[4, 4, 0, 0]}
                  maxBarSize={6}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Son Sinyaller ve İşlemler */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        <Card className="dashboard-card">
          <CardHeader className="p-2 pb-0">
            <CardTitle className="text-sm">Son Sinyaller</CardTitle>
            <CardDescription className="text-xs">Kanaldan gelen son işlem sinyalleri</CardDescription>
          </CardHeader>
          <CardContent className="p-2">
            <div className="space-y-1">
              {signals.slice(0, 4).map((signal) => (
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
        
        <Card className="dashboard-card">
          <CardHeader className="p-2 pb-0">
            <CardTitle className="text-sm">Son İşlemler</CardTitle>
            <CardDescription className="text-xs">Sizin adınıza gerçekleştirilen son işlemler</CardDescription>
          </CardHeader>
          <CardContent className="p-2">
            <div className="space-y-1">
              {trades.slice(0, 4).map((trade) => (
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
      </div>
    </div>
  );
};

export default Dashboard;
