
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { OrderSide, Signal, SignalStatus, generateMockSignals } from "@/utils/types";
import { ArrowDown, ArrowUp, Search, Clock, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SignalsComponent: React.FC = () => {
  const [signals, setSignals] = useState<Signal[]>(generateMockSignals());
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [timeRange, setTimeRange] = useState<string>("7d");
  
  const { toast } = useToast();

  const filteredSignals = signals.filter((signal) => {
    const matchesSearch = signal.symbol.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || signal.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleTradeSignal = (signal: Signal) => {
    toast({
      title: "Trade Executed",
      description: `${signal.side} order for ${signal.symbol} has been placed.`,
    });
    
    // Update signal status to filled
    const updatedSignals = signals.map((s) =>
      s.id === signal.id ? { ...s, status: SignalStatus.FILLED } : s
    );
    setSignals(updatedSignals);
  };

  const handleIgnoreSignal = (signal: Signal) => {
    toast({
      title: "Signal Ignored",
      description: `${signal.symbol} signal has been ignored.`,
    });
    
    // Update signal status to canceled
    const updatedSignals = signals.map((s) =>
      s.id === signal.id ? { ...s, status: SignalStatus.CANCELED } : s
    );
    setSignals(updatedSignals);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Trading Signals</h2>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
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
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search signals..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-36">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value={SignalStatus.ACTIVE}>Active</SelectItem>
              <SelectItem value={SignalStatus.FILLED}>Filled</SelectItem>
              <SelectItem value={SignalStatus.CANCELED}>Canceled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active Signals Card */}
      <Card className="border border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Active Signals</CardTitle>
          <CardDescription>Signals that require action</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredSignals.filter(s => s.status === SignalStatus.ACTIVE).length === 0 ? (
            <div className="py-6 text-center text-muted-foreground">
              <Clock className="mx-auto h-8 w-8 mb-2 opacity-50" />
              <p>No active signals at the moment</p>
              <p className="text-sm mt-1">New signals will appear here when posted in the channel</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSignals
                .filter(signal => signal.status === SignalStatus.ACTIVE)
                .map((signal) => (
                  <div 
                    key={signal.id} 
                    className="p-3 border rounded-lg bg-secondary/20 flex flex-col sm:flex-row justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{signal.symbol}</span>
                        <Badge 
                          variant={signal.side === OrderSide.BUY ? "default" : "destructive"}
                          className={signal.side === OrderSide.BUY ? "bg-signal-success" : "bg-signal-danger"}
                        >
                          {signal.side}
                        </Badge>
                      </div>
                      <div className="text-sm space-y-1">
                        <div className="flex items-center gap-4">
                          <span className="text-muted-foreground">Entry:</span>
                          <span className="font-medium">{signal.entryPrice.toFixed(2)} USDT</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-muted-foreground">Stop Loss:</span>
                          <span className="font-medium">{signal.stopLoss?.toFixed(2) || '-'} USDT</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-muted-foreground">Take Profit:</span>
                          <span className="font-medium">{signal.takeProfit?.toFixed(2) || '-'} USDT</span>
                        </div>
                      </div>
                      {signal.notes && (
                        <p className="text-xs text-muted-foreground mt-2 italic">
                          {signal.notes}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-row sm:flex-col gap-2 justify-end items-end">
                      <div className="text-xs text-muted-foreground flex items-center mb-auto">
                        <Calendar size={12} className="mr-1" />
                        {signal.timestamp.toLocaleString()}
                      </div>
                      <div className="flex gap-2 mt-auto">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleIgnoreSignal(signal)}
                        >
                          Ignore
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => handleTradeSignal(signal)}
                        >
                          Trade Now
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Signal History Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Signal History</CardTitle>
          <CardDescription>All signals from the channel</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Side</TableHead>
                  <TableHead>Entry Price</TableHead>
                  <TableHead>Stop Loss</TableHead>
                  <TableHead>Take Profit</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSignals.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No signals found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSignals.map((signal) => (
                    <TableRow key={signal.id}>
                      <TableCell className="font-medium">{signal.symbol}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {signal.side === OrderSide.BUY ? (
                            <ArrowUp className="mr-1 h-4 w-4 text-signal-success" />
                          ) : (
                            <ArrowDown className="mr-1 h-4 w-4 text-signal-danger" />
                          )}
                          {signal.side}
                        </div>
                      </TableCell>
                      <TableCell>{signal.entryPrice.toFixed(2)}</TableCell>
                      <TableCell>{signal.stopLoss?.toFixed(2) || "-"}</TableCell>
                      <TableCell>{signal.takeProfit?.toFixed(2) || "-"}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            signal.status === SignalStatus.ACTIVE
                              ? "border-signal-success text-signal-success"
                              : signal.status === SignalStatus.FILLED
                              ? "border-signal-warning text-signal-warning"
                              : "border-signal-danger text-signal-danger"
                          }
                        >
                          {signal.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {signal.timestamp.toLocaleDateString()}
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

export default SignalsComponent;
