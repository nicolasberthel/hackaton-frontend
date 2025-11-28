import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sun, Battery, Wind, TrendingUp, Leaf, DollarSign, AlertCircle, Plus } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function DashboardPage() {
  const location = useLocation();
  
  // Get investment data from navigation state or localStorage
  const [portfolioData, setPortfolioData] = useState(() => {
    const savedData = localStorage.getItem('portfolioData');
    return savedData ? JSON.parse(savedData) : null;
  });

  // Sell dialog state
  const [sellDialogOpen, setSellDialogOpen] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState<any>(null);
  const [sellPercentage, setSellPercentage] = useState<string>("100");

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
  // Total annual benefit capped at 10% of initial investment
  // Revenue is approximately 38% of total benefit from selling excess production
  const maxAnnualBenefit = totalInvestment * 0.10;
  const baseSavingsMultiplier = maxAnnualBenefit / 500; // Base values sum to ~500
  
  const monthlyData = [
    { month: "Jan", savings: Math.round(19 * baseSavingsMultiplier), revenue: Math.round(12 * baseSavingsMultiplier) },
    { month: "Feb", savings: Math.round(21 * baseSavingsMultiplier), revenue: Math.round(13 * baseSavingsMultiplier) },
    { month: "Mar", savings: Math.round(24 * baseSavingsMultiplier), revenue: Math.round(15 * baseSavingsMultiplier) },
    { month: "Apr", savings: Math.round(27 * baseSavingsMultiplier), revenue: Math.round(17 * baseSavingsMultiplier) },
    { month: "May", savings: Math.round(30 * baseSavingsMultiplier), revenue: Math.round(19 * baseSavingsMultiplier) },
    { month: "Jun", savings: Math.round(32 * baseSavingsMultiplier), revenue: Math.round(21 * baseSavingsMultiplier) },
    { month: "Jul", savings: Math.round(33 * baseSavingsMultiplier), revenue: Math.round(22 * baseSavingsMultiplier) },
    { month: "Aug", savings: Math.round(31 * baseSavingsMultiplier), revenue: Math.round(20 * baseSavingsMultiplier) },
    { month: "Sep", savings: Math.round(28 * baseSavingsMultiplier), revenue: Math.round(17 * baseSavingsMultiplier) },
    { month: "Oct", savings: Math.round(25 * baseSavingsMultiplier), revenue: Math.round(15 * baseSavingsMultiplier) },
    { month: "Nov", savings: Math.round(22 * baseSavingsMultiplier), revenue: Math.round(13 * baseSavingsMultiplier) },
    { month: "Dec", savings: Math.round(20 * baseSavingsMultiplier), revenue: Math.round(12 * baseSavingsMultiplier) }
  ];
  
  const annualSavings = monthlyData.reduce((sum, m) => sum + m.savings, 0);
  const annualRevenue = monthlyData.reduce((sum, m) => sum + m.revenue, 0);

  const investments = [
    {
      id: 1,
      name: "Luxembourg Solar Park Phase 2",
      type: "solar",
      icon: Sun,
      capacity: ((recommendations.solar.investment / 1111 / 2).toFixed(2)) + " kWc",
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
      capacity: ((recommendations.battery.investment / 625 / 2).toFixed(2)) + " kWh",
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
      capacity: ((recommendations.wind.investment / 2500 / 2).toFixed(2)) + " kW",
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
      capacity: ((recommendations.solar.investment / 1111).toFixed(2)) + " kWc", 
      percentage: recommendations.solar.percentage, 
      amount: recommendations.solar.investment, 
      color: "accent", 
      currentPrice: Math.round(recommendations.solar.investment * 1.04), 
      priceChange: 4.20 
    },
    { 
      type: "Battery", 
      icon: Battery, 
      capacity: ((recommendations.battery.investment / 625).toFixed(2)) + " kWh", 
      percentage: recommendations.battery.percentage, 
      amount: recommendations.battery.investment, 
      color: "secondary", 
      currentPrice: Math.round(recommendations.battery.investment * 0.98), 
      priceChange: -1.80 
    },
    { 
      type: "Wind", 
      icon: Wind, 
      capacity: ((recommendations.wind.investment / 2500).toFixed(2)) + " kW", 
      percentage: recommendations.wind.percentage, 
      amount: recommendations.wind.investment, 
      color: "primary", 
      currentPrice: Math.round(recommendations.wind.investment * 1.025), 
      priceChange: 2.50 
    },
  ];

  const handleOpenSellDialog = (investment: any) => {
    setSelectedInvestment(investment);
    setSellPercentage("100");
    setSellDialogOpen(true);
  };

  const handleSellShares = () => {
    if (!selectedInvestment) return;
    
    const percentage = parseFloat(sellPercentage);
    if (isNaN(percentage) || percentage <= 0 || percentage > 100) {
      toast.error("Please enter a valid percentage between 1 and 100");
      return;
    }

    const sellAmount = (selectedInvestment.currentValue * percentage) / 100;
    toast.success(`Successfully sold ${percentage}% of ${selectedInvestment.name} for €${sellAmount.toFixed(2)}`);
    setSellDialogOpen(false);
  };

  const getSellAmount = () => {
    if (!selectedInvestment) return 0;
    const percentage = parseFloat(sellPercentage) || 0;
    return (selectedInvestment.currentValue * percentage) / 100;
  };

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
          <div className="text-sm text-success">+€{portfolio.totalReturn.toLocaleString()} ({portfolio.returnPercentage.toFixed(2)}%)</div>
        </Card>

        <Card className="p-6 space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="w-4 h-4" />
            <span>Total Return</span>
          </div>
          <div className="text-3xl font-bold text-primary">{portfolio.returnPercentage.toFixed(2)}%</div>
          <div className="text-sm text-muted-foreground">Annual average</div>
        </Card>

        <Card className="p-6 space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Leaf className="w-4 h-4" />
            <span>CO₂ Saved</span>
          </div>
          <div className="text-3xl font-bold text-secondary">{portfolio.co2Saved.toFixed(2)} t</div>
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
                    <span className="font-medium">€{investment.invested.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Current Value</span>
                    <span className="font-bold text-primary">€{investment.currentValue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Gain</span>
                    <span className="font-bold text-success">
                      +€{gain.toLocaleString()} ({gainPercentage}%)
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    View Details
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleOpenSellDialog(investment)}
                  >
                    Sell
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Sell Dialog */}
      <Dialog open={sellDialogOpen} onOpenChange={setSellDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Sell Portfolio Shares</DialogTitle>
            <DialogDescription>
              How much of your {selectedInvestment?.name} investment would you like to sell?
            </DialogDescription>
          </DialogHeader>

          {selectedInvestment && (
            <div className="space-y-6 py-4">
              <div className="space-y-4 p-4 rounded-lg bg-muted/50">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Current Value</span>
                  <span className="font-bold">€{selectedInvestment.currentValue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Original Investment</span>
                  <span className="font-medium">€{selectedInvestment.invested.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Current Gain</span>
                  <span className="font-bold text-success">
                    +€{(selectedInvestment.currentValue - selectedInvestment.invested).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sell-percentage">Percentage to Sell (%)</Label>
                <div className="flex gap-2">
                  <Input
                    id="sell-percentage"
                    type="number"
                    min="1"
                    max="100"
                    value={sellPercentage}
                    onChange={(e) => setSellPercentage(e.target.value)}
                    placeholder="100"
                  />
                  <Button 
                    variant="outline" 
                    onClick={() => setSellPercentage("100")}
                  >
                    Max
                  </Button>
                </div>
              </div>

              <div className="p-4 rounded-lg border-2 border-primary bg-primary/5">
                <div className="flex justify-between items-center">
                  <span className="font-medium">You will receive</span>
                  <span className="text-2xl font-bold text-primary">
                    €{getSellAmount().toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => setSellDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="button"
              variant="destructive"
              onClick={handleSellShares}
            >
              Confirm Sale
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
