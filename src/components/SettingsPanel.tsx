
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ApiSettings, Exchange, generateMockApiSettings } from "@/utils/types";
import { Save, Undo, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const SettingsPanel: React.FC = () => {
  const [settings, setSettings] = useState<ApiSettings>(generateMockApiSettings());
  const [selectedExchange, setSelectedExchange] = useState<Exchange>(Exchange.BINANCE);
  
  const { toast } = useToast();

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your trading settings have been updated.",
    });
  };

  const handleResetSettings = () => {
    setSettings(generateMockApiSettings());
    toast({
      title: "Settings Reset",
      description: "Your trading settings have been reset to defaults.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Trading Settings</h2>
        <Select
          value={selectedExchange}
          onValueChange={(value) => setSelectedExchange(value as Exchange)}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Select Exchange" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={Exchange.BINANCE}>Binance</SelectItem>
            <SelectItem value={Exchange.BYBIT}>Bybit</SelectItem>
            <SelectItem value={Exchange.BINGX}>BingX</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Trade Execution Settings</CardTitle>
          <CardDescription>
            Configure how trades are executed on your behalf
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Leverage */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="leverage" className="flex items-center">
                Leverage
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info size={14} className="ml-1.5 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Leverage multiplies your buying power. Higher leverage means higher risk.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <span className="font-medium text-sm">{settings.leverage}x</span>
            </div>
            <Slider
              id="leverage"
              min={1}
              max={20}
              step={1}
              value={[settings.leverage]}
              onValueChange={([value]) => setSettings({ ...settings, leverage: value })}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1x (Safe)</span>
              <span>20x (Risky)</span>
            </div>
          </div>

          {/* Order Size */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="orderSize" className="flex items-center">
                Order Size (% of Balance)
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info size={14} className="ml-1.5 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Percentage of your available balance to use for each trade.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <span className="font-medium text-sm">{settings.orderSize}%</span>
            </div>
            <Slider
              id="orderSize"
              min={1}
              max={100}
              step={1}
              value={[settings.orderSize]}
              onValueChange={([value]) => setSettings({ ...settings, orderSize: value })}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1% (Small)</span>
              <span>100% (All-in)</span>
            </div>
          </div>

          {/* Stop Loss */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="stopLoss" className="flex items-center">
                Stop Loss (%)
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info size={14} className="ml-1.5 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Automatically exits trade when loss reaches this percentage.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <span className="font-medium text-sm">{settings.stopLoss}%</span>
            </div>
            <Slider
              id="stopLoss"
              min={1}
              max={20}
              step={0.5}
              value={[settings.stopLoss]}
              onValueChange={([value]) => setSettings({ ...settings, stopLoss: value })}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1% (Tight)</span>
              <span>20% (Wide)</span>
            </div>
          </div>

          {/* Take Profit */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="takeProfit" className="flex items-center">
                Take Profit (%)
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info size={14} className="ml-1.5 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Automatically exits trade when profit reaches this percentage.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <span className="font-medium text-sm">{settings.takeProfit}%</span>
            </div>
            <Slider
              id="takeProfit"
              min={1}
              max={100}
              step={1}
              value={[settings.takeProfit]}
              onValueChange={([value]) => setSettings({ ...settings, takeProfit: value })}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1% (Conservative)</span>
              <span>100% (Ambitious)</span>
            </div>
          </div>

          {/* Trailing Stop */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="useTrailingStop" className="flex items-center">
                Enable Trailing Stop
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info size={14} className="ml-1.5 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Trailing stops follow price movement to protect profits while letting trades run.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <Switch
                id="useTrailingStop"
                checked={settings.useTrailingStop}
                onCheckedChange={(checked) => 
                  setSettings({ ...settings, useTrailingStop: checked })
                }
              />
            </div>

            {settings.useTrailingStop && (
              <div className="space-y-2 pl-4 border-l-2 border-primary/20">
                <div className="flex items-center justify-between">
                  <Label htmlFor="trailingStopDistance" className="flex items-center">
                    Trailing Distance (%)
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info size={14} className="ml-1.5 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            How far the price can retrace before triggering the trailing stop.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <span className="font-medium text-sm">{settings.trailingStopDistance}%</span>
                </div>
                <Slider
                  id="trailingStopDistance"
                  min={0.5}
                  max={10}
                  step={0.5}
                  value={[settings.trailingStopDistance]}
                  onValueChange={([value]) => 
                    setSettings({ ...settings, trailingStopDistance: value })
                  }
                  disabled={!settings.useTrailingStop}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0.5% (Tight)</span>
                  <span>10% (Loose)</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleResetSettings}>
            <Undo size={16} className="mr-2" />
            Reset to Default
          </Button>
          <Button onClick={handleSaveSettings}>
            <Save size={16} className="mr-2" />
            Save Settings
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
          <CardDescription>Configure how you receive alerts and notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="notifySignals">New Signal Alerts</Label>
            <Switch id="notifySignals" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="notifyTrades">Trade Execution Alerts</Label>
            <Switch id="notifyTrades" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="notifyPriceAlerts">Price Alerts</Label>
            <Switch id="notifyPriceAlerts" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="notifyErrors">Error Notifications</Label>
            <Switch id="notifyErrors" defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPanel;
