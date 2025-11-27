import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sun, Battery, Wind, TrendingUp, Leaf, DollarSign, AlertCircle, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function DashboardPage() {
  const portfolio = {
    totalValue: 5000,
    totalReturn: 325,
    returnPercentage: 6.5,
    co2Saved: 4.5,
    autonomy: 65,
  };

  const investments = [
    {
      id: 1,
      name: "Luxembourg Solar Park Phase 2",
      type: "solar",
      icon: Sun,
      capacity: "2.5 kWc",
      invested: 1250,
      currentValue: 1340,
      return: 7.2,
      status: "active",
    },
    {
      id: 2,
      name: "Community Battery Storage",
      type: "battery",
      icon: Battery,
      capacity: "5 kWh",
      invested: 750,
      currentValue: 795,
      return: 6.0,
      status: "active",
    },
    {
      id: 3,
      name: "Northern Wind Farm",
      type: "wind",
      icon: Wind,
      capacity: "1.5 kW",
      invested: 850,
      currentValue: 905,
      return: 6.5,
      status: "active",
    },
  ];

  const aiRecommendations = [
    {
      type: "increase",
      message: "Consider increasing battery storage by 15% to optimize energy autonomy",
      priority: "medium",
    },
    {
      type: "opportunity",
      message: "New solar project available matching your profile - 8.2% expected return",
      priority: "high",
    },
    {
      type: "optimize",
      message: "Your wind energy allocation could be increased for better diversification",
      priority: "low",
    },
  ];

  // Load profile data (24 hours) - optimized battery usage
  const loadProfileData = [
    { hour: "0", solar: 0, wind: 0.6, battery: 0, consumption: 0.5 },
    { hour: "1", solar: 0, wind: 0.5, battery: 0, consumption: 0.4 },
    { hour: "2", solar: 0, wind: 0.5, battery: 0, consumption: 0.4 },
    { hour: "3", solar: 0, wind: 0.5, battery: 0, consumption: 0.4 },
    { hour: "4", solar: 0, wind: 0.5, battery: 0, consumption: 0.5 },
    { hour: "5", solar: 0, wind: 0.4, battery: 0.2, consumption: 0.6 },
    { hour: "6", solar: 0.1, wind: 0.4, battery: 0.3, consumption: 0.8 },
    { hour: "7", solar: 0.3, wind: 0.4, battery: 0.3, consumption: 1.0 },
    { hour: "8", solar: 0.6, wind: 0.4, battery: 0.1, consumption: 1.1 },
    { hour: "9", solar: 1.0, wind: 0.5, battery: 0, consumption: 1.0 },
    { hour: "10", solar: 1.3, wind: 0.5, battery: 0, consumption: 0.9 },
    { hour: "11", solar: 1.5, wind: 0.5, battery: 0, consumption: 0.9 },
    { hour: "12", solar: 1.6, wind: 0.4, battery: 0, consumption: 0.8 },
    { hour: "13", solar: 1.5, wind: 0.5, battery: 0, consumption: 0.9 },
    { hour: "14", solar: 1.3, wind: 0.5, battery: 0, consumption: 0.8 },
    { hour: "15", solar: 1.0, wind: 0.5, battery: 0, consumption: 0.8 },
    { hour: "16", solar: 0.7, wind: 0.5, battery: 0, consumption: 0.9 },
    { hour: "17", solar: 0.4, wind: 0.5, battery: 0.2, consumption: 1.1 },
    { hour: "18", solar: 0.2, wind: 0.5, battery: 0.6, consumption: 1.3 },
    { hour: "19", solar: 0, wind: 0.5, battery: 0.9, consumption: 1.4 },
    { hour: "20", solar: 0, wind: 0.5, battery: 0.7, consumption: 1.2 },
    { hour: "21", solar: 0, wind: 0.5, battery: 0.5, consumption: 1.0 },
    { hour: "22", solar: 0, wind: 0.5, battery: 0.3, consumption: 0.8 },
    { hour: "23", solar: 0, wind: 0.5, battery: 0.1, consumption: 0.6 },
    { hour: "24", solar: 0, wind: 0.5, battery: 0, consumption: 0.5 },
  ];

  // Asset ownership breakdown
  const assetsOwned = [
    { type: "Solar", icon: Sun, capacity: "2.5 kWc", percentage: 50, amount: 2500, color: "accent", currentPrice: 520, priceChange: 4.2 },
    { type: "Battery", icon: Battery, capacity: "5 kWh", percentage: 30, amount: 1500, color: "secondary", currentPrice: 162, priceChange: -1.8 },
    { type: "Wind", icon: Wind, capacity: "1.5 kW", percentage: 20, amount: 1000, color: "primary", currentPrice: 680, priceChange: 2.5 },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Investment Dashboard</h1>
          <p className="text-muted-foreground">Track and optimize your energy portfolio</p>
        </div>
        <Link to="/opportunities">
          <Button className="bg-primary hover:bg-primary-dark">
            <Plus className="w-4 h-4 mr-2" />
            New Investment
          </Button>
        </Link>
      </div>

      {/* Portfolio Overview */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="p-6 space-y-2 bg-gradient-to-br from-primary/10 to-primary/5">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <DollarSign className="w-4 h-4" />
            <span>Total Value</span>
          </div>
          <div className="text-3xl font-bold text-primary">€{portfolio.totalValue.toLocaleString()}</div>
          <div className="text-sm text-success">+€{portfolio.totalReturn} ({portfolio.returnPercentage}%)</div>
        </Card>

        <Card className="p-6 space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="w-4 h-4" />
            <span>Total Return</span>
          </div>
          <div className="text-3xl font-bold text-primary">{portfolio.returnPercentage}%</div>
          <div className="text-sm text-muted-foreground">Annual average</div>
        </Card>

        <Card className="p-6 space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Leaf className="w-4 h-4" />
            <span>CO₂ Saved</span>
          </div>
          <div className="text-3xl font-bold text-secondary">{portfolio.co2Saved}t</div>
          <div className="text-sm text-muted-foreground">This year</div>
        </Card>

        <Card className="p-6 space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Sun className="w-4 h-4" />
            <span>Autonomy</span>
          </div>
          <div className="text-3xl font-bold text-accent">{portfolio.autonomy}%</div>
          <div className="text-sm text-muted-foreground">Energy coverage</div>
        </Card>
      </div>

      {/* Active Investments */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Your Investments</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {investments.map((investment) => {
            const Icon = investment.icon;
            const gain = investment.currentValue - investment.invested;
            const gainPercentage = ((gain / investment.invested) * 100).toFixed(1);

            return (
              <Card key={investment.id} className="p-6 space-y-4 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <Badge className="bg-success">Active</Badge>
                </div>

                <div>
                  <h3 className="font-semibold mb-1">{investment.name}</h3>
                  <p className="text-sm text-muted-foreground">{investment.capacity}</p>
                </div>

                <div className="space-y-2 pt-2 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Invested</span>
                    <span className="font-medium">€{investment.invested}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Current Value</span>
                    <span className="font-bold text-primary">€{investment.currentValue}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Gain</span>
                    <span className="font-bold text-success">
                      +€{gain} ({gainPercentage}%)
                    </span>
                  </div>
                </div>

                <Button variant="outline" size="sm" className="w-full">
                  View Details
                </Button>
              </Card>
            );
          })}
        </div>
      </div>

      {/* AI Recommendations */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <span className="text-white text-sm font-bold">AI</span>
          </div>
          <h2 className="text-xl font-bold">Smart Recommendations</h2>
        </div>

        <div className="space-y-3">
          {aiRecommendations.map((rec, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-all"
            >
              <AlertCircle
                className={`w-5 h-5 mt-0.5 ${
                  rec.priority === "high"
                    ? "text-primary"
                    : rec.priority === "medium"
                    ? "text-accent"
                    : "text-muted-foreground"
                }`}
              />
              <div className="flex-1">
                <p className="text-sm">{rec.message}</p>
              </div>
              <Badge
                variant={rec.priority === "high" ? "default" : "outline"}
                className={rec.priority === "high" ? "bg-primary" : ""}
              >
                {rec.priority}
              </Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* Energy Load Profile Chart */}
      <Card className="p-8 space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Energy Production vs. Consumption</h2>
          <p className="text-muted-foreground">
            24-hour overview showing how your assets cover your energy needs
          </p>
        </div>
        
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={loadProfileData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="hour" 
                label={{ value: 'Time (hours)', position: 'insideBottom', offset: -5 }}
                className="text-muted-foreground"
              />
              <YAxis 
                label={{ value: 'kWh', angle: -90, position: 'insideLeft' }}
                className="text-muted-foreground"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              {/* Production sources stacked */}
              <Area 
                type="monotone" 
                dataKey="solar" 
                stackId="production"
                stroke="hsl(var(--accent))" 
                fill="hsl(var(--accent))"
                fillOpacity={0.7}
                name="Solar Production"
              />
              <Area 
                type="monotone" 
                dataKey="wind" 
                stackId="production"
                stroke="hsl(var(--secondary))" 
                fill="hsl(var(--secondary))"
                fillOpacity={0.7}
                name="Wind Production"
              />
              <Area 
                type="monotone" 
                dataKey="battery" 
                stackId="production"
                stroke="hsl(var(--chart-3))" 
                fill="hsl(var(--chart-3))"
                fillOpacity={0.7}
                name="Battery Discharge"
              />
              {/* Consumption shown on top to compare */}
              <Area 
                type="monotone" 
                dataKey="consumption" 
                stroke="hsl(var(--primary))" 
                fill="transparent"
                strokeWidth={3}
                strokeDasharray="5 5"
                name="Your Consumption"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

    </div>
  );
}
