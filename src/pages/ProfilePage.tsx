import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, Home, TrendingUp, Leaf, Shield, Info, FileText, Zap, CheckCircle2, Loader2 } from "lucide-react";
import { LoadingScreen } from "@/components/LoadingScreen";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { API_BASE_URL } from "@/config/api";

interface LoadCurveData {
  timestamp: string;
  value: string;
}

interface LoadCurveResponse {
  data: LoadCurveData[];
}

const fetchLoadCurve = async (podNumber: string): Promise<LoadCurveResponse> => {
  const response = await fetch(`${API_BASE_URL}/loadcurve/${podNumber}`);
  if (!response.ok) {
    throw new Error("Failed to fetch load curve data");
  }
  return response.json();
};

export default function ProfilePage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [dataMode, setDataMode] = useState<"pod" | "manual">("pod");
  const [lenedaMandate, setLenedaMandate] = useState(false);
  const [profile, setProfile] = useState({
    podNumber: "",
    consumption: 3500,
    housingType: "apartment",
    energyTariff: "fix-naturstroum",
    budget: 1000,
    riskAppetite: "moderate",
    objectives: [] as string[]
  });

  const totalSteps = 4;

  // Check if POD is complete (18 characters)
  const isPodComplete = profile.podNumber.length === 18;

  // Extract last 5 digits from POD for API call
  const podLast5Digits = isPodComplete ? profile.podNumber.slice(-5) : "";

  // Fetch load curve data when POD is complete
  const { data: loadCurveData, isLoading: isLoadingChart, error: chartError } = useQuery({
    queryKey: ["loadcurve", podLast5Digits],
    queryFn: () => fetchLoadCurve(podLast5Digits),
    enabled: isPodComplete && dataMode === "pod",
  });

  // Transform data for chart
  const chartData = loadCurveData?.data.map((item) => ({
    timestamp: new Date(item.timestamp).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
    }),
    value: parseFloat(item.value),
  })) || [];

  // Check if user can continue from step 1
  const canContinueFromStep1 = 
    dataMode === "manual" || (dataMode === "pod" && isPodComplete && lenedaMandate);

  const handleContinue = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Show loading screen before navigating to recommendations
      setIsLoading(true);
    }
  };

  const handleLoadingComplete = () => {
    navigate("/recommendations", {
      state: {
        profile
      }
    });
  };

  // Show loading screen overlay
  if (isLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} useLeneda={dataMode === "pod"} />;
  }
  const toggleObjective = (objective: string) => {
    setProfile(prev => ({
      ...prev,
      objectives: prev.objectives.includes(objective) ? prev.objectives.filter(o => o !== objective) : [...prev.objectives, objective]
    }));
  };

  return <div className="max-w-3xl mx-auto space-y-8 pb-20">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Step {step} of {totalSteps}</span>
          <span>{Math.round(step / totalSteps * 100)}% Complete</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500" style={{
          width: `${step / totalSteps * 100}%`
        }} />
        </div>
      </div>

      {/* Step 1: Energy Consumption */}
      {step === 1 && <Card className="p-8 space-y-6 animate-fade-in">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Energy Profile</h2>
            <p className="text-muted-foreground">Help us understand your energy needs</p>
          </div>

          {/* Data Mode Selection */}
          <div className="space-y-4">
            <Label className="text-base">How would you like to proceed?</Label>
            <RadioGroup 
              value={dataMode} 
              onValueChange={(value: "pod" | "manual") => {
                setDataMode(value);
                // Reset leneda mandate when switching modes
                setLenedaMandate(false);
              }}
            >
              <div className="grid md:grid-cols-2 gap-4">
                <label className="flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all hover:border-primary has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                  <RadioGroupItem value="pod" className="mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="w-5 h-5 text-primary" />
                      <span className="font-semibold">Use POD Number</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Validate with real data via Leneda</p>
                  </div>
                </label>
                <label className="flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all hover:border-primary has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                  <RadioGroupItem value="manual" className="mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="w-5 h-5 text-accent" />
                      <span className="font-semibold">Manual Entry</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Run simulation with estimated data</p>
                  </div>
                </label>
              </div>
            </RadioGroup>
          </div>

          {/* POD Number Section - Only shown when POD mode is selected */}
          {dataMode === "pod" && <div className="space-y-4 animate-fade-in">
              <div className="space-y-2">
                <Label htmlFor="podNumber" className="text-base">POD Number (Point of Delivery)</Label>
                <Input id="podNumber" type="text" placeholder="LU0000000000000000" value={profile.podNumber} onChange={e => setProfile({
            ...profile,
            podNumber: e.target.value.toUpperCase()
          })} maxLength={18} className="font-mono" />
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Info className="w-4 h-4" />
                  <span>Find this 18-character code on your Enovos invoice</span>
                </div>
                {profile.podNumber && !profile.podNumber.startsWith("LU") && profile.podNumber.length > 0 && <p className="text-sm text-amber-600 flex items-center gap-1">
                    <Info className="w-4 h-4" />
                    POD numbers typically start with "LU"
                  </p>}
              </div>

              {/* Educational Info Card */}
              <div className="bg-muted/50 rounded-lg p-4 space-y-2 border border-border/50">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <FileText className="w-4 h-4 text-primary" />
                  <span>What is a POD number?</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Your Point of Delivery (POD) is a unique identifier for your electricity meter. 
                  It helps us validate your energy data via Leneda and enables invoice integration 
                  to show your energy savings and CO₂ impact.
                </p>
              </div>

              {/* Leneda Mandate Checkbox - Only shown when POD is complete */}
              {isPodComplete && (
                <div className="space-y-4 animate-fade-in border-t pt-4">
                  <div className="flex items-start gap-3 p-4 rounded-lg border-2 border-primary/20 bg-primary/5">
                    <Checkbox 
                      id="leneda-mandate" 
                      checked={lenedaMandate}
                      onCheckedChange={(checked) => setLenedaMandate(checked as boolean)}
                      className="mt-0.5"
                    />
                    <div className="flex-1 space-y-1">
                      <Label 
                        htmlFor="leneda-mandate" 
                        className="text-sm font-medium cursor-pointer flex items-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                        Provide Leneda mandate
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        I authorize access to my energy data via Leneda for personalized investment recommendations
                      </p>
                    </div>
                  </div>

                  {!lenedaMandate && (
                    <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 animate-fade-in">
                      <p className="text-sm text-amber-800 dark:text-amber-200 flex items-start gap-2">
                        <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>
                          Please provide the Leneda mandate to continue, or switch to <strong>Manual Entry</strong> to proceed without POD validation.
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              )}

            </div>}

          {/* Manual Consumption Section - Only shown when Manual mode is selected */}
          {dataMode === "manual" && <div className="space-y-4 animate-fade-in">
              <div className="space-y-2">
                <Label className="text-base">Annual Energy Consumption</Label>
                <p className="text-sm text-muted-foreground">How much energy do you consume per year?</p>
              </div>

              <div className="space-y-4">
                <div className="text-4xl font-bold text-primary">{profile.consumption.toLocaleString()} kWh</div>
                <Slider value={[profile.consumption]} onValueChange={([value]) => setProfile({
            ...profile,
            consumption: value
          })} min={1000} max={10000} step={100} className="py-4" />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>1,000 kWh</span>
                  <span>10,000 kWh</span>
                </div>
              </div>

              <div className="pt-2">
                <p className="text-sm text-muted-foreground">
                  💡 Average household: ~3,500 kWh/year
                </p>
              </div>
            </div>}
        </Card>}

      {/* Step 2: Housing Type & Energy Tariff */}
      {step === 2 && <Card className="p-8 space-y-6 animate-fade-in">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Housing & Energy Details</h2>
            <p className="text-muted-foreground">Tell us about your property and energy plan</p>
          </div>

          {/* Housing Type */}
          <div className="space-y-4">
            <Label className="text-base">Housing Type</Label>
            <RadioGroup value={profile.housingType} onValueChange={value => setProfile({
          ...profile,
          housingType: value
        })}>
              <div className="grid md:grid-cols-2 gap-4">
                {[{
              value: "apartment",
              label: "Apartment",
              icon: Home,
              description: "Multi-unit building"
            }, {
              value: "house",
              label: "House",
              icon: Home,
              description: "Single-family home"
            }, {
              value: "townhouse",
              label: "Townhouse",
              icon: Home,
              description: "Attached home"
            }, {
              value: "other",
              label: "Other",
              icon: Home,
              description: "Other property type"
            }].map(option => <label key={option.value} className="flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all hover:border-primary has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                    <RadioGroupItem value={option.value} className="mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <option.icon className="w-5 h-5 text-primary" />
                        <span className="font-semibold">{option.label}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                    </div>
                  </label>)}
              </div>
            </RadioGroup>
          </div>

          {/* Consumption Chart - Only shown when POD mode was used */}
          {dataMode === "pod" && profile.podNumber.length === 18 && (
            <div className="space-y-4 animate-fade-in border-t pt-6">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Your Energy Consumption
                </h3>
                <p className="text-sm text-muted-foreground">
                  POD: {profile.podNumber} (Last 5 digits: {profile.podNumber.slice(-5)})
                </p>
              </div>

              <div className="bg-card rounded-lg border p-4">
                {isLoadingChart && (
                  <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                )}

                {chartError && (
                  <div className="flex items-center justify-center h-64 text-red-500">
                    <div className="text-center">
                      <Info className="w-8 h-8 mx-auto mb-2" />
                      <p>Unable to load consumption data</p>
                    </div>
                  </div>
                )}

                {loadCurveData && !isLoadingChart && (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="timestamp" 
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis 
                        label={{ value: "kWh", angle: -90, position: "insideLeft" }}
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#8884d8" 
                        name="Consumption (kWh)"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          )}

          {/* Energy Tariff */}
          <div className="space-y-4 border-t pt-6">
            <div className="space-y-2">
              <Label htmlFor="energy-tariff" className="text-base flex items-center gap-2">
                <Zap className="w-5 h-5 text-accent" />
                Current Energy Tariff
              </Label>
              <p className="text-sm text-muted-foreground">Select your current plan</p>
            </div>
            
            <Select value={profile.energyTariff} onValueChange={value => setProfile({
          ...profile,
          energyTariff: value
        })}>
              <SelectTrigger id="energy-tariff" className="w-full">
                <SelectValue placeholder="Select your tariff" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fix-naturstroum">Fix Naturstroum</SelectItem>
                <SelectItem value="dynamic-naturstroum">Dynamic Naturstroum</SelectItem>
                <SelectItem value="naturstroum-drive">Naturstroum Drive</SelectItem>
              </SelectContent>
            </Select>

            {/* Calculix Info */}
            <div className="bg-muted/50 rounded-lg p-4 space-y-2 border border-border/50">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Info className="w-4 h-4 text-accent" />
                <span>Tariff Data Integration</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We will retrieve your tariff data from Calculix and take this into consideration 
                for computing your personalized investment recommendations and estimated returns.
              </p>
            </div>
          </div>
        </Card>}

      {/* Step 3: Budget */}
      {step === 3 && <Card className="p-8 space-y-6 animate-fade-in">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Investment Budget</h2>
            <p className="text-muted-foreground">How much would you like to invest?</p>
          </div>

          <div className="space-y-4">
            <Label>Investment Budget (€)</Label>
            <div className="text-4xl font-bold text-primary">€{profile.budget.toLocaleString()}</div>
            <Slider value={[profile.budget]} onValueChange={([value]) => setProfile({
          ...profile,
          budget: value
        })} min={250} max={50000} step={250} className="py-4" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>€250</span>
              <span>€50,000</span>
            </div>
          </div>
        </Card>}

      {/* Step 4: Objectives & Risk */}
      {step === 4 && <Card className="p-8 space-y-6 animate-fade-in">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Investment Objectives</h2>
            <p className="text-muted-foreground">What are your main goals? (Select all that apply)</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {[{
          id: "savings",
          label: "Reduce Energy Costs",
          icon: TrendingUp,
          color: "text-primary"
        }, {
          id: "returns",
          label: "Maximize Returns",
          icon: TrendingUp,
          color: "text-accent"
        }, {
          id: "co2",
          label: "Reduce CO₂",
          icon: Leaf,
          color: "text-secondary"
        }, {
          id: "autonomy",
          label: "Energy Independence",
          icon: Shield,
          color: "text-success"
        }].map(objective => <button key={objective.id} onClick={() => toggleObjective(objective.id)} className={`p-6 rounded-lg border-2 transition-all text-left ${profile.objectives.includes(objective.id) ? "border-primary bg-primary/5 shadow-md" : "border-border hover:border-primary/50"}`}>
                <div className="flex items-start gap-3">
                  <objective.icon className={`w-6 h-6 ${objective.color}`} />
                  <div className="flex-1">
                    <div className="font-semibold">{objective.label}</div>
                  </div>
                  {profile.objectives.includes(objective.id) && <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm">
                      ✓
                    </div>}
                </div>
              </button>)}
          </div>

          <div className="border-t pt-6 space-y-4">
            <div className="space-y-2">
              <Label className="text-base">Risk Appetite</Label>
              <p className="text-sm text-muted-foreground">What level of risk are you comfortable with?</p>
            </div>
            <RadioGroup value={profile.riskAppetite} onValueChange={value => setProfile({
          ...profile,
          riskAppetite: value
        })}>
              <div className="space-y-3">
                {[{
              value: "conservative",
              label: "Conservative",
              description: "You prefer renewable projects that are already operating and provide steady, predictable income with very low risk."
            }, {
              value: "moderate",
              label: "Moderate",
              description: "Balance between risk and return"
            }, {
              value: "aggressive",
              label: "Aggressive",
              description: "Higher risk for potentially higher returns"
            }].map(option => <label key={option.value} className="flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all hover:border-primary has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                    <RadioGroupItem value={option.value} className="mt-1" />
                    <div className="flex-1">
                      <div className="font-semibold mb-1">{option.label}</div>
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                    </div>
                  </label>)}
              </div>
            </RadioGroup>
          </div>
        </Card>}

      {/* Navigation */}
      <div className="flex justify-between">
        {step > 1 && <Button variant="outline" onClick={() => setStep(step - 1)}>
            Back
          </Button>}
        <Button 
          onClick={handleContinue} 
          className="ml-auto bg-primary hover:bg-primary-dark"
          disabled={step === 1 && !canContinueFromStep1}
        >
          {step === totalSteps ? "View Recommendations" : "Continue"}
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </div>;
}