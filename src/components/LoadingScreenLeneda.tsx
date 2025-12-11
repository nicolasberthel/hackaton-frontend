import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Sparkles, Database, Calculator, CheckCircle } from "lucide-react";

interface LoadingScreenLenedaProps {
  onComplete: () => void;
}

export function LoadingScreenLeneda({ onComplete }: LoadingScreenLenedaProps) {
  const [currentStep, setCurrentStep] = useState(0);

  // Different steps based on whether Leneda is used
  const steps = [
    {
      icon: Database,
      text: "Fetching Leneda data",
      duration: 1000,
    },
    {
      icon: Calculator,
      text: "Computing consumption",
      duration: 1000,
    },
    {
      icon: CheckCircle,
      text: "Finalizing recommendations",
      duration: 1000,
    },
  ]

  useEffect(() => {
    if (currentStep < steps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, steps[currentStep].duration);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        onComplete();
      }, steps[currentStep].duration);
      return () => clearTimeout(timer);
    }
  }, [currentStep, onComplete]);

  const CurrentIcon = steps[currentStep].icon;

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center">
      <Card className="max-w-md w-full mx-4 p-12 space-y-8 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 border-2">
        {/* Animated Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center animate-pulse">
              <CurrentIcon className="w-12 h-12 text-primary animate-scale-in" />
            </div>
            <div className="absolute -top-2 -right-2">
              <Sparkles className="w-6 h-6 text-accent animate-pulse" />
            </div>
          </div>
        </div>

        {/* Progress Text */}
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold animate-fade-in">
            {steps[currentStep].text}
          </h2>
          <div className="flex justify-center gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  index <= currentStep
                    ? "w-12 bg-primary"
                    : "w-8 bg-muted"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Loading Bar */}
        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary via-accent to-secondary rounded-full transition-all duration-500 animate-pulse"
            style={{
              width: `${((currentStep + 1) / steps.length) * 100}%`,
            }}
          />
        </div>

        {/* Status Text */}
        <p className="text-center text-sm text-muted-foreground animate-fade-in">
          Please wait while we are fetching your data...
        </p>
      </Card>
    </div>
  );
}
