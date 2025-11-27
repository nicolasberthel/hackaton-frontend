import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Zap, Leaf, MapPin, TrendingUp, Award } from "lucide-react";
import LuxembourgMap from "@/components/LuxembourgMap";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function CommunityPage() {
  const [mapboxToken, setMapboxToken] = useState("");
  const communityStats = {
    totalInvestors: 12847,
    totalMW: 245.8,
    co2Avoided: 128500,
    projects: 67,
  };

  const topRegions = [
    { name: "Luxembourg", investors: 4521, mw: 89.2, co2: 45200 },
    { name: "Brussels", investors: 3214, mw: 68.5, co2: 34800 },
    { name: "Wallonia", investors: 2890, mw: 52.3, co2: 26500 },
    { name: "Flanders", investors: 2222, mw: 35.8, co2: 22000 },
  ];

  const milestones = [
    { year: 2024, title: "Community Launch", investors: 1000, mw: 15 },
    { year: 2024, title: "10K Investors", investors: 10000, mw: 180 },
    { year: 2024, title: "200 MW Funded", investors: 12500, mw: 200 },
    { year: 2025, title: "Goal: 500 MW", investors: 30000, mw: 500, upcoming: true },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Encevo Energy Investment Community</h1>
        <p className="text-muted-foreground">
          Join thousands of investors building a decentralized renewable energy future
        </p>
      </div>

      {/* Community Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="p-6 space-y-3 bg-gradient-primary text-white">
          <Users className="w-8 h-8" />
          <div>
            <div className="text-3xl font-bold">{communityStats.totalInvestors.toLocaleString()}</div>
            <div className="text-sm text-white/80">Active Investors</div>
          </div>
        </Card>

        <Card className="p-6 space-y-3 bg-gradient-secondary text-white">
          <Zap className="w-8 h-8" />
          <div>
            <div className="text-3xl font-bold">{communityStats.totalMW} MW</div>
            <div className="text-sm text-white/80">Total Capacity Funded</div>
          </div>
        </Card>

        <Card className="p-6 space-y-3 border-2 border-success">
          <Leaf className="w-8 h-8 text-success" />
          <div>
            <div className="text-3xl font-bold">{(communityStats.co2Avoided / 1000).toFixed(0)}k tons</div>
            <div className="text-sm text-muted-foreground">CO₂ Avoided Annually</div>
          </div>
        </Card>

        <Card className="p-6 space-y-3 border-2 border-primary">
          <TrendingUp className="w-8 h-8 text-primary" />
          <div>
            <div className="text-3xl font-bold">{communityStats.projects}</div>
            <div className="text-sm text-muted-foreground">Active Projects</div>
          </div>
        </Card>
      </div>

      {/* Map Visualization */}
      <Card className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Community by Region</h2>
          <MapPin className="w-6 h-6 text-primary" />
        </div>

        {/* Mapbox Token Input (temporary) */}
        {!mapboxToken && (
          <div className="space-y-2 p-4 bg-muted rounded-lg">
            <Label htmlFor="mapbox-token" className="text-sm font-medium">
              Enter your Mapbox Public Token
            </Label>
            <div className="flex gap-2">
              <Input
                id="mapbox-token"
                type="text"
                placeholder="pk.eyJ1..."
                value={mapboxToken}
                onChange={(e) => setMapboxToken(e.target.value)}
                className="flex-1"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Get your token at{" "}
              <a
                href="https://mapbox.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                mapbox.com
              </a>
            </p>
          </div>
        )}

        {/* Interactive Map */}
        <LuxembourgMap apiKey={mapboxToken} />

        {/* Regional Breakdown */}
        <div className="grid md:grid-cols-2 gap-4">
          {topRegions.map((region, index) => (
            <Card key={index} className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="font-bold text-primary">#{index + 1}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">{region.name}</h3>
                    <p className="text-sm text-muted-foreground">{region.investors.toLocaleString()} investors</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-6 text-sm">
                <div>
                  <div className="font-bold text-secondary">{region.mw} MW</div>
                  <div className="text-muted-foreground">Capacity</div>
                </div>
                <div>
                  <div className="font-bold text-success">{(region.co2 / 1000).toFixed(1)}k tons</div>
                  <div className="text-muted-foreground">CO₂ Saved</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {/* Your Contribution */}
      <Card className="p-8 space-y-6 bg-gradient-hero border-2 border-primary">
        <div className="flex items-center gap-3">
          <Award className="w-8 h-8 text-primary" />
          <h2 className="text-2xl font-bold">Your Contribution</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Your Investment</div>
            <div className="text-2xl font-bold">€5,000</div>
            <div className="text-sm text-primary">Top 15% of investors</div>
          </div>

          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Your Capacity Share</div>
            <div className="text-2xl font-bold">0.95 kW</div>
            <div className="text-sm text-secondary">0.4% of community total</div>
          </div>

          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Your CO₂ Impact</div>
            <div className="text-2xl font-bold">2.8 tons/year</div>
            <div className="text-sm text-success">Equivalent to 620 trees planted</div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            You're helping democratize energy and accelerate the transition to 100% renewable power.
          </p>
        </div>
      </Card>

      {/* Milestones */}
      <Card className="p-8 space-y-6">
        <h2 className="text-2xl font-bold">Community Milestones</h2>
        
        <div className="space-y-4">
          {milestones.map((milestone, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                milestone.upcoming ? 'bg-muted' : 'bg-gradient-primary'
              }`}>
                <span className={`font-bold ${milestone.upcoming ? 'text-muted-foreground' : 'text-white'}`}>
                  {milestone.year}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold">{milestone.title}</h3>
                  {milestone.upcoming && <Badge variant="outline">Upcoming</Badge>}
                </div>
                <div className="flex gap-6 text-sm text-muted-foreground">
                  <span>{milestone.investors.toLocaleString()} investors</span>
                  <span>{milestone.mw} MW capacity</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Call to Action */}
      <Card className="p-8 bg-gradient-primary text-white text-center">
        <h2 className="text-2xl font-bold mb-2">Invite Friends & Grow Together</h2>
        <p className="text-white/80 mb-6">
          Help us reach 500 MW by 2025. Every new investor brings us closer to 100% renewable energy.
        </p>
        <div className="flex gap-4 justify-center">
          <Badge className="bg-white text-primary hover:bg-white/90">Share on Social Media</Badge>
          <Badge className="bg-white text-primary hover:bg-white/90">Copy Referral Link</Badge>
        </div>
      </Card>
    </div>
  );
}
