import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TrendingUp, Shield, Leaf, LayoutDashboard, ArrowRight, Zap, Users, Award } from "lucide-react";

export default function HomePage() {
  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <div className="text-center space-y-6 py-12">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          Invest in the Energy of Tomorrow
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Democratize renewable energy. Invest in solar, wind, and battery storage—and track your real impact on the energy transition.
        </p>
      </div>

      {/* Two Journey Cards */}
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <Card className="p-8 space-y-6 hover:shadow-xl transition-all group border-2 hover:border-primary">
          <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">I Want to Get Started</h2>
            <p className="text-muted-foreground">
              New to energy investment? We'll guide you through understanding your needs, 
              getting personalized recommendations, and making your first investment.
            </p>
          </div>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span>Build your energy profile in 5 minutes</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span>Get AI-powered investment recommendations</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span>Browse available renewable projects</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span>Invest with confidence</span>
            </li>
          </ul>
          <Link to="/profile" className="block">
            <Button size="lg" className="w-full bg-gradient-primary group-hover:shadow-lg">
              Start Your Journey
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </Card>

        <Card className="p-8 space-y-6 hover:shadow-xl transition-all group border-2 hover:border-secondary">
          <div className="w-16 h-16 rounded-2xl bg-gradient-secondary flex items-center justify-center">
            <LayoutDashboard className="w-8 h-8 text-white" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">I Want to See What's Happening</h2>
            <p className="text-muted-foreground">
              Already investing? Track your portfolio performance, monitor your energy impact, 
              and discover AI-powered optimization opportunities.
            </p>
          </div>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
              <span>View real-time portfolio performance</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
              <span>Track consumption vs. production</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
              <span>See your environmental impact</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
              <span>Get continuous AI recommendations</span>
            </li>
          </ul>
          <Link to="/dashboard" className="block">
            <Button size="lg" className="w-full bg-gradient-secondary group-hover:shadow-lg">
              View Dashboard
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </Card>
      </div>

      {/* Platform Features */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Platform Features</h2>
        <div className="grid md:grid-cols-4 gap-6">
          <Card className="p-6 space-y-4 hover:shadow-lg transition-all border-2 hover:border-primary">
            <Zap className="w-10 h-10 text-primary" />
            <h3 className="text-lg font-semibold">AI Recommendations</h3>
            <p className="text-sm text-muted-foreground">
              Get personalized investment strategies powered by advanced AI analysis.
            </p>
          </Card>

          <Card className="p-6 space-y-4 hover:shadow-lg transition-all border-2 hover:border-secondary">
            <TrendingUp className="w-10 h-10 text-secondary" />
            <h3 className="text-lg font-semibold">Invoice Integration</h3>
            <p className="text-sm text-muted-foreground">
              Connect your Enovos invoice to see real savings and environmental impact.
            </p>
          </Card>

          <Card className="p-6 space-y-4 hover:shadow-lg transition-all border-2 hover:border-accent">
            <Users className="w-10 h-10 text-accent" />
            <h3 className="text-lg font-semibold">Energy Community</h3>
            <p className="text-sm text-muted-foreground">
              Join 12,000+ investors democratizing renewable energy together.
            </p>
          </Card>

          <Card className="p-6 space-y-4 hover:shadow-lg transition-all border-2 hover:border-success">
            <Award className="w-10 h-10 text-success" />
            <h3 className="text-lg font-semibold">Real-Time Tracking</h3>
            <p className="text-sm text-muted-foreground">
              Monitor portfolio performance and energy production live.
            </p>
          </Card>
        </div>
      </div>

      {/* Impact Stats */}
      <Card className="p-8 bg-gradient-hero border-2 border-primary">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-primary mb-2">12,847</div>
            <div className="text-muted-foreground">Active Investors</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-secondary mb-2">245.8 MW</div>
            <div className="text-muted-foreground">Renewable Capacity</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-success mb-2">128k tons</div>
            <div className="text-muted-foreground">CO₂ Avoided Annually</div>
          </div>
        </div>
      </Card>

      {/* CTA Section */}
      <Card className="p-12 bg-gradient-primary text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Energy Future?</h2>
        <p className="text-white/90 max-w-2xl mx-auto mb-8">
          Join thousands of investors who are already benefiting from renewable energy ownership while accelerating the transition to 100% clean energy.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/profile">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90">
              Get Started Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <Link to="/community">
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              Explore Community
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
