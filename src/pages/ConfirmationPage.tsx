import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Sun, TrendingUp, Leaf, Shield, ArrowRight, Battery, Wind, CreditCard, Calendar } from "lucide-react";

// Project data (same as in OpportunitiesPage)
const projects = [
  { id: 1, type: "solar", name: "Luxembourg Solar Park Phase 2", capacity: "2.5 kWc", price: 1250, return: 7.2, co2: 1.8 },
  { id: 2, type: "battery", name: "Community Battery Storage", capacity: "5 kWh", price: 750, return: 5.8, co2: 1.2 },
  { id: 3, type: "wind", name: "Northern Wind Farm Expansion", capacity: "1.5 kW", price: 850, return: 6.5, co2: 2.1 },
  { id: 4, type: "solar", name: "Residential Solar Initiative", capacity: "3 kWc", price: 1500, return: 6.8, co2: 2.0 },
  { id: 5, type: "battery", name: "Industrial Battery Hub", capacity: "8 kWh", price: 1200, return: 6.2, co2: 1.5 },
  { id: 6, type: "wind", name: "Offshore Wind Partnership", capacity: "2 kW", price: 1100, return: 7.5, co2: 2.5 },
];

export default function ConfirmationPage() {
  const location = useLocation();
  const aiSelections = location.state?.aiSelections || [];
  const totalInvestment = location.state?.totalInvestment || 0;
  const recommendations = location.state?.recommendations;
  const loadProfileData = location.state?.loadProfileData;
  const profile = location.state?.profile;

  const [paymentMethod, setPaymentMethod] = useState<"one-off" | "monthly">("one-off");
  const [monthlyAmount, setMonthlyAmount] = useState(200);

  const minMonthlyAmount = 200;
  const maxMonthlyAmount = totalInvestment;
  const monthsRequired = Math.ceil(totalInvestment / monthlyAmount);

  // Calculate aggregate metrics
  const totalReturn = aiSelections.reduce((sum: number, selection: any) => {
    const project = projects.find(p => p.id === selection.projectId);
    return sum + (project ? (selection.amount * project.return / 100) : 0);
  }, 0);

  const totalCO2 = aiSelections.reduce((sum: number, selection: any) => {
    const project = projects.find(p => p.id === selection.projectId);
    return sum + (project ? project.co2 * (selection.amount / project.price) : 0);
  }, 0);

  const getIcon = (type: string) => {
    switch (type) {
      case "solar": return Sun;
      case "battery": return Battery;
      case "wind": return Wind;
      default: return Sun;
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold">Confirm Your Investment</h1>
        <p className="text-muted-foreground">
          Review your personalized portfolio before finalizing
        </p>
      </div>

      {/* Portfolio Summary by Energy Type */}
      <Card className="p-8 space-y-6">
        <div>
          <h2 className="text-xl font-bold mb-1">Your Personalized Portfolio</h2>
          <p className="text-muted-foreground">Total Investment: €{totalInvestment.toLocaleString()}</p>
        </div>

        <Separator />

        {/* Solar Projects */}
        {recommendations && recommendations.solar.investment > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-semibold">
              <Sun className="w-5 h-5 text-accent" />
              <span>Solar Projects - €{recommendations.solar.investment.toLocaleString()}</span>
              <span className="text-sm text-muted-foreground">({recommendations.solar.percentage}%)</span>
            </div>
            {aiSelections
              .filter((s: any) => projects.find(p => p.id === s.projectId)?.type === 'solar')
              .map((selection: any) => {
                const project = projects.find(p => p.id === selection.projectId);
                return project ? (
                  <div key={selection.projectId} className="ml-7 flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">{project.name}</span>
                    <span className="font-medium">€{selection.amount.toLocaleString()}</span>
                  </div>
                ) : null;
              })}
          </div>
        )}

        {/* Battery Projects */}
        {recommendations && recommendations.battery.investment > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-semibold">
              <Battery className="w-5 h-5 text-secondary" />
              <span>Battery Storage - €{recommendations.battery.investment.toLocaleString()}</span>
              <span className="text-sm text-muted-foreground">({recommendations.battery.percentage}%)</span>
            </div>
            {aiSelections
              .filter((s: any) => projects.find(p => p.id === s.projectId)?.type === 'battery')
              .map((selection: any) => {
                const project = projects.find(p => p.id === selection.projectId);
                return project ? (
                  <div key={selection.projectId} className="ml-7 flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">{project.name}</span>
                    <span className="font-medium">€{selection.amount.toLocaleString()}</span>
                  </div>
                ) : null;
              })}
          </div>
        )}

        {/* Wind Projects */}
        {recommendations && recommendations.wind.investment > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-semibold">
              <Wind className="w-5 h-5 text-primary" />
              <span>Wind Energy - €{recommendations.wind.investment.toLocaleString()}</span>
              <span className="text-sm text-muted-foreground">({recommendations.wind.percentage}%)</span>
            </div>
            {aiSelections
              .filter((s: any) => projects.find(p => p.id === s.projectId)?.type === 'wind')
              .map((selection: any) => {
                const project = projects.find(p => p.id === selection.projectId);
                return project ? (
                  <div key={selection.projectId} className="ml-7 flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">{project.name}</span>
                    <span className="font-medium">€{selection.amount.toLocaleString()}</span>
                  </div>
                ) : null;
              })}
          </div>
        )}

        <Separator />

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <TrendingUp className="w-4 h-4" />
              <span>Total Annual Return</span>
            </div>
            <div className="text-xl font-bold text-primary">€{Math.round(totalReturn).toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">estimated year 1</div>
          </div>

          <div className="p-4 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Leaf className="w-4 h-4" />
              <span>Total CO₂ Impact</span>
            </div>
            <div className="text-xl font-bold">{totalCO2.toFixed(1)}t</div>
            <div className="text-sm text-muted-foreground">saved per year</div>
          </div>
        </div>
      </Card>

      {/* Payment Options */}
      <Card className="p-8 space-y-6">
        <div>
          <h2 className="text-xl font-bold mb-1">Choose Your Payment Method</h2>
          <p className="text-muted-foreground">Select how you'd like to invest</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* One-off Payment */}
          <button
            onClick={() => setPaymentMethod("one-off")}
            className={`p-6 rounded-lg border-2 transition-all text-left ${
              paymentMethod === "one-off"
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                paymentMethod === "one-off" ? "bg-primary text-white" : "bg-muted"
              }`}>
                <CreditCard className="w-5 h-5" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="font-semibold text-lg">One-off Investment</div>
                <p className="text-sm text-muted-foreground">
                  Pay the full amount now and start earning returns immediately
                </p>
                <div className="text-2xl font-bold text-primary pt-2">
                  €{totalInvestment.toLocaleString()}
                </div>
              </div>
            </div>
          </button>

          {/* Monthly Investment Plan */}
          <button
            onClick={() => setPaymentMethod("monthly")}
            className={`p-6 rounded-lg border-2 transition-all text-left ${
              paymentMethod === "monthly"
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                paymentMethod === "monthly" ? "bg-primary text-white" : "bg-muted"
              }`}>
                <Calendar className="w-5 h-5" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="font-semibold text-lg">Monthly Investment Plan</div>
                <p className="text-sm text-muted-foreground">
                  Spread your investment over time with monthly payments
                </p>
                <div className="text-2xl font-bold text-primary pt-2">
                  €{monthlyAmount.toLocaleString()}/month
                </div>
                <p className="text-xs text-muted-foreground">
                  {monthsRequired} {monthsRequired === 1 ? "month" : "months"} • Min. €200/month
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* Monthly Amount Selector */}
        {paymentMethod === "monthly" && (
          <div className="pt-4 space-y-4 border-t">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Adjust Monthly Amount
              </label>
              <input
                type="range"
                min={minMonthlyAmount}
                max={maxMonthlyAmount}
                step={50}
                value={monthlyAmount}
                onChange={(e) => setMonthlyAmount(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span>€{minMonthlyAmount}</span>
                <span className="font-semibold text-primary">€{monthlyAmount.toLocaleString()}</span>
                <span>€{maxMonthlyAmount.toLocaleString()}</span>
              </div>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Investment Period:</span>
                <span className="font-bold">{monthsRequired} {monthsRequired === 1 ? "month" : "months"}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Your returns will begin accumulating as each monthly payment is invested
              </p>
            </div>
          </div>
        )}
      </Card>

      {/* Impact Visualization */}
      <Card className="p-8 space-y-6 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5">
        <h2 className="text-xl font-bold">Your Investment Impact</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <TrendingUp className="w-5 h-5" />
              <span>Estimated Annual Income</span>
            </div>
            <div className="text-3xl font-bold text-primary">€{Math.round(totalReturn).toLocaleString()}</div>
            <p className="text-sm text-muted-foreground">Based on your portfolio allocation</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Leaf className="w-5 h-5" />
              <span>Environmental Impact</span>
            </div>
            <div className="text-3xl font-bold text-secondary">{totalCO2.toFixed(1)}t CO₂</div>
            <p className="text-sm text-muted-foreground">Saved annually from your investments</p>
          </div>
        </div>
      </Card>

      {/* Terms */}
      <Card className="p-6 bg-muted/50">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
          <div className="space-y-2 text-sm">
            <p className="font-medium">By confirming, you agree to:</p>
            <ul className="space-y-1 text-muted-foreground ml-4 list-disc">
              <li>Investment terms and conditions</li>
              <li>Long-term commitment (minimum 5 years)</li>
              <li>Risk disclosure and return expectations</li>
              <li>Privacy policy and data handling</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link to="/opportunities" className="flex-1">
          <Button variant="outline" className="w-full">
            Back to Projects
          </Button>
        </Link>
        <Link 
          to="/portfolio" 
          state={{ 
            portfolio: { 
              totalInvestment, 
              recommendations,
              paymentMethod,
              monthlyAmount: paymentMethod === "monthly" ? monthlyAmount : null,
              loadProfileData,
              profile
            } 
          }} 
          className="flex-1"
        >
          <Button className="w-full bg-primary hover:bg-primary-dark text-lg h-12">
            {paymentMethod === "one-off" 
              ? `Confirm Investment - €${totalInvestment.toLocaleString()}`
              : `Start Monthly Plan - €${monthlyAmount}/month`
            }
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
