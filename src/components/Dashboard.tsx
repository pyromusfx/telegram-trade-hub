
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
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

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
    date: new Date(Date.now() - (13 - i) * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    value: 10000 + Math.random() * 2000 * (i + 1) + (i * 200) // Mock balance growth
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="dashboard-card">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-base font-medium flex items-center justify-between">
              Active Signals
              <Zap size={18} className="text-signal-warning" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="stat-value">{activeSignals}</div>
            <div className="stat-label">Signals to act on</div>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-base font-medium flex items-center justify-between">
              Open Trades
              <BarChart3 size={18} className="text-primary" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="stat-value">{activeTrades}</div>
            <div className="stat-label">Trades in progress</div>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-base font-medium flex items-center justify-between">
              Performance
              {pnl >= 0 ? (
                <ArrowUp size={18} className="text-signal-success" />
              ) : (
                <ArrowDown size={18} className="text-signal-danger" />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className={`stat-value ${pnl >= 0 ? 'text-signal-success' : 'text-signal-danger'}`}>
              {pnl >= 0 ? '+' : ''}{pnl.toFixed(2)} USDT
            </div>
            <div className="stat-label">30-day P&L</div>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-base font-medium flex items-center justify-between">
              API Status
              {true ? (
                <div className="flex items-center">
                  <span className="relative flex h-3 w-3 mr-1">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-signal-success opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-signal-success"></span>
                  </span>
                  <span className="text-xs">Connected</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <AlertCircle size={18} className="text-signal-danger" />
                  <span className="text-xs ml-1">Disconnected</span>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="stat-value">2</div>
            <div className="stat-label">Active exchanges</div>
          </CardContent>
        </Card>
      </div>

      {/* Balance Chart */}
      <Card className="dashboard-card">
        <CardHeader className="p-4 pb-0">
          <CardTitle>Balance Evolution</CardTitle>
          <CardDescription>Your portfolio growth over time</CardDescription>
        </CardHeader>
        <CardContent className="p-0 pt-2">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="date" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  width={80}
                  tickFormatter={(value) => `$${value.toLocaleString()}`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    borderColor: 'hsl(var(--border))',
                    borderRadius: 'var(--radius)',
                    color: 'hsl(var(--card-foreground))'
                  }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Balance']}
                  labelStyle={{ color: 'hsl(var(--card-foreground))' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Recent Signals & Trades */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="dashboard-card">
          <CardHeader className="p-4 pb-2">
            <CardTitle>Recent Signals</CardTitle>
            <CardDescription>Latest trading signals from the channel</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-3">
              {signals.slice(0, 4).map((signal) => (
                <div key={signal.id} className="flex justify-between items-center p-2 rounded-md hover:bg-secondary/50 transition-colors border border-border/50">
                  <div>
                    <div className="flex items-center">
                      <span className="font-medium">{signal.symbol}</span>
                      <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                        signal.side === OrderSide.BUY 
                          ? 'bg-signal-success/20 text-signal-success' 
                          : 'bg-signal-danger/20 text-signal-danger'
                      }`}>
                        {signal.side}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Entry: {signal.entryPrice.toFixed(2)} USDT
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`status-badge ${
                      signal.status === SignalStatus.ACTIVE ? 'success' : 
                      signal.status === SignalStatus.FILLED ? 'warning' : 'danger'
                    }`}>
                      {signal.status}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {signal.timestamp.toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 text-center">
              <a href="/signals" className="text-xs text-primary hover:underline">View all signals →</a>
            </div>
          </CardContent>
        </Card>
        
        <Card className="dashboard-card">
          <CardHeader className="p-4 pb-2">
            <CardTitle>Recent Trades</CardTitle>
            <CardDescription>Latest trades executed on your behalf</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-3">
              {trades.slice(0, 4).map((trade) => (
                <div key={trade.id} className="flex justify-between items-center p-2 rounded-md hover:bg-secondary/50 transition-colors border border-border/50">
                  <div>
                    <div className="flex items-center">
                      <span className="font-medium">{trade.symbol}</span>
                      <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                        trade.side === OrderSide.BUY 
                          ? 'bg-signal-success/20 text-signal-success' 
                          : 'bg-signal-danger/20 text-signal-danger'
                      }`}>
                        {trade.side}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {trade.exchange} • {trade.quantity} units
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      {trade.price.toFixed(2)} USDT
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {trade.timestamp.toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 text-center">
              <a href="/trades" className="text-xs text-primary hover:underline">View all trades →</a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
