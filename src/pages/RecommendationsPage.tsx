import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sun, Battery, Wind, ArrowRight, TrendingUp, Leaf, Shield } from "lucide-react";

export default function RecommendationsPage() {
  const location = useLocation();
  const profile = location.state?.profile || { budget: 5000, objectives: [], riskAppetite: "moderate" };
  
  const totalInvestment = profile.budget;
  
  const recommendations = {
    solar: { capacity: (totalInvestment / 1111).toFixed(1), percentage: 50, investment: Math.round(totalInvestment * 0.5) },
    battery: { capacity: (totalInvestment / 625).toFixed(0), percentage: 30, investment: Math.round(totalInvestment * 0.3) },
    wind: { capacity: (totalInvestment / 2500).toFixed(1), percentage: 20, investment: Math.round(totalInvestment * 0.2) },
  };

  const scenarios = [
    { name: "Current Recommendation", solar: 50, battery: 30, wind: 20, return: 6.5, autonomy: 65, co2: 2.8 },
    { name: "Max Return", solar: 60, battery: 20, wind: 20, return: 7.8, autonomy: 60, co2: 2.5 },
    { name: "Max Autonomy", solar: 45, battery: 40, wind: 15, return: 5.2, autonomy: 78, co2: 3.1 },
    { name: "Most Sustainable", solar: 40, battery: 30, wind: 30, return: 6.0, autonomy: 62, co2: 3.5 },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Your Personalized Recommendations</h1>
        <p className="text-muted-foreground">
          Based on your energy profile, we've created the optimal investment mix for you
        </p>
      </div>

      {/* Main Recommendation */}
      <Card className="p-8 space-y-6 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Recommended Portfolio</h2>
            <p className="text-muted-foreground">Optimal mix for your goals and budget</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-primary">€{totalInvestment.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground">Total Investment</p>
          </div>
        </div>

        {/* Asset Breakdown */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6 space-y-4 border-2">
            <div className="flex items-center justify-between">
              <Sun className="w-8 h-8 text-accent" />
              <span className="text-2xl font-bold">{recommendations.solar.percentage}%</span>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Solar Panels</h3>
              <p className="text-sm text-muted-foreground">{recommendations.solar.capacity} kWc capacity</p>
            </div>
            <div className="pt-2 border-t">
              <span className="text-lg font-bold text-primary">€{recommendations.solar.investment.toLocaleString()}</span>
            </div>
          </Card>

          <Card className="p-6 space-y-4 border-2">
            <div className="flex items-center justify-between">
              <Battery className="w-8 h-8 text-secondary" />
              <span className="text-2xl font-bold">{recommendations.battery.percentage}%</span>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Battery Storage</h3>
              <p className="text-sm text-muted-foreground">{recommendations.battery.capacity} kWh capacity</p>
            </div>
            <div className="pt-2 border-t">
              <span className="text-lg font-bold text-primary">€{recommendations.battery.investment.toLocaleString()}</span>
            </div>
          </Card>

          <Card className="p-6 space-y-4 border-2">
            <div className="flex items-center justify-between">
              <Wind className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold">{recommendations.wind.percentage}%</span>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Wind Energy</h3>
              <p className="text-sm text-muted-foreground">{recommendations.wind.capacity} kW capacity</p>
            </div>
            <div className="pt-2 border-t">
              <span className="text-lg font-bold text-primary">€{recommendations.wind.investment.toLocaleString()}</span>
            </div>
          </Card>
        </div>

        {/* Expected Outcomes */}
        <div className="grid md:grid-cols-3 gap-4 pt-4">
          <div className="flex items-center gap-3 p-4 rounded-lg bg-card">
            <TrendingUp className="w-6 h-6 text-primary" />
            <div>
              <div className="text-xl font-bold">6.5%</div>
              <div className="text-sm text-muted-foreground">Annual Return</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-lg bg-card">
            <Shield className="w-6 h-6 text-accent" />
            <div>
              <div className="text-xl font-bold">65%</div>
              <div className="text-sm text-muted-foreground">Energy Autonomy</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-lg bg-card">
            <Leaf className="w-6 h-6 text-secondary" />
            <div>
              <div className="text-xl font-bold">2.8t</div>
              <div className="text-sm text-muted-foreground">CO₂ Saved/Year</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Alternative Scenarios */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Alternative Scenarios</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {scenarios.map((scenario, index) => (
            <Card key={index} className="p-6 space-y-4 hover:shadow-lg transition-all cursor-pointer group">
              <h3 className="font-semibold">{scenario.name}</h3>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Solar</span>
                  <span className="font-medium">{scenario.solar}%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Battery</span>
                  <span className="font-medium">{scenario.battery}%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Wind</span>
                  <span className="font-medium">{scenario.wind}%</span>
                </div>
              </div>

              <div className="pt-4 border-t space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Return</span>
                  <span className="font-bold text-primary">{scenario.return}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Autonomy</span>
                  <span className="font-bold">{scenario.autonomy}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">CO₂</span>
                  <span className="font-bold">{scenario.co2}t</span>
                </div>
              </div>

              <Button variant="outline" size="sm" className="w-full group-hover:bg-primary group-hover:text-white transition-all">
                Select This
              </Button>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="flex justify-end gap-4">
        <Link to="/profile">
          <Button variant="outline">Modify Profile</Button>
        </Link>
        <Link to="/opportunities">
          <Button className="bg-primary hover:bg-primary-dark">
            View Available Projects
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
