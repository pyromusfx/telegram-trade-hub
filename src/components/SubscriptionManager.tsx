
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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { BadgeCheck, Calendar, CreditCard, AlertTriangle, Clock, ChevronRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Subscription, generateMockSubscription } from "@/utils/types";

const SubscriptionManager: React.FC = () => {
  const [subscription, setSubscription] = useState<Subscription>(generateMockSubscription());
  
  const { toast } = useToast();

  const handleRenewal = (autoRenew: boolean) => {
    setSubscription({ ...subscription, autoRenew });
    
    toast({
      title: autoRenew ? "Auto-renewal enabled" : "Auto-renewal disabled",
      description: autoRenew 
        ? "Your subscription will automatically renew when it expires." 
        : "Your subscription will not renew automatically.",
    });
  };

  const handleUpgradeSubscription = () => {
    // Mock the upgrade process
    toast({
      title: "Redirecting to Payment",
      description: "You're being redirected to complete your upgrade.",
    });
  };

  const handleCancelSubscription = () => {
    setSubscription({ ...subscription, isActive: false });
    
    toast({
      title: "Subscription Cancelled",
      description: "Your subscription has been cancelled but remains active until the end date.",
      variant: "destructive",
    });
  };

  const getRemainingDays = () => {
    const today = new Date();
    const end = new Date(subscription.endDate);
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const remainingDays = getRemainingDays();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Subscription</h2>
      </div>

      {/* Current Subscription Card */}
      <Card className={`border ${subscription.isActive ? 'border-primary/30' : 'border-destructive/30'}`}>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center">
                {subscription.plan} Plan
                {subscription.isActive && (
                  <BadgeCheck className="ml-2 h-5 w-5 text-primary" />
                )}
              </CardTitle>
              <CardDescription>
                {subscription.isActive
                  ? "Your subscription is active"
                  : "Your subscription is inactive"}
              </CardDescription>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center ${
              subscription.isActive 
                ? 'bg-signal-success/20 text-signal-success' 
                : 'bg-destructive/20 text-destructive'
            }`}>
              {subscription.isActive ? "Active" : "Inactive"}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between py-1">
            <span className="text-muted-foreground">Status</span>
            <span className="font-medium">
              {subscription.isActive ? "Active" : "Cancelled"}
            </span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-muted-foreground">Price</span>
            <span className="font-medium">${subscription.price.toFixed(2)}/month</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-muted-foreground">Start Date</span>
            <span className="font-medium flex items-center">
              <Calendar className="mr-1.5 h-3.5 w-3.5" />
              {subscription.startDate.toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-muted-foreground">End Date</span>
            <span className="font-medium flex items-center">
              <Calendar className="mr-1.5 h-3.5 w-3.5" />
              {subscription.endDate.toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-muted-foreground">Auto-Renewal</span>
            <div className="flex items-center">
              <Switch
                id="auto-renew"
                checked={subscription.autoRenew}
                onCheckedChange={handleRenewal}
                disabled={!subscription.isActive}
              />
              <Label htmlFor="auto-renew" className="ml-2">
                {subscription.autoRenew ? "On" : "Off"}
              </Label>
            </div>
          </div>

          {subscription.isActive && (
            <div className="mt-4 p-3 rounded-md bg-secondary/50 flex items-center">
              <Clock className="h-5 w-5 mr-3 text-primary" />
              <div>
                <p className="font-medium">
                  {remainingDays} {remainingDays === 1 ? "day" : "days"} remaining
                </p>
                <p className="text-sm text-muted-foreground">
                  {subscription.autoRenew
                    ? "Your subscription will automatically renew"
                    : "Your subscription will expire after this period"}
                </p>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3 sm:justify-between">
          {subscription.isActive ? (
            <>
              <Button
                variant="outline"
                onClick={handleCancelSubscription}
                className="w-full sm:w-auto"
              >
                Cancel Subscription
              </Button>
              <Button 
                onClick={handleUpgradeSubscription}
                className="w-full sm:w-auto"
              >
                Manage Payment Method
              </Button>
            </>
          ) : (
            <Button
              className="w-full"
              onClick={handleUpgradeSubscription}
            >
              Renew Subscription
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Available Plans */}
      <h3 className="text-xl font-bold mt-8">Available Plans</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border border-border hover:border-primary/30 transition-all">
          <CardHeader>
            <CardTitle>Basic</CardTitle>
            <CardDescription>For casual signal followers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-3xl font-bold">$19.99<span className="text-sm font-normal text-muted-foreground">/month</span></div>
            <Separator />
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <ChevronRight className="h-4 w-4 mr-2 text-primary" />
                Access to all trading signals
              </li>
              <li className="flex items-center">
                <ChevronRight className="h-4 w-4 mr-2 text-primary" />
                Manual trading only
              </li>
              <li className="flex items-center">
                <ChevronRight className="h-4 w-4 mr-2 text-primary" />
                Basic analytics
              </li>
              <li className="flex items-center">
                <ChevronRight className="h-4 w-4 mr-2 text-primary" />
                Email support
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={handleUpgradeSubscription}>
              Select Plan
            </Button>
          </CardFooter>
        </Card>

        <Card className="border-2 border-primary/50 relative">
          <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded-bl-md">
            Popular
          </div>
          <CardHeader>
            <CardTitle>Premium</CardTitle>
            <CardDescription>For active traders</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-3xl font-bold">$49.99<span className="text-sm font-normal text-muted-foreground">/month</span></div>
            <Separator />
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <ChevronRight className="h-4 w-4 mr-2 text-primary" />
                All Basic features
              </li>
              <li className="flex items-center">
                <ChevronRight className="h-4 w-4 mr-2 text-primary" />
                Automated trading
              </li>
              <li className="flex items-center">
                <ChevronRight className="h-4 w-4 mr-2 text-primary" />
                Advanced risk management
              </li>
              <li className="flex items-center">
                <ChevronRight className="h-4 w-4 mr-2 text-primary" />
                Priority support
              </li>
              <li className="flex items-center">
                <ChevronRight className="h-4 w-4 mr-2 text-primary" />
                Performance analytics
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={handleUpgradeSubscription}>
              {subscription.plan === "Premium" ? "Current Plan" : "Upgrade Now"}
            </Button>
          </CardFooter>
        </Card>

        <Card className="border border-border hover:border-primary/30 transition-all">
          <CardHeader>
            <CardTitle>Pro</CardTitle>
            <CardDescription>For professional traders</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-3xl font-bold">$99.99<span className="text-sm font-normal text-muted-foreground">/month</span></div>
            <Separator />
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <ChevronRight className="h-4 w-4 mr-2 text-primary" />
                All Premium features
              </li>
              <li className="flex items-center">
                <ChevronRight className="h-4 w-4 mr-2 text-primary" />
                Custom trading strategies
              </li>
              <li className="flex items-center">
                <ChevronRight className="h-4 w-4 mr-2 text-primary" />
                VIP signals
              </li>
              <li className="flex items-center">
                <ChevronRight className="h-4 w-4 mr-2 text-primary" />
                1-on-1 strategy consultation
              </li>
              <li className="flex items-center">
                <ChevronRight className="h-4 w-4 mr-2 text-primary" />
                24/7 dedicated support
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={handleUpgradeSubscription}>
              Select Plan
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Payment Information */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Information</CardTitle>
          <CardDescription>Manage your payment methods</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 border rounded-md flex items-center justify-between">
            <div className="flex items-center">
              <CreditCard className="h-5 w-5 mr-3" />
              <div>
                <p className="font-medium">Visa ending in 4242</p>
                <p className="text-sm text-muted-foreground">Expires 12/25</p>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              Change
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Cancellation Policy */}
      <Card className="bg-secondary/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2 text-signal-warning" />
            Cancellation Policy
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p>
            You can cancel your subscription at any time. If you cancel, you'll still have access to Premium features until your current billing period ends. We don't offer refunds for partial months.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionManager;
