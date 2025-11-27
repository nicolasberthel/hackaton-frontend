import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sun, Battery, Wind, TrendingUp, Leaf, DollarSign, AlertCircle, Plus } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const location = useLocation();
  
  // Get investment data from navigation state or localStorage
  const [portfolioData, setPortfolioData] = useState(() => {
    const savedData = localStorage.getItem('portfolioData');
    return savedData ? JSON.parse(savedData) : null;
  });

  // Update portfolio data when arriving from confirmation
  useEffect(() => {
    if (location.state?.portfolio) {
      const newPortfolio = location.state.portfolio;
      setPortfolioData(newPortfolio);
      localStorage.setItem('portfolioData', JSON.stringify(newPortfolio));
    }
  }, [location.state]);

  // Use saved portfolio data or default values
  const totalInvestment = portfolioData?.totalInvestment || 5000;
  const recommendations = portfolioData?.recommendations || {
    solar: { percentage: 50, investment: 2500 },
    battery: { percentage: 30, investment: 1500 },
    wind: { percentage: 20, investment: 1000 },
  };

  const portfolio = {
    totalValue: totalInvestment,
    totalReturn: Math.round(totalInvestment * 0.065), // 6.5% average return
    returnPercentage: 6.5,
    co2Saved: (totalInvestment / 1000) * 0.9, // Approximate CO2 calculation
    autonomy: 65,
  };

  // Monthly financial benefits data - calculated based on investment
  // Savings scale with investment: base €150/month per €5000 invested
  // Revenue is approximately 40-45% of savings from selling excess production
  const savingsMultiplier = totalInvestment / 5000;
  const monthlyData = [
    { month: "Jan", savings: Math.round(120 * savingsMultiplier), revenue: Math.round(52 * savingsMultiplier) },
    { month: "Feb", savings: Math.round(128 * savingsMultiplier), revenue: Math.round(55 * savingsMultiplier) },
    { month: "Mar", savings: Math.round(145 * savingsMultiplier), revenue: Math.round(63 * savingsMultiplier) },
    { month: "Apr", savings: Math.round(162 * savingsMultiplier), revenue: Math.round(72 * savingsMultiplier) },
    { month: "May", savings: Math.round(175 * savingsMultiplier), revenue: Math.round(82 * savingsMultiplier) },
    { month: "Jun", savings: Math.round(185 * savingsMultiplier), revenue: Math.round(88 * savingsMultiplier) },
    { month: "Jul", savings: Math.round(190 * savingsMultiplier), revenue: Math.round(92 * savingsMultiplier) },
    { month: "Aug", savings: Math.round(182 * savingsMultiplier), revenue: Math.round(86 * savingsMultiplier) },
    { month: "Sep", savings: Math.round(165 * savingsMultiplier), revenue: Math.round(75 * savingsMultiplier) },
    { month: "Oct", savings: Math.round(148 * savingsMultiplier), revenue: Math.round(65 * savingsMultiplier) },
    { month: "Nov", savings: Math.round(132 * savingsMultiplier), revenue: Math.round(57 * savingsMultiplier) },
    { month: "Dec", savings: Math.round(122 * savingsMultiplier), revenue: Math.round(50 * savingsMultiplier) }
  ];
  
  const annualSavings = monthlyData.reduce((sum, m) => sum + m.savings, 0);
  const annualRevenue = monthlyData.reduce((sum, m) => sum + m.revenue, 0);

  const investments = [
    {
      id: 1,
      name: "Luxembourg Solar Park Phase 2",
      type: "solar",
      icon: Sun,
      capacity: ((recommendations.solar.investment / 1111 / 2).toFixed(1)) + " kWc",
      invested: Math.round(recommendations.solar.investment * 0.6),
      currentValue: Math.round(recommendations.solar.investment * 0.6 * 1.07),
      return: 7.2,
      status: "active",
    },
    {
      id: 2,
      name: "Community Battery Storage",
      type: "battery",
      icon: Battery,
      capacity: ((recommendations.battery.investment / 625 / 2).toFixed(0)) + " kWh",
      invested: Math.round(recommendations.battery.investment * 0.5),
      currentValue: Math.round(recommendations.battery.investment * 0.5 * 1.06),
      return: 6.0,
      status: "active",
    },
    {
      id: 3,
      name: "Northern Wind Farm",
      type: "wind",
      icon: Wind,
      capacity: ((recommendations.wind.investment / 2500 / 2).toFixed(1)) + " kW",
      invested: Math.round(recommendations.wind.investment * 0.6),
      currentValue: Math.round(recommendations.wind.investment * 0.6 * 1.065),
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


  // Asset ownership breakdown - uses actual investment percentages
  const assetsOwned = [
    { 
      type: "Solar", 
      icon: Sun, 
      capacity: ((recommendations.solar.investment / 1111).toFixed(1)) + " kWc", 
      percentage: recommendations.solar.percentage, 
      amount: recommendations.solar.investment, 
      color: "accent", 
      currentPrice: Math.round(recommendations.solar.investment * 1.04), 
      priceChange: 4.2 
    },
    { 
      type: "Battery", 
      icon: Battery, 
      capacity: ((recommendations.battery.investment / 625).toFixed(0)) + " kWh", 
      percentage: recommendations.battery.percentage, 
      amount: recommendations.battery.investment, 
      color: "secondary", 
      currentPrice: Math.round(recommendations.battery.investment * 0.98), 
      priceChange: -1.8 
    },
    { 
      type: "Wind", 
      icon: Wind, 
      capacity: ((recommendations.wind.investment / 2500).toFixed(1)) + " kW", 
      percentage: recommendations.wind.percentage, 
      amount: recommendations.wind.investment, 
      color: "primary", 
      currentPrice: Math.round(recommendations.wind.investment * 1.025), 
      priceChange: 2.5 
    },
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

      {/* Monthly Financial Benefits Chart */}
      <Card className="p-8 space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Monthly Financial Benefits</h2>
          <p className="text-muted-foreground">
            Energy consumption cost reduction and revenue from selling excess production
          </p>
        </div>

        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="month" 
                className="text-sm"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis 
                className="text-sm"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                label={{ value: 'Amount (€)', angle: -90, position: 'insideLeft', fill: 'hsl(var(--muted-foreground))' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
                formatter={(value: number) => [`€${value}`, '']}
              />
              <Legend 
                wrapperStyle={{
                  paddingTop: '20px'
                }}
              />
              <Bar 
                dataKey="savings" 
                stackId="a" 
                fill="hsl(var(--primary))" 
                name="Energy Cost Reduction"
                radius={[0, 0, 4, 4]}
              />
              <Bar 
                dataKey="revenue" 
                stackId="a" 
                fill="hsl(var(--secondary))" 
                name="Production Revenue"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Annual Summary */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2 text-primary">
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm font-medium">Annual Savings</span>
          </div>
          <div className="text-3xl font-bold">€{annualSavings.toLocaleString()}</div>
          <p className="text-sm text-muted-foreground">Total energy cost reduction</p>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2 text-secondary">
            <DollarSign className="w-5 h-5" />
            <span className="text-sm font-medium">Annual Revenue</span>
          </div>
          <div className="text-3xl font-bold">€{annualRevenue.toLocaleString()}</div>
          <p className="text-sm text-muted-foreground">From excess production sales</p>
        </Card>

        <Card className="p-6 space-y-4 border-2 border-success bg-gradient-hero">
          <div className="flex items-center gap-2 text-success">
            <DollarSign className="w-5 h-5" />
            <span className="text-sm font-medium">Total Annual Benefit</span>
          </div>
          <div className="text-3xl font-bold text-success">€{(annualSavings + annualRevenue).toLocaleString()}</div>
          <p className="text-sm text-muted-foreground">Combined financial return</p>
        </Card>
      </div>

    </div>
  );
}
