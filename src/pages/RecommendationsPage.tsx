import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sun, Battery, Wind, ArrowRight, TrendingUp, Leaf, Shield, Sparkles } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { calculatePortfolioAllocation, generateAlternativeScenarios } from "@/lib/investmentCalculations";
import { getLoadProfileByPod } from "@/data/loadProfiles";

export default function RecommendationsPage() {
  const location = useLocation();
  const profile = location.state?.profile || { budget: 5000, objectives: [], riskAppetite: "moderate" };
  
  const totalInvestment = profile.budget;
  
  // Calculate dynamic portfolio allocation based on user profile
  const allocation = calculatePortfolioAllocation(profile);
  
  const recommendations = {
    solar: { 
      capacity: allocation.solar.capacity, 
      percentage: allocation.solar.percentage, 
      investment: allocation.solar.investment 
    },
    battery: { 
      capacity: allocation.battery.capacity, 
      percentage: allocation.battery.percentage, 
      investment: allocation.battery.investment 
    },
    wind: { 
      capacity: allocation.wind.capacity, 
      percentage: allocation.wind.percentage, 
      investment: allocation.wind.investment 
    },
  };

  // Generate alternative scenarios with dynamic metrics
  const scenarios = generateAlternativeScenarios(allocation, totalInvestment);

  // Get load profile based on POD number
  const loadProfileData = getLoadProfileByPod(profile.podNumber || "");

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
              <div className="text-xl font-bold">{scenarios[0].return}%</div>
              <div className="text-sm text-muted-foreground">Annual Return</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-lg bg-card">
            <Shield className="w-6 h-6 text-accent" />
            <div>
              <div className="text-xl font-bold">{scenarios[0].autonomy}%</div>
              <div className="text-sm text-muted-foreground">Energy Autonomy</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-lg bg-card">
            <Leaf className="w-6 h-6 text-secondary" />
            <div>
              <div className="text-xl font-bold">{scenarios[0].co2}t</div>
              <div className="text-sm text-muted-foreground">CO₂ Saved/Year</div>
            </div>
          </div>
        </div>

        {/* AI Explanation */}
        <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">AI Assistant Recommendation</h3>
              </div>
              <div className="text-sm space-y-2 text-muted-foreground">
                <p>
                  I've optimized this energy mix based on your profile to maximize both returns and energy autonomy:
                </p>
                <ul className="space-y-2 ml-4">
                  <li className="flex gap-2">
                    <Sun className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                    <span><strong>Solar panels ({recommendations.solar.percentage}%)</strong> provide peak production during daylight hours and offer the most cost-effective energy generation per euro invested.</span>
                  </li>
                  <li className="flex gap-2">
                    <Battery className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                    <span><strong>Battery storage ({recommendations.battery.percentage}%)</strong> charges during the day when solar production is high, then covers evening demand gaps that wind cannot fully meet.</span>
                  </li>
                  <li className="flex gap-2">
                    <Wind className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span><strong>Wind energy ({recommendations.wind.percentage}%)</strong> provides consistent baseline production throughout day and night, balancing your portfolio with steady returns.</span>
                  </li>
                </ul>
                <p className="pt-2 italic">
                  <strong>Note:</strong> If you switch to a dynamic tariff in the future, I would recommend shifting focus toward battery storage to capitalize on peak-hour pricing arbitrage opportunities.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </Card>

      {/* Load Profile Chart */}
      <Card className="p-8 space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Your Energy Load Profile</h2>
          <p className="text-muted-foreground">
            24-hour overview comparing your investment's production with actual consumption
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
              <Area 
                type="monotone" 
                dataKey="consumption" 
                stackId="1"
                stroke="hsl(0, 84%, 60%)" 
                strokeWidth={3}
                strokeDasharray="5 5"
                fill="none"
                name="Consumption"
              />
              <Area 
                type="monotone" 
                dataKey="wind" 
                stackId="2"
                stroke="hsl(270, 70%, 60%)" 
                fill="hsl(270, 70%, 60%)"
                fillOpacity={0.8}
                name="Wind"
              />
              <Area 
                type="monotone" 
                dataKey="solar" 
                stackId="2"
                stroke="hsl(var(--accent))" 
                fill="hsl(var(--accent))"
                fillOpacity={0.8}
                name="Solar"
              />
              <Area 
                type="monotone" 
                dataKey="battery" 
                stackId="2"
                stroke="hsl(var(--muted-foreground))" 
                fill="hsl(var(--muted-foreground))"
                fillOpacity={0.7}
                name="Battery"
              />
            </AreaChart>
          </ResponsiveContainer>
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
        <Link to="/opportunities" state={{ recommendations, totalInvestment, profile, loadProfileData }}>
          <Button className="bg-primary hover:bg-primary-dark">
            View Available Projects
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
