
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

  // Pasta grafiği için dağılımı hesaplama
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

  // İşlem metriklerini hesapla
  const totalTrades = filteredTrades.length;
  const profitableTrades = filteredTrades.filter(t => t.pnl !== undefined && t.pnl > 0).length;
  const totalPnL = filteredTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);
  const winRate = totalTrades > 0 ? (profitableTrades / totalTrades) * 100 : 0;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">İşlem Geçmişi</h2>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Zaman Aralığı" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1d">Son 24 saat</SelectItem>
            <SelectItem value="7d">Son 7 gün</SelectItem>
            <SelectItem value="30d">Son 30 gün</SelectItem>
            <SelectItem value="all">Tüm zamanlar</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* İstatistikler */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        <Card className="dashboard-card">
          <CardHeader className="p-2 pb-1">
            <CardTitle className="text-sm font-medium">Toplam İşlem</CardTitle>
          </CardHeader>
          <CardContent className="p-2 pt-0">
            <div className="stat-value">{totalTrades}</div>
            <div className="stat-label">Tüm borsalar</div>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader className="p-2 pb-1">
            <CardTitle className="text-sm font-medium">Kazanma Oranı</CardTitle>
          </CardHeader>
          <CardContent className="p-2 pt-0">
            <div className="stat-value">{winRate.toFixed(1)}%</div>
            <div className="stat-label">Karlı işlemler</div>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader className="p-2 pb-1">
            <CardTitle className="text-sm font-medium">Toplam K/Z</CardTitle>
          </CardHeader>
          <CardContent className="p-2 pt-0">
            <div className={`stat-value ${totalPnL >= 0 ? 'text-signal-success' : 'text-signal-danger'}`}>
              {totalPnL >= 0 ? '+' : ''}{totalPnL.toFixed(2)} USDT
            </div>
            <div className="stat-label">Gerçekleşen kar/zarar</div>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader className="p-2 pb-1">
            <CardTitle className="text-sm font-medium">Ortalama İşlem</CardTitle>
          </CardHeader>
          <CardContent className="p-2 pt-0">
            <div className={`stat-value ${(totalPnL / totalTrades) >= 0 ? 'text-signal-success' : 'text-signal-danger'}`}>
              {totalTrades > 0 ? ((totalPnL / totalTrades) >= 0 ? '+' : '') + (totalPnL / totalTrades).toFixed(2) : '0.00'} USDT
            </div>
            <div className="stat-label">İşlem başına</div>
          </CardContent>
        </Card>
      </div>

      {/* Grafikler */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <Card className="dashboard-card">
          <CardHeader className="p-2 pb-0">
            <CardTitle className="text-sm">İşlem Dağılımı</CardTitle>
            <CardDescription className="text-xs">Borsalara göre işlemler</CardDescription>
          </CardHeader>
          <CardContent className="p-2">
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
                    formatter={(value, name) => [`${value} işlem`, name]}
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
          <CardHeader className="p-2 pb-0">
            <CardTitle className="text-sm">Son Performans</CardTitle>
            <CardDescription className="text-xs">Son işlem sonuçları</CardDescription>
          </CardHeader>
          <CardContent className="p-2">
            <div className="space-y-1">
              {filteredTrades.slice(0, 5).map((trade) => (
                <div key={trade.id} className="flex justify-between p-1 rounded-md border border-border/50 hover:bg-secondary/50 transition-colors">
                  <div className="flex items-center">
                    <div className={`w-1 h-8 mr-2 rounded-full ${
                      trade.pnl !== undefined ? (trade.pnl >= 0 ? 'bg-signal-success' : 'bg-signal-danger') : 'bg-muted'
                    }`} />
                    <div>
                      <div className="font-medium text-xs">{trade.symbol}</div>
                      <div className="text-[10px] text-muted-foreground">{trade.exchange}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-medium text-xs ${
                      trade.pnl !== undefined ? (trade.pnl >= 0 ? 'text-signal-success' : 'text-signal-danger') : ''
                    }`}>
                      {trade.pnl !== undefined ? (trade.pnl >= 0 ? '+' : '') + trade.pnl.toFixed(2) : '-'} USDT
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      {trade.timestamp.toLocaleString('tr-TR')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtreler ve Arama */}
      <div className="flex flex-col sm:flex-row gap-2 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2 top-2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="İşlem ara..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-1 w-full sm:w-auto">
          <Select value={exchangeFilter} onValueChange={setExchangeFilter}>
            <SelectTrigger className="w-full sm:w-36">
              <SelectValue placeholder="Borsaya göre filtrele" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Borsalar</SelectItem>
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

      {/* İşlem Geçmişi Tablosu */}
      <Card>
        <CardHeader className="p-2 pb-0">
          <CardTitle className="text-sm">Tüm İşlemler</CardTitle>
          <CardDescription className="text-xs">İşlemlerinizin tam geçmişi</CardDescription>
        </CardHeader>
        <CardContent className="p-1">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Sembol</TableHead>
                  <TableHead className="text-xs">Yön</TableHead>
                  <TableHead className="text-xs">Borsa</TableHead>
                  <TableHead className="text-xs">Fiyat</TableHead>
                  <TableHead className="text-xs">Miktar</TableHead>
                  <TableHead className="text-xs">K/Z</TableHead>
                  <TableHead className="text-xs">Tarih</TableHead>
                  <TableHead className="text-xs text-right">İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTrades.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-20 text-center text-sm">
                      İşlem bulunamadı.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTrades.map((trade) => (
                    <TableRow key={trade.id}>
                      <TableCell className="font-medium text-xs">{trade.symbol}</TableCell>
                      <TableCell className="text-xs">
                        <div className="flex items-center">
                          {trade.side === OrderSide.BUY ? (
                            <ArrowUp className="mr-1 h-3 w-3 text-signal-success" />
                          ) : (
                            <ArrowDown className="mr-1 h-3 w-3 text-signal-danger" />
                          )}
                          {trade.side === OrderSide.BUY ? 'ALIŞ' : 'SATIŞ'}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs">{trade.exchange}</TableCell>
                      <TableCell className="text-xs">{trade.price.toFixed(2)}</TableCell>
                      <TableCell className="text-xs">{trade.quantity.toFixed(3)}</TableCell>
                      <TableCell className="text-xs">
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
                      <TableCell className="text-xs text-muted-foreground">
                        <div className="flex items-center">
                          <Calendar className="mr-1 h-3 w-3" />
                          {trade.timestamp.toLocaleDateString('tr-TR')}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <MoreVertical className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel className="text-xs">İşlemler</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-xs">
                              <BarChart2 className="mr-2 h-3 w-3" />
                              Detayları Görüntüle
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-xs">
                              <Download className="mr-2 h-3 w-3" />
                              Dışa Aktar
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
