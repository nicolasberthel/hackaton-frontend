import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sun, Battery, Wind, MapPin, TrendingUp, Leaf, Clock, Sparkles, CheckCircle2, Handshake, ArrowRight } from "lucide-react";

const projects = [
  {
    id: 1,
    type: "solar",
    name: "Luxembourg Solar Park Phase 2",
    location: "Bettembourg, Luxembourg",
    capacity: "2.5 kWc",
    price: 1250,
    return: 7.2,
    co2: 1.8,
    availability: "available",
    image: "🌞",
  },
  {
    id: 2,
    type: "battery",
    name: "Community Battery Storage",
    location: "Esch-sur-Alzette, Luxembourg",
    capacity: "5 kWh",
    price: 750,
    return: 5.8,
    co2: 1.2,
    availability: "low",
    image: "🔋",
  },
  {
    id: 3,
    type: "wind",
    name: "Northern Wind Farm Expansion",
    location: "Erpeldange, Luxembourg",
    capacity: "1.5 kW",
    price: 850,
    return: 6.5,
    co2: 2.1,
    availability: "available",
    image: "💨",
  },
  {
    id: 4,
    type: "solar",
    name: "Residential Solar Initiative",
    location: "Luxembourg City",
    capacity: "3 kWc",
    price: 1500,
    return: 6.8,
    co2: 2.0,
    availability: "available",
    image: "🌞",
  },
  {
    id: 5,
    type: "battery",
    name: "Industrial Battery Hub",
    location: "Differdange, Luxembourg",
    capacity: "8 kWh",
    price: 1200,
    return: 6.2,
    co2: 1.5,
    availability: "waitlist",
    image: "🔋",
  },
  {
    id: 6,
    type: "wind",
    name: "Offshore Wind Partnership",
    location: "Belgium Coast (shared)",
    capacity: "2 kW",
    price: 1100,
    return: 7.5,
    co2: 2.5,
    availability: "low",
    image: "💨",
  },
];

export default function OpportunitiesPage() {
  const location = useLocation();
  const recommendations = location.state?.recommendations;
  const totalInvestment = location.state?.totalInvestment || 5000;
  const loadProfileData = location.state?.loadProfileData;
  const profile = location.state?.profile;
  
  const [filter, setFilter] = useState<"all" | "solar" | "battery" | "wind">("all");
  const [selectedProjects, setSelectedProjects] = useState<number[]>([]);
  const [mode, setMode] = useState<"ai" | "manual">("ai");

  // AI pre-selects projects based on recommendations - ensures at least 2 projects per type
  const aiSelections = recommendations ? (() => {
    const selections: { projectId: number; amount: number }[] = [];
    
    // Allocate solar budget across 2 projects (1 and 4)
    const solarBudget = recommendations.solar.investment;
    const solar1Amount = Math.floor(solarBudget * 0.6 / 1250) * 1250; // 60% to project 1
    const solar4Amount = solarBudget - solar1Amount; // Remaining to project 4
    if (solar1Amount > 0) selections.push({ projectId: 1, amount: solar1Amount });
    if (solar4Amount > 0) selections.push({ projectId: 4, amount: solar4Amount });
    
    // Allocate battery budget across 2 projects (2 and 5)
    const batteryBudget = recommendations.battery.investment;
    const battery2Amount = Math.floor(batteryBudget * 0.5 / 750) * 750; // 50% to project 2
    const battery5Amount = batteryBudget - battery2Amount; // Remaining to project 5
    if (battery2Amount > 0) selections.push({ projectId: 2, amount: battery2Amount });
    if (battery5Amount > 0) selections.push({ projectId: 5, amount: battery5Amount });
    
    // Allocate wind budget across 2 projects (3 and 6)
    const windBudget = recommendations.wind.investment;
    const wind3Amount = Math.floor(windBudget * 0.6 / 850) * 850; // 60% to project 3
    const wind6Amount = windBudget - wind3Amount; // Remaining to project 6
    if (wind3Amount > 0) selections.push({ projectId: 3, amount: wind3Amount });
    if (wind6Amount > 0) selections.push({ projectId: 6, amount: wind6Amount });
    
    return selections;
  })() : [];

  const getAISelectedAmount = (projectId: number) => {
    return aiSelections.find(s => s.projectId === projectId)?.amount || 0;
  };

  const totalAIInvestment = aiSelections.reduce((sum, s) => sum + s.amount, 0);

  const filteredProjects = filter === "all" ? projects : projects.filter((p) => p.type === filter);

  const getIcon = (type: string) => {
    switch (type) {
      case "solar":
        return Sun;
      case "battery":
        return Battery;
      case "wind":
        return Wind;
      default:
        return Sun;
    }
  };

  const getAvailabilityBadge = (availability: string) => {
    switch (availability) {
      case "available":
        return <Badge className="bg-success">Available</Badge>;
      case "low":
        return <Badge variant="outline" className="border-accent text-accent">Low Availability</Badge>;
      case "waitlist":
        return <Badge variant="outline" className="border-muted-foreground text-muted-foreground">Waitlist</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Investment Opportunities</h1>
        <p className="text-muted-foreground">
          Browse available renewable energy projects and start investing today
        </p>
      </div>

      {/* AI Selection Summary */}
      {recommendations && (
        <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-1">Your personal portfolio</h3>
              </div>

              {/* Selected Projects Overview */}
              <div className="grid md:grid-cols-3 gap-4">
                {/* Solar Projects */}
                <div className="p-4 rounded-lg bg-card border">
                  <div className="flex items-center gap-2 mb-3">
                    <Sun className="w-5 h-5 text-accent" />
                    <span className="font-semibold">Solar Projects</span>
                  </div>
                  <div className="text-2xl font-bold text-primary mb-3">€{recommendations.solar.investment.toLocaleString()}</div>
                  <div className="space-y-2 text-sm">
                    {aiSelections
                      .filter(s => projects.find(p => p.id === s.projectId)?.type === 'solar')
                      .map(selection => {
                        const project = projects.find(p => p.id === selection.projectId);
                        return (
                          <div key={selection.projectId} className="flex justify-between items-center">
                            <span className="text-muted-foreground">{project?.name}</span>
                            <span className="font-medium">€{selection.amount.toLocaleString()}</span>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* Battery Storage */}
                <div className="p-4 rounded-lg bg-card border">
                  <div className="flex items-center gap-2 mb-3">
                    <Battery className="w-5 h-5 text-secondary" />
                    <span className="font-semibold">Battery Storage</span>
                  </div>
                  <div className="text-2xl font-bold text-primary mb-3">€{recommendations.battery.investment.toLocaleString()}</div>
                  <div className="space-y-2 text-sm">
                    {aiSelections
                      .filter(s => projects.find(p => p.id === s.projectId)?.type === 'battery')
                      .map(selection => {
                        const project = projects.find(p => p.id === selection.projectId);
                        return (
                          <div key={selection.projectId} className="flex justify-between items-center">
                            <span className="text-muted-foreground">{project?.name}</span>
                            <span className="font-medium">€{selection.amount.toLocaleString()}</span>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* Wind Energy */}
                <div className="p-4 rounded-lg bg-card border">
                  <div className="flex items-center gap-2 mb-3">
                    <Wind className="w-5 h-5 text-primary" />
                    <span className="font-semibold">Wind Energy</span>
                  </div>
                  <div className="text-2xl font-bold text-primary mb-3">€{recommendations.wind.investment.toLocaleString()}</div>
                  <div className="space-y-2 text-sm">
                    {aiSelections
                      .filter(s => projects.find(p => p.id === s.projectId)?.type === 'wind')
                      .map(selection => {
                        const project = projects.find(p => p.id === selection.projectId);
                        return (
                          <div key={selection.projectId} className="flex justify-between items-center">
                            <span className="text-muted-foreground">{project?.name}</span>
                            <span className="font-medium">€{selection.amount.toLocaleString()}</span>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Link to="/confirmation" state={{ aiSelections, totalInvestment: totalAIInvestment, recommendations, loadProfileData, profile }} className="flex-1">
                  <Button className="w-full bg-primary hover:bg-primary-dark">
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Proceed with personalized suggestion
                  </Button>
                </Link>
                <Button variant="outline" onClick={() => setMode("manual")}>
                  Customize Manually
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Filters - only show when in manual mode or no recommendations */}
      {(!recommendations || mode === "manual") && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Available Projects</h2>
          </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
          >
            All Projects
          </Button>
          <Button
            variant={filter === "solar" ? "default" : "outline"}
            onClick={() => setFilter("solar")}
          >
            <Sun className="w-4 h-4 mr-2" />
            Solar
          </Button>
          <Button
            variant={filter === "battery" ? "default" : "outline"}
            onClick={() => setFilter("battery")}
          >
            <Battery className="w-4 h-4 mr-2" />
            Battery
          </Button>
          <Button
            variant={filter === "wind" ? "default" : "outline"}
            onClick={() => setFilter("wind")}
          >
            <Wind className="w-4 h-4 mr-2" />
            Wind
          </Button>
          </div>
        </div>
      )}

      {/* Projects Grid - only show when in manual mode or no recommendations */}
      {(!recommendations || mode === "manual") && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => {
          const Icon = getIcon(project.type);
          const isAISelected = recommendations && getAISelectedAmount(project.id) > 0;
          return (
            <Card key={project.id} className={`overflow-hidden hover:shadow-lg transition-all group ${isAISelected ? 'ring-2 ring-primary' : ''}`}>
              {/* Project Image/Icon */}
              <div className="h-32 bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 flex items-center justify-center text-6xl relative">
                {project.image}
                {isAISelected && (
                  <div className="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    AI Pick
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold leading-tight">{project.name}</h3>
                    {getAvailabilityBadge(project.availability)}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{project.location}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Icon className="w-5 h-5 text-primary" />
                  <span className="font-medium">{project.capacity}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                  <div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                      <TrendingUp className="w-4 h-4" />
                      <span>Return</span>
                    </div>
                    <div className="font-bold text-primary">{project.return}%</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                      <Leaf className="w-4 h-4" />
                      <span>CO₂ Saved</span>
                    </div>
                    <div className="font-bold">{project.co2}t/year</div>
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm text-muted-foreground">Entry Price</span>
                    <span className="text-2xl font-bold text-primary">€{project.price}</span>
                  </div>

                  {isAISelected && (
                    <div className="p-2 bg-primary/10 rounded-lg text-sm text-center">
                      <span className="font-semibold text-primary">AI Allocated: €{getAISelectedAmount(project.id).toLocaleString()}</span>
                    </div>
                  )}

                  {project.availability === "waitlist" ? (
                    <Button variant="outline" className="w-full" disabled>
                      <Clock className="w-4 h-4 mr-2" />
                      Join Waitlist
                    </Button>
                  ) : (
                    <Link to="/confirmation" className="block">
                      <Button className="w-full bg-primary hover:bg-primary-dark group-hover:scale-105 transition-transform">
                        {isAISelected ? "Included in AI Selection" : "Invest Now"}
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
        </div>
      )}

      {/* Partnership Opportunities - only show when accessed directly (not from simulation) */}
      {!recommendations && (
        <div className="space-y-6 mt-16">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">Partnership Opportunities</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Beyond investing, we're looking for partners to expand renewable energy infrastructure
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8 space-y-6 hover:shadow-xl transition-all border-2 hover:border-accent">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">Land Owners</h3>
                <p className="text-muted-foreground">
                  Have land suitable for renewable energy projects? Partner with us to develop solar, wind, or battery installations.
                </p>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                  <span>Long-term sustainable land use</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                  <span>Recurring revenue opportunities</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                  <span>Contribute to renewable energy transition</span>
                </li>
              </ul>
              <Button size="lg" className="w-full" variant="outline">
                Learn More
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Card>
            <Card className="p-8 space-y-6 hover:shadow-xl transition-all border-2 hover:border-primary">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                <Handshake className="w-8 h-8 text-white" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">Cooperatives</h3>
                <p className="text-muted-foreground">
                  Propose your renewable energy projects and connect with investors. Find operational partners to bring your vision to life.
                </p>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span>Access to investment capital</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span>Strong operational partnerships</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span>Support from renewable energy experts</span>
                </li>
              </ul>
              <Button size="lg" className="w-full">
                Submit Project
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
