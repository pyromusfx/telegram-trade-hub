
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { OrderSide, Trade, Exchange, generateMockTrades } from "@/utils/types";
import { ArrowDown, ArrowUp, Search, MoreVertical, Calendar, Download, BarChart2 } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip as RechartsTooltip } from "recharts";

const COLORS = ["hsl(var(--primary))", "hsl(var(--signal-success))", "hsl(var(--signal-warning))", "hsl(var(--signal-danger))"];

const TradeHistory: React.FC = () => {
  const [trades, setTrades] = useState<Trade[]>(generateMockTrades());
  const [searchTerm, setSearchTerm] = useState("");
  const [exchangeFilter, setExchangeFilter] = useState<string>("all");
  const [timeRange, setTimeRange] = useState<string>("7d");

  const filteredTrades = trades.filter((trade) => {
    const matchesSearch = trade.symbol.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesExchange = exchangeFilter === "all" || trade.exchange === exchangeFilter;
    return matchesSearch && matchesExchange;
  });

  // Calculate distribution for the pie chart
  const calculateExchangeDistribution = () => {
    const distribution = {} as Record<string, number>;
    
    filteredTrades.forEach(trade => {
      if (distribution[trade.exchange]) {
        distribution[trade.exchange]++;
      } else {
        distribution[trade.exchange] = 1;
      }
    });
    
    return Object.entries(distribution).map(([name, value]) => ({ name, value }));
  };

  const exchangeData = calculateExchangeDistribution();

  // Calculate trade metrics
  const totalTrades = filteredTrades.length;
  const profitableTrades = filteredTrades.filter(t => t.pnl !== undefined && t.pnl > 0).length;
  const totalPnL = filteredTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);
  const winRate = totalTrades > 0 ? (profitableTrades / totalTrades) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Trade History</h2>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Time Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1d">Last 24h</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="all">All time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="dashboard-card">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-base font-medium">Total Trades</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="stat-value">{totalTrades}</div>
            <div className="stat-label">All exchanges</div>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-base font-medium">Win Rate</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="stat-value">{winRate.toFixed(1)}%</div>
            <div className="stat-label">Profitable trades</div>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-base font-medium">Total P&L</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className={`stat-value ${totalPnL >= 0 ? 'text-signal-success' : 'text-signal-danger'}`}>
              {totalPnL >= 0 ? '+' : ''}{totalPnL.toFixed(2)} USDT
            </div>
            <div className="stat-label">Realized profit/loss</div>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-base font-medium">Average Trade</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className={`stat-value ${(totalPnL / totalTrades) >= 0 ? 'text-signal-success' : 'text-signal-danger'}`}>
              {totalTrades > 0 ? ((totalPnL / totalTrades) >= 0 ? '+' : '') + (totalPnL / totalTrades).toFixed(2) : '0.00'} USDT
            </div>
            <div className="stat-label">Per trade</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="dashboard-card">
          <CardHeader className="p-4 pb-2">
            <CardTitle>Trade Distribution</CardTitle>
            <CardDescription>Trades by exchange</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={exchangeData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="hsl(var(--primary))"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {exchangeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend verticalAlign="bottom" height={36} />
                  <RechartsTooltip 
                    formatter={(value, name) => [`${value} trades`, name]}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      borderColor: 'hsl(var(--border))',
                      color: 'hsl(var(--card-foreground))'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader className="p-4 pb-2">
            <CardTitle>Recent Performance</CardTitle>
            <CardDescription>Latest trade outcomes</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-3">
              {filteredTrades.slice(0, 5).map((trade) => (
                <div key={trade.id} className="flex justify-between p-2 rounded-md border border-border/50 hover:bg-secondary/50 transition-colors">
                  <div className="flex items-center">
                    <div className={`w-1.5 h-10 mr-3 rounded-full ${
                      trade.pnl !== undefined ? (trade.pnl >= 0 ? 'bg-signal-success' : 'bg-signal-danger') : 'bg-muted'
                    }`} />
                    <div>
                      <div className="font-medium">{trade.symbol}</div>
                      <div className="text-xs text-muted-foreground">{trade.exchange}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-medium ${
                      trade.pnl !== undefined ? (trade.pnl >= 0 ? 'text-signal-success' : 'text-signal-danger') : ''
                    }`}>
                      {trade.pnl !== undefined ? (trade.pnl >= 0 ? '+' : '') + trade.pnl.toFixed(2) : '-'} USDT
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {trade.timestamp.toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search trades..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Select value={exchangeFilter} onValueChange={setExchangeFilter}>
            <SelectTrigger className="w-full sm:w-36">
              <SelectValue placeholder="Filter by exchange" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Exchanges</SelectItem>
              <SelectItem value={Exchange.BINANCE}>Binance</SelectItem>
              <SelectItem value={Exchange.BYBIT}>Bybit</SelectItem>
              <SelectItem value={Exchange.BINGX}>BingX</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Trade History Table */}
      <Card>
        <CardHeader className="pb-0">
          <CardTitle>All Trades</CardTitle>
          <CardDescription>Complete history of your trades</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Side</TableHead>
                  <TableHead>Exchange</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>PnL</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTrades.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No trades found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTrades.map((trade) => (
                    <TableRow key={trade.id}>
                      <TableCell className="font-medium">{trade.symbol}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {trade.side === OrderSide.BUY ? (
                            <ArrowUp className="mr-1 h-4 w-4 text-signal-success" />
                          ) : (
                            <ArrowDown className="mr-1 h-4 w-4 text-signal-danger" />
                          )}
                          {trade.side}
                        </div>
                      </TableCell>
                      <TableCell>{trade.exchange}</TableCell>
                      <TableCell>{trade.price.toFixed(2)}</TableCell>
                      <TableCell>{trade.quantity.toFixed(3)}</TableCell>
                      <TableCell>
                        <span
                          className={
                            trade.pnl !== undefined
                              ? trade.pnl >= 0
                                ? "text-signal-success"
                                : "text-signal-danger"
                              : ""
                          }
                        >
                          {trade.pnl !== undefined
                            ? `${trade.pnl >= 0 ? "+" : ""}${trade.pnl.toFixed(2)}`
                            : "-"}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        <div className="flex items-center">
                          <Calendar className="mr-1.5 h-3.5 w-3.5" />
                          {trade.timestamp.toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <BarChart2 className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" />
                              Export
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TradeHistory;
