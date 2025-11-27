import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingDown, Zap, DollarSign, Calendar } from "lucide-react";

export default function InvoiceIntegrationPage() {
  // Mock data from last simulation
  const investmentPlan = {
    type: "monthly", // or "upfront"
    totalAmount: 15000,
    monthlyPayment: 250,
    portfolio: {
      solar: 8000,
      wind: 5000,
      battery: 2000
    }
  };

  // Monthly financial data for the chart
  const monthlyData = [
    { month: "Jan", savings: 145, revenue: 78 },
    { month: "Feb", savings: 152, revenue: 82 },
    { month: "Mar", savings: 168, revenue: 95 },
    { month: "Apr", savings: 185, revenue: 112 },
    { month: "May", savings: 198, revenue: 128 },
    { month: "Jun", savings: 210, revenue: 145 },
    { month: "Jul", savings: 215, revenue: 152 },
    { month: "Aug", savings: 208, revenue: 148 },
    { month: "Sep", savings: 192, revenue: 125 },
    { month: "Oct", savings: 172, revenue: 98 },
    { month: "Nov", savings: 158, revenue: 85 },
    { month: "Dec", savings: 148, revenue: 75 }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Your Investment Impact</h1>
        <p className="text-muted-foreground">
          Track your financial returns and energy savings from your renewable energy investments
        </p>
      </div>

      {/* Investment Plan Summary */}
      <Card className="p-8 space-y-6 border-2 border-primary bg-gradient-hero">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Your Investment Plan</h2>
            <p className="text-muted-foreground">Based on your latest simulation</p>
          </div>
          <Badge variant="secondary" className="text-base px-4 py-2">
            {investmentPlan.type === "upfront" ? "One-off Payment" : "Monthly Plan"}
          </Badge>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Investment Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Investment</p>
                <p className="text-2xl font-bold">€{investmentPlan.totalAmount.toLocaleString()}</p>
              </div>
            </div>

            {investmentPlan.type === "monthly" && (
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Monthly Payment</p>
                  <p className="text-2xl font-bold">€{investmentPlan.monthlyPayment}</p>
                </div>
              </div>
            )}
          </div>

          {/* Portfolio Allocation */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Portfolio Allocation</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[hsl(45,100%,51%)]" />
                  <span className="text-sm">Solar</span>
                </div>
                <span className="font-semibold">€{investmentPlan.portfolio.solar.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[hsl(210,100%,56%)]" />
                  <span className="text-sm">Wind</span>
                </div>
                <span className="font-semibold">€{investmentPlan.portfolio.wind.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[hsl(142,71%,45%)]" />
                  <span className="text-sm">Battery</span>
                </div>
                <span className="font-semibold">€{investmentPlan.portfolio.battery.toLocaleString()}</span>
              </div>
            </div>
          </div>
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
            <TrendingDown className="w-5 h-5" />
            <span className="text-sm font-medium">Annual Savings</span>
          </div>
          <div className="text-3xl font-bold">€2,211</div>
          <p className="text-sm text-muted-foreground">Total energy cost reduction</p>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2 text-secondary">
            <Zap className="w-5 h-5" />
            <span className="text-sm font-medium">Annual Revenue</span>
          </div>
          <div className="text-3xl font-bold">€1,323</div>
          <p className="text-sm text-muted-foreground">From excess production sales</p>
        </Card>

        <Card className="p-6 space-y-4 border-2 border-success bg-gradient-hero">
          <div className="flex items-center gap-2 text-success">
            <DollarSign className="w-5 h-5" />
            <span className="text-sm font-medium">Total Annual Benefit</span>
          </div>
          <div className="text-3xl font-bold text-success">€3,534</div>
          <p className="text-sm text-muted-foreground">Combined financial return</p>
        </Card>
      </div>
    </div>
  );
}
