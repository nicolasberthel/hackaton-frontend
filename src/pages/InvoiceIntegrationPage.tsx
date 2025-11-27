import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileText, TrendingDown, Leaf, Zap, ArrowRight } from "lucide-react";

export default function InvoiceIntegrationPage() {
  const [invoiceUploaded, setInvoiceUploaded] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const handleUpload = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setInvoiceUploaded(true);
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Connect Your Enovos Invoice</h1>
        <p className="text-muted-foreground">
          Upload your energy bill to see personalized savings and impact from your investments
        </p>
      </div>

      {!invoiceUploaded ? (
        /* Upload Section */
        <Card className="p-8">
          <div className="space-y-6">
            <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-lg border-border hover:border-primary transition-all cursor-pointer">
              <Upload className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Upload Your Enovos Invoice</h3>
              <p className="text-sm text-muted-foreground mb-4">PDF, JPEG, or PNG (max 10MB)</p>
              <Button onClick={handleUpload} disabled={analyzing} className="bg-gradient-primary">
                {analyzing ? "Analyzing..." : "Select File"}
              </Button>
            </div>

            <div className="space-y-3">
              <Label>Or enter invoice number manually</Label>
              <div className="flex gap-2">
                <Input placeholder="Invoice #123456789" className="flex-1" />
                <Button variant="outline">Fetch</Button>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <FileText className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <p>
                  Your invoice data is encrypted and securely processed. We only analyze energy consumption 
                  to provide personalized recommendations.
                </p>
              </div>
            </div>
          </div>
        </Card>
      ) : (
        /* Results Section */
        <>
          {/* Before & After Comparison */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Before Investment</h3>
                <span className="text-xs text-muted-foreground">Last Invoice</span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-baseline">
                  <span className="text-muted-foreground">Monthly Cost</span>
                  <span className="text-2xl font-bold">€245</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Grid Dependency</span>
                  <span className="font-semibold">100%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">CO₂ Emissions</span>
                  <span className="font-semibold">285 kg/month</span>
                </div>
              </div>
            </Card>

            <Card className="p-6 space-y-4 border-2 border-primary bg-gradient-hero">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">With Your Portfolio</h3>
                <span className="text-xs text-primary">Projected</span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-baseline">
                  <span className="text-muted-foreground">Monthly Cost</span>
                  <span className="text-2xl font-bold text-primary">€98</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Grid Dependency</span>
                  <span className="font-semibold text-primary">35%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">CO₂ Emissions</span>
                  <span className="font-semibold text-success">85 kg/month</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Savings Breakdown */}
          <Card className="p-8 space-y-6">
            <h2 className="text-2xl font-bold">Your Impact</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-primary">
                  <TrendingDown className="w-5 h-5" />
                  <span className="text-sm font-medium">Monthly Savings</span>
                </div>
                <div className="text-3xl font-bold">€147</div>
                <p className="text-sm text-muted-foreground">60% reduction in energy costs</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-secondary">
                  <Zap className="w-5 h-5" />
                  <span className="text-sm font-medium">Energy Independence</span>
                </div>
                <div className="text-3xl font-bold">65%</div>
                <p className="text-sm text-muted-foreground">Covered by your investments</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-success">
                  <Leaf className="w-5 h-5" />
                  <span className="text-sm font-medium">CO₂ Avoided</span>
                </div>
                <div className="text-3xl font-bold">200kg</div>
                <p className="text-sm text-muted-foreground">Per month vs. grid energy</p>
              </div>
            </div>
          </Card>

          {/* Annual Projection */}
          <Card className="p-8 bg-gradient-primary text-white">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">Annual Impact</h3>
                <p className="text-white/80">Based on your current portfolio and consumption</p>
              </div>
              <div className="flex gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold">€1,764</div>
                  <div className="text-sm text-white/80">Savings/Year</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">2.4t</div>
                  <div className="text-sm text-white/80">CO₂ Avoided/Year</div>
                </div>
              </div>
            </div>
          </Card>

          {/* CTA */}
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => setInvoiceUploaded(false)}>
              Upload Different Invoice
            </Button>
            <Button className="bg-gradient-primary">
              Optimize My Portfolio
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
