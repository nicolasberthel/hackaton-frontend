import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  TrendingUp,
  TrendingDown,
  Sun,
  Wind,
  Battery,
  Calendar,
  Loader2,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  Plus,
  Minus,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Info,
  ShoppingCart,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend, ComposedChart, Line, Area } from "recharts";
import { format } from "date-fns";
import { usePortfolio } from "@/hooks/usePortfolio";
import { API_BASE_URL } from "@/config/api";
import { toast } from "sonner";

interface Project {
  id: string;
  name: string;
  status: string;
  shares: {
    available: number;
    price: number;
  };
  forecast?: {
    co2_savings_per_share?: number;
  };
}

const fetchProjects = async (): Promise<Project[]> => {
  const response = await fetch(`${API_BASE_URL}/projects`);
  if (!response.ok) {
    throw new Error(`Failed to fetch projects: ${response.status}`);
  }
  const data = await response.json();
  return Array.isArray(data) ? data : [];
};

// Energy chart data fetching
interface LoadCurveData {
  timestamp: string;
  value: string;
}

interface LoadCurveResponse {
  data: LoadCurveData[];
}

const formatDateForAPI = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

const fetchLoadCurveByDate = async (podNumber: string, date: Date): Promise<LoadCurveResponse> => {
  const url = `${API_BASE_URL}/loadcurve/${podNumber}?date=${formatDateForAPI(date)}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch load curve data");
  return response.json();
};

const fetchLoadCurveByDateRange = async (
  podNumber: string,
  fromDate: Date,
  toDate: Date,
  pageSize: number = 1000
): Promise<LoadCurveResponse> => {
  const url = `${API_BASE_URL}/loadcurve/${podNumber}?from_date=${formatDateForAPI(fromDate)}&to_date=${formatDateForAPI(toDate)}&page_size=${pageSize}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch load curve data");
  return response.json();
};

const fetchLoadCurveMonthly = async (podNumber: string, year: number): Promise<LoadCurveResponse> => {
  const url = `${API_BASE_URL}/loadcurve/${podNumber}/monthly?year=${year}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch monthly load curve data");
  const result = await response.json();
  return Array.isArray(result) ? { data: result } : result;
};

const fetchProductionByDate = async (projectId: string, date: Date): Promise<LoadCurveResponse> => {
  const url = `${API_BASE_URL}/projects/${projectId}/production?date=${formatDateForAPI(date)}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch production data");
  return response.json();
};

const fetchProductionByDateRange = async (
  projectId: string,
  fromDate: Date,
  toDate: Date,
  pageSize: number = 1000
): Promise<LoadCurveResponse> => {
  const url = `${API_BASE_URL}/projects/${projectId}/production?from_date=${formatDateForAPI(fromDate)}&to_date=${formatDateForAPI(toDate)}&page_size=${pageSize}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch production data");
  return response.json();
};

const fetchProductionMonthly = async (projectId: string, year: number): Promise<LoadCurveResponse> => {
  const url = `${API_BASE_URL}/projects/${projectId}/production/monthly?year=${year}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch monthly production data");
  const result = await response.json();
  return Array.isArray(result) ? { data: result } : result;
};

const fetchProductionDaily = async (projectId: string, year: number, month: number): Promise<LoadCurveResponse> => {
  const url = `${API_BASE_URL}/projects/${projectId}/production/daily?year=${year}&month=${month}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch daily production data");
  const result = await response.json();
  return Array.isArray(result) ? { data: result } : result;
};

const fetchLoadCurveDaily = async (podNumber: string, year: number, month: number): Promise<LoadCurveResponse> => {
  const url = `${API_BASE_URL}/loadcurve/${podNumber}/daily?year=${year}&month=${month}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch daily load curve data");
  const result = await response.json();
  return Array.isArray(result) ? { data: result } : result;
};

export default function PortfolioPage() {
  const { userId } = useUser();
  const [activeTab, setActiveTab] = useState<"overview" | "history">("overview");
  const [buyDialogOpen, setBuyDialogOpen] = useState(false);
  const [sellDialogOpen, setSellDialogOpen] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState<any>(null);
  const [buyQuantity, setBuyQuantity] = useState(1);
  const [sellQuantity, setSellQuantity] = useState(1);
  
  // Energy chart state
  type TimePeriod = "day" | "week" | "month" | "year";
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("day");
  const [selectedDate, setSelectedDate] = useState(new Date(2025, 10, 12));
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState([
    {
      id: 1,
      type: "increase",
      message: "Consider increasing battery storage by 15% to optimize energy autonomy",
      priority: "medium",
      cost: 320,
    },
    {
      id: 2,
      type: "opportunity",
      message: "New solar project available matching your profile - 8.2% expected return",
      priority: "high",
      cost: 450,
    },
    {
      id: 3,
      type: "optimize",
      message: "Your wind energy allocation could be increased for better diversification",
      priority: "low",
      cost: 280,
    },
  ]);
  
  const { data: portfolio, isLoading, error } = usePortfolio(userId);
  const { data: projects } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  const getEnergyIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "solar":
        return Sun;
      case "wind":
        return Wind;
      case "battery":
        return Battery;
      default:
        return Sun;
    }
  };

  const getEnergyColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "solar":
        return "text-yellow-500";
      case "wind":
        return "text-blue-500";
      case "battery":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  const isProjectOpen = (projectId: string): boolean => {
    const project = projects?.find(p => p.id === projectId);
    if (!project) return false;
    const status = project.status.toLowerCase();
    return (status === "open" || status === "available" || status === "active") && project.shares.available > 0;
  };

  const getCurrentPrice = (projectId: string): number => {
    const project = projects?.find(p => p.id === projectId);
    return project?.shares.price || 0;
  };

  const handleBuyClick = (investment: any) => {
    setSelectedInvestment(investment);
    setBuyQuantity(1);
    setBuyDialogOpen(true);
  };

  const handleSellClick = (investment: any) => {
    setSelectedInvestment(investment);
    setSellQuantity(1);
    setSellDialogOpen(true);
  };

  const handleBuyConfirm = () => {
    toast.success(`Order placed: Buy ${buyQuantity} shares of ${selectedInvestment.project_name}`);
    setBuyDialogOpen(false);
  };

  const handleSellConfirm = () => {
    toast.success(`Order placed: Sell ${sellQuantity} shares of ${selectedInvestment.project_name}`);
    setSellDialogOpen(false);
  };

  // Energy chart helper functions
  const getDateRange = (date: Date, period: typeof timePeriod): { fromDate: Date; toDate: Date } => {
    const fromDate = new Date(date);
    const toDate = new Date(date);

    switch (period) {
      case "day":
        fromDate.setHours(0, 0, 0, 0);
        toDate.setHours(23, 59, 59, 999);
        break;
      case "week":
        const dayOfWeek = fromDate.getDay();
        const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        fromDate.setDate(fromDate.getDate() + diff);
        fromDate.setHours(0, 0, 0, 0);
        toDate.setDate(fromDate.getDate() + 6);
        toDate.setHours(23, 59, 59, 999);
        break;
      case "month":
        fromDate.setDate(1);
        fromDate.setHours(0, 0, 0, 0);
        toDate.setMonth(toDate.getMonth() + 1, 0);
        toDate.setHours(23, 59, 59, 999);
        break;
      case "year":
        fromDate.setMonth(0, 1);
        fromDate.setHours(0, 0, 0, 0);
        toDate.setMonth(11, 31);
        toDate.setHours(23, 59, 59, 999);
        break;
    }

    return { fromDate, toDate };
  };

  const getWeekNumber = (date: Date): number => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  };

  const getActualDateLabel = (data: LoadCurveData[] | undefined, period: typeof timePeriod): string => {
    if (!data || data.length === 0) return "No data";

    const firstDate = new Date(data[0].timestamp);

    switch (period) {
      case "day":
        return firstDate.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric",
        });
      case "week":
        const weekNum = getWeekNumber(firstDate);
        return `Week ${weekNum}, ${firstDate.getFullYear()}`;
      case "month":
        return firstDate.toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        });
      case "year":
        return firstDate.getFullYear().toString();
      default:
        return firstDate.toLocaleDateString();
    }
  };

  const navigatePeriod = (direction: "prev" | "next") => {
    const newDate = new Date(selectedDate);
    const multiplier = direction === "prev" ? -1 : 1;

    switch (timePeriod) {
      case "day":
        newDate.setDate(newDate.getDate() + multiplier);
        break;
      case "week":
        newDate.setDate(newDate.getDate() + 7 * multiplier);
        break;
      case "month":
        newDate.setMonth(newDate.getMonth() + multiplier);
        break;
      case "year":
        newDate.setFullYear(newDate.getFullYear() + multiplier);
        break;
    }

    setSelectedDate(newDate);
  };

  // Fetch load curve data
  const { data: rawLoadCurveData, isLoading: isLoadingChart, error: chartError } = useQuery({
    queryKey: ["loadcurve", portfolio?.pod_id, selectedDate, timePeriod],
    queryFn: async () => {
      if (!portfolio?.pod_id) return null;
      
      if (timePeriod === "year") {
        return fetchLoadCurveMonthly(portfolio.pod_id, selectedDate.getFullYear());
      }
      
      const { fromDate, toDate } = getDateRange(selectedDate, timePeriod);
      
      if (timePeriod === "day") {
        return fetchLoadCurveByDate(portfolio.pod_id, selectedDate);
      } else if (timePeriod === "week") {
        return fetchLoadCurveByDateRange(portfolio.pod_id, fromDate, toDate, 1000);
      } else if (timePeriod === "month") {
        // Use daily aggregation for month view
        return fetchLoadCurveDaily(portfolio.pod_id, selectedDate.getFullYear(), selectedDate.getMonth() + 1);
      }
      
      return null;
    },
    enabled: !!portfolio?.pod_id,
  });

  const loadCurveData = rawLoadCurveData;

  // Get solar and wind investments
  const solarInvestments = portfolio?.investments.filter(inv => inv.energy_type.toLowerCase() === "solar") || [];
  const windInvestments = portfolio?.investments.filter(inv => inv.energy_type.toLowerCase() === "wind") || [];

  // Helper function to fetch production data for investments
  const fetchInvestmentProduction = async (investments: typeof solarInvestments) => {
    if (investments.length === 0) return [];

    const { fromDate, toDate } = getDateRange(selectedDate, timePeriod);

    const productionPromises = investments.map(async (investment) => {
      try {
        let productionData;
        
        if (timePeriod === "year") {
          productionData = await fetchProductionMonthly(investment.project_id, selectedDate.getFullYear());
        } else if (timePeriod === "day") {
          productionData = await fetchProductionByDate(investment.project_id, selectedDate);
        } else if (timePeriod === "week") {
          productionData = await fetchProductionByDateRange(investment.project_id, fromDate, toDate, 1000);
        } else if (timePeriod === "month") {
          // Use daily aggregation for month view
          productionData = await fetchProductionDaily(investment.project_id, selectedDate.getFullYear(), selectedDate.getMonth() + 1);
        }

        return {
          projectId: investment.project_id,
          shares: investment.shares,
          data: productionData.data,
        };
      } catch (error) {
        console.error(`Failed to fetch production for ${investment.project_id}:`, error);
        return {
          projectId: investment.project_id,
          shares: investment.shares,
          data: [],
        };
      }
    });

    return Promise.all(productionPromises);
  };

  // Fetch production data for all solar assets
  const solarProductionQueries = useQuery({
    queryKey: ["solar-production", solarInvestments.map(inv => inv.project_id), selectedDate, timePeriod],
    queryFn: () => fetchInvestmentProduction(solarInvestments),
    enabled: solarInvestments.length > 0 && !!portfolio,
  });

  // Fetch production data for all wind assets
  const windProductionQueries = useQuery({
    queryKey: ["wind-production", windInvestments.map(inv => inv.project_id), selectedDate, timePeriod],
    queryFn: () => fetchInvestmentProduction(windInvestments),
    enabled: windInvestments.length > 0 && !!portfolio,
  });

  // Helper function to calculate shares owned at a given timestamp based on transaction history
  const getSharesOwnedAtTime = (investment: any, timestamp: Date): number => {
    if (!investment.transaction_history) return 0;
    
    let sharesOwned = 0;
    
    // Process transactions chronologically up to the given timestamp
    for (const transaction of investment.transaction_history) {
      const transactionDate = new Date(transaction.date);
      
      // Only process transactions that occurred before or at the timestamp
      if (transactionDate <= timestamp) {
        if (transaction.direction === "buy") {
          sharesOwned += transaction.shares;
        } else if (transaction.direction === "sell") {
          sharesOwned -= transaction.shares;
        }
      }
    }
    
    return Math.max(0, sharesOwned); // Ensure non-negative
  };

  // Combine consumption and production data
  const consumptionChartData = React.useMemo(() => {
    if (!loadCurveData?.data) return [];

    const dataMap = new Map<string, { timestamp: string; Consumption: number; Solar: number; Wind: number }>();

    // Add consumption data
    loadCurveData.data.forEach(item => {
      const timestamp = new Date(item.timestamp).toISOString();
      dataMap.set(timestamp, {
        timestamp,
        Consumption: parseFloat(item.value),
        Solar: 0,
        Wind: 0,
      });
    });

    // Add solar production data (scaled by number of shares owned at that time)
    if (solarProductionQueries.data && portfolio) {
      solarProductionQueries.data.forEach(({ projectId, shares, data }) => {
        const investment = portfolio.investments.find(inv => inv.project_id === projectId);
        if (!investment) return;

        data.forEach(item => {
          const itemTimestamp = new Date(item.timestamp);
          const timestamp = itemTimestamp.toISOString();
          const existing = dataMap.get(timestamp);
          if (existing) {
            // Only add production if shares were owned at this time
            const sharesOwned = getSharesOwnedAtTime(investment, itemTimestamp);
            if (sharesOwned > 0) {
              existing.Solar += parseFloat(item.value) * sharesOwned;
            }
          }
        });
      });
    }

    // Add wind production data (scaled by number of shares owned at that time)
    if (windProductionQueries.data && portfolio) {
      windProductionQueries.data.forEach(({ projectId, shares, data }) => {
        const investment = portfolio.investments.find(inv => inv.project_id === projectId);
        if (!investment) return;

        data.forEach(item => {
          const itemTimestamp = new Date(item.timestamp);
          const timestamp = itemTimestamp.toISOString();
          const existing = dataMap.get(timestamp);
          if (existing) {
            // Only add production if shares were owned at this time
            const sharesOwned = getSharesOwnedAtTime(investment, itemTimestamp);
            if (sharesOwned > 0) {
              existing.Wind += parseFloat(item.value) * sharesOwned;
            }
          }
        });
      });
    }

    // Convert map to array and sort by timestamp
    return Array.from(dataMap.values())
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      .map(item => ({
        timestamp: new Date(item.timestamp).toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          hour: timePeriod === "day" ? "numeric" : undefined,
        }),
        Consumption: item.Consumption,
        Solar: item.Solar,
        Wind: item.Wind,
      }));
  }, [loadCurveData, solarProductionQueries.data, windProductionQueries.data, timePeriod, portfolio]);

  // Get transaction markers (buy/sell) within the visible date range
  const transactionMarkers = React.useMemo(() => {
    if (!portfolio?.investments) return [];

    const { fromDate, toDate } = getDateRange(selectedDate, timePeriod);
    
    const allTransactions: Array<{
      date: Date;
      projectName: string;
      shares: number;
      type: 'buy' | 'sell';
      pricePerShare: number;
    }> = [];
    
    // Collect all transactions from all investments
    portfolio.investments.forEach(inv => {
      if (inv.transaction_history) {
        inv.transaction_history.forEach(transaction => {
          const transactionDate = new Date(transaction.date);
          if (transactionDate >= fromDate && transactionDate <= toDate) {
            allTransactions.push({
              date: transactionDate,
              projectName: inv.project_name,
              shares: transaction.shares,
              type: transaction.direction,
              pricePerShare: transaction.price_per_share,
            });
          }
        });
      }
    });
    
    return allTransactions.sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [portfolio, selectedDate, timePeriod]);

  const handleAcceptRecommendation = (id: number, message: string, cost: number) => {
    toast.success(`Recommendation accepted! ${message} (€${cost})`, {
      description: "This optimization will be applied to your portfolio",
    });
    setAiRecommendations(aiRecommendations.filter(rec => rec.id !== id));
  };

  const handleRejectRecommendation = (id: number) => {
    toast.info("Recommendation dismissed");
    setAiRecommendations(aiRecommendations.filter(rec => rec.id !== id));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <Card className="p-8 max-w-2xl mx-auto mt-8">
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-red-500" />
          <div>
            <h3 className="text-lg font-semibold">Failed to load portfolio</h3>
            <p className="text-muted-foreground">
              {error?.message || "Unknown error"}
            </p>
          </div>
        </div>
      </Card>
    );
  }

  const isPositive = portfolio.summary.total_gain_loss >= 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Portfolio</h1>
        <p className="text-muted-foreground">Welcome back, {portfolio.user_name}</p>
      </div>

      {/* Total Value Card - Trade Republic Style */}
      <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total Value</span>
            <Badge variant="outline" className="gap-1">
              <PieChart className="w-3 h-3" />
              {portfolio.summary.total_projects} Projects
            </Badge>
          </div>
          
          <div className="space-y-2">
            <div className="text-4xl font-bold">
              €{portfolio.summary.current_value.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            
            <div className="flex items-center gap-2">
              {isPositive ? (
                <ArrowUpRight className="w-5 h-5 text-green-500" />
              ) : (
                <ArrowDownRight className="w-5 h-5 text-red-500" />
              )}
              <span
                className={`text-lg font-semibold ${
                  isPositive ? "text-green-500" : "text-red-500"
                }`}
              >
                {isPositive ? "+" : ""}€
                {portfolio.summary.total_gain_loss.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
              <span
                className={`text-sm ${
                  isPositive ? "text-green-500" : "text-red-500"
                }`}
              >
                ({isPositive ? "+" : ""}
                {portfolio.summary.total_gain_loss_percentage.toFixed(2)}%)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 pt-4 border-t">
            <div>
              <div className="text-xs text-muted-foreground">Invested</div>
              <div className="text-sm font-semibold">
                €{portfolio.summary.total_investment.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Shares</div>
              <div className="text-sm font-semibold">
                {portfolio.summary.total_shares}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Production</div>
              <div className="text-sm font-semibold">
                {portfolio.summary.total_production_kwh.toLocaleString()} kWh
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">CO₂ Saved</div>
              <div className="text-sm font-semibold">
                {portfolio.investments.reduce((sum, inv) => {
                  const project = projects?.find(p => p.id === inv.project_id);
                  const co2PerShare = project?.forecast?.co2_savings_per_share || 0;
                  return sum + (inv.shares * co2PerShare);
                }, 0).toFixed(1)} t/year
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Energy Type Breakdown */}
      <div className="grid grid-cols-3 gap-4">
        {Object.entries(portfolio.by_energy_type).map(([type, data]) => {
          const Icon = getEnergyIcon(type);
          const colorClass = getEnergyColor(type);
          
          return (
            <Card key={type} className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg bg-muted ${colorClass}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="font-medium capitalize">{type}</span>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold">
                  €{data.investment.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">
                  {data.shares} shares • {data.capacity} {type === "battery" ? "kWh" : "kW"}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="history">Transaction History</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4 mt-6">
          <h2 className="text-xl font-semibold">Your Investments</h2>
          
          <div className="space-y-3">
            {portfolio.investments.map((investment) => {
              const Icon = getEnergyIcon(investment.energy_type);
              const colorClass = getEnergyColor(investment.energy_type);
              const isGain = investment.investment.gain_loss >= 0;
              const canBuyMore = isProjectOpen(investment.project_id);

              return (
                <Card
                  key={investment.project_id}
                  className="p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`p-3 rounded-xl bg-muted ${colorClass}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="font-semibold">{investment.project_name}</div>
                        <div className="text-sm text-muted-foreground">
                          {investment.shares} shares • {investment.capacity} {investment.capacity_unit}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-semibold">
                        €{investment.investment.current_value.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </div>
                      <div
                        className={`text-sm flex items-center justify-end gap-1 ${
                          isGain ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {isGain ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        {isGain ? "+" : ""}
                        {investment.investment.gain_loss_percentage.toFixed(2)}%
                      </div>
                    </div>

                    {/* Buy/Sell Buttons - Compact Style */}
                    <div className="flex gap-1">
                      {canBuyMore && (
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8 rounded-full hover:bg-green-500 hover:text-white hover:border-green-500"
                          onClick={() => handleBuyClick(investment)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8 rounded-full hover:bg-red-500 hover:text-white hover:border-red-500"
                        onClick={() => handleSellClick(investment)}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-4 mt-6">
          <h2 className="text-xl font-semibold">Transaction History</h2>
          
          <div className="space-y-3">
            {portfolio.investments
              .flatMap(investment => 
                investment.transaction_history.map(transaction => ({
                  ...transaction,
                  project_id: investment.project_id,
                  project_name: investment.project_name,
                  energy_type: investment.energy_type,
                }))
              )
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((transaction, idx) => {
                const Icon = getEnergyIcon(transaction.energy_type);
                const colorClass = getEnergyColor(transaction.energy_type);
                const isBuy = transaction.direction === 'buy';
                const totalAmount = transaction.shares * transaction.price_per_share;

                return (
                  <Card key={`${transaction.project_id}-${transaction.date}-${idx}`} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className={`p-3 rounded-xl bg-muted ${colorClass}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{isBuy ? 'Buy' : 'Sell'}</span>
                            <Badge 
                              variant="outline" 
                              className={isBuy ? 'border-green-500 text-green-700 dark:text-green-400' : 'border-red-500 text-red-700 dark:text-red-400'}
                            >
                              {isBuy ? 'Purchase' : 'Sale'}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {transaction.project_name}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className={`font-semibold ${isBuy ? 'text-red-500' : 'text-green-500'}`}>
                          {isBuy ? '-' : '+'}€{totalAmount.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1 justify-end">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(transaction.date), "MMM dd, yyyy")}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {transaction.shares} shares @ €{transaction.price_per_share.toLocaleString()}/share
                      </span>
                    </div>
                  </Card>
                );
              })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Energy Consumption Chart */}
      <Card className="p-8 space-y-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Energy Consumption</h2>
            <p className="text-muted-foreground">
              Real-time consumption data from your POD {portfolio.pod_id}
            </p>
          </div>
        </div>

        {/* Time Period and Date Controls */}
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4 p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-3">
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    defaultMonth={selectedDate}
                    onSelect={(date) => {
                      if (date) {
                        setSelectedDate(date);
                        setIsCalendarOpen(false);
                      }
                    }}
                    captionLayout="dropdown-buttons"
                    fromYear={2020}
                    toYear={2030}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <div className="h-6 w-px bg-border" />

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">View:</span>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTimePeriod("day")}
                    className={timePeriod === "day" ? "bg-primary text-white" : ""}
                  >
                    Day
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTimePeriod("week")}
                    className={timePeriod === "week" ? "bg-primary text-white" : ""}
                  >
                    Week
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTimePeriod("month")}
                    className={timePeriod === "month" ? "bg-primary text-white" : ""}
                  >
                    Month
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTimePeriod("year")}
                    className={timePeriod === "year" ? "bg-primary text-white" : ""}
                  >
                    Year
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigatePeriod("prev")}
                disabled={isLoadingChart}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              <span className="text-sm font-medium px-3 min-w-[180px] text-center">
                {getActualDateLabel(loadCurveData?.data, timePeriod)}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigatePeriod("next")}
                disabled={isLoadingChart}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="h-96">
          {isLoadingChart && (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {chartError && (
            <div className="flex items-center justify-center h-full text-red-500">
              <div className="text-center">
                <Info className="w-8 h-8 mx-auto mb-2" />
                <p>Unable to load consumption data</p>
              </div>
            </div>
          )}

          {loadCurveData && !isLoadingChart && (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={consumptionChartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="timestamp" 
                  tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis 
                  label={{ value: "kWh", angle: -90, position: "insideLeft", fill: 'hsl(var(--muted-foreground))' }}
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                />
                <RechartsTooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      const totalProduction = data.Solar + data.Wind;
                      return (
                        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
                          <p className="font-semibold mb-2">{data.timestamp}</p>
                          <p className="text-sm text-red-500">Consumption: {data.Consumption.toFixed(2)} kWh</p>
                          {data.Wind > 0 && (
                            <p className="text-sm text-blue-500">Wind Production: {data.Wind.toFixed(2)} kWh</p>
                          )}
                          {data.Solar > 0 && (
                            <p className="text-sm text-orange-500">Solar Production: {data.Solar.toFixed(2)} kWh</p>
                          )}
                          {totalProduction > 0 && (
                            <>
                              <p className="text-sm font-medium mt-1">Total Production: {totalProduction.toFixed(2)} kWh</p>
                              <p className="text-sm text-green-500">
                                Coverage: {((totalProduction / data.Consumption) * 100).toFixed(1)}%
                              </p>
                            </>
                          )}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend />
                {/* Wind Production Area */}
                <Area
                  type="monotone"
                  dataKey="Wind"
                  stackId="production"
                  fill="#3b82f6"
                  fillOpacity={0.3}
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Wind Production"
                />
                {/* Solar Production Area */}
                <Area
                  type="monotone"
                  dataKey="Solar"
                  stackId="production"
                  fill="#f97316"
                  fillOpacity={0.3}
                  stroke="#f97316"
                  strokeWidth={2}
                  name="Solar Production"
                />
                {/* Consumption Line */}
                <Line 
                  type="monotone" 
                  dataKey="Consumption" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  dot={false}
                  name="Consumption"
                />
              </ComposedChart>
            </ResponsiveContainer>
          )}

          {/* Transaction Markers */}
          {transactionMarkers.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
              <span className="text-sm text-muted-foreground">Transactions in this period:</span>
              {transactionMarkers.map((marker, idx) => (
                <Badge 
                  key={idx} 
                  variant="outline" 
                  className={`gap-1 ${marker.type === 'buy' ? 'border-green-500 text-green-700 dark:text-green-400' : 'border-red-500 text-red-700 dark:text-red-400'}`}
                >
                  {marker.type === 'buy' ? (
                    <ShoppingCart className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  <span className="text-xs">
                    {marker.date.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - 
                    {marker.type === 'buy' ? 'Bought' : 'Sold'} {marker.shares} shares of {marker.projectName}
                    {' '}@ €{marker.pricePerShare.toLocaleString()}
                  </span>
                </Badge>
              ))}
            </div>
          )}
        </div>
      </Card>

         {/* AI Recommendations */}
      <Card className="p-6 space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-white text-sm font-bold">AI</span>
            </div>
            <h2 className="text-xl font-bold">Smart Recommendations</h2>
          </div>
          <p className="text-sm text-muted-foreground pl-10">
            Our AI continuously analyzes your portfolio performance, new investment opportunities, and your energy consumption patterns to suggest optimal portfolio adjustments.
          </p>
        </div>

        {aiRecommendations.length > 0 ? (
          <div className="space-y-3">
            {aiRecommendations.map((rec) => (
              <div
                key={rec.id}
                className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 border border-border"
              >
                <AlertCircle
                  className={`w-5 h-5 mt-0.5 shrink-0 ${
                    rec.priority === "high"
                      ? "text-primary"
                      : rec.priority === "medium"
                      ? "text-accent"
                      : "text-muted-foreground"
                  }`}
                />
                <div className="flex-1 space-y-3">
                  <div>
                    <p className="text-sm mb-1">{rec.message}</p>
                    <p className="text-xs text-muted-foreground">Estimated cost: €{rec.cost}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleAcceptRecommendation(rec.id, rec.message, rec.cost)}
                      className="bg-primary hover:bg-primary-dark"
                    >
                      Accept
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleRejectRecommendation(rec.id)}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
                <Badge
                  variant={rec.priority === "high" ? "default" : "outline"}
                  className={rec.priority === "high" ? "bg-primary shrink-0" : "shrink-0"}
                >
                  {rec.priority}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">No new recommendations at this time</p>
            <p className="text-xs mt-1">Check back later for AI-powered optimization suggestions</p>
          </div>
        )}
      </Card>


      {/* Buy Dialog - Trade Republic Style */}
      <Dialog open={buyDialogOpen} onOpenChange={setBuyDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Buy Shares</DialogTitle>
            <DialogDescription>
              {selectedInvestment?.project_name}
            </DialogDescription>
          </DialogHeader>
          
          {selectedInvestment && (
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="buy-quantity">Number of Shares</Label>
                <Input
                  id="buy-quantity"
                  type="number"
                  min="1"
                  value={buyQuantity}
                  onChange={(e) => setBuyQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="text-lg"
                />
              </div>

              <div className="space-y-3 p-4 bg-muted rounded-lg">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Price per share</span>
                  <span className="font-medium">
                    €{getCurrentPrice(selectedInvestment.project_id).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Quantity</span>
                  <span className="font-medium">{buyQuantity}</span>
                </div>
                <div className="h-px bg-border" />
                <div className="flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="text-xl font-bold">
                    €{(getCurrentPrice(selectedInvestment.project_id) * buyQuantity).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>

              <div className="text-xs text-muted-foreground">
                After this purchase, you will own {selectedInvestment.shares + buyQuantity} shares.
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setBuyDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleBuyConfirm} className="bg-primary">
              Confirm Purchase
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sell Dialog - Trade Republic Style */}
      <Dialog open={sellDialogOpen} onOpenChange={setSellDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Sell Shares</DialogTitle>
            <DialogDescription>
              {selectedInvestment?.project_name}
            </DialogDescription>
          </DialogHeader>
          
          {selectedInvestment && (
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="sell-quantity">Number of Shares</Label>
                <Input
                  id="sell-quantity"
                  type="number"
                  min="1"
                  max={selectedInvestment.shares}
                  value={sellQuantity}
                  onChange={(e) => setSellQuantity(Math.min(selectedInvestment.shares, Math.max(1, parseInt(e.target.value) || 1)))}
                  className="text-lg"
                />
                <div className="text-xs text-muted-foreground">
                  You own {selectedInvestment.shares} shares
                </div>
              </div>

              <div className="space-y-3 p-4 bg-muted rounded-lg">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Current price per share</span>
                  <span className="font-medium">
                    €{selectedInvestment.investment.current_price_per_share.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Quantity</span>
                  <span className="font-medium">{sellQuantity}</span>
                </div>
                <div className="h-px bg-border" />
                <div className="flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="text-xl font-bold">
                    €{(selectedInvestment.investment.current_price_per_share * sellQuantity).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs text-muted-foreground">
                  After this sale, you will own {selectedInvestment.shares - sellQuantity} shares.
                </div>
                {selectedInvestment.shares - sellQuantity === 0 && (
                  <div className="text-xs text-amber-600 dark:text-amber-500">
                    ⚠️ This will close your entire position in this project.
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setSellDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSellConfirm} variant="destructive">
              Confirm Sale
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
