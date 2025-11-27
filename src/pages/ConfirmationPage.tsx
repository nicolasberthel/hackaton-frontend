import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Sun, TrendingUp, Leaf, Shield, ArrowRight, Battery, Wind } from "lucide-react";

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
        <Link to="/dashboard" className="flex-1">
          <Button className="w-full bg-primary hover:bg-primary-dark text-lg h-12">
            Confirm Investment
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
