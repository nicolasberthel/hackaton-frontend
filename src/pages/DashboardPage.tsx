import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Sun, Battery, Wind, TrendingUp, Leaf, DollarSign, AlertCircle, Plus, Loader2, Info, ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line, Area, ComposedChart } from "recharts";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { API_BASE_URL } from "@/config/api";

interface LoadCurveData {
  timestamp: string;
  value: string;
}

interface LoadCurveResponse {
  data: LoadCurveData[];
  page?: number;
  page_size?: number;
  total?: number;
}

interface ProductionData {
  timestamp: string;
  value: string;
}

interface ProductionResponse {
  data: ProductionData[];
}

// Format date to YYYY-MM-DD for API
const formatDateForAPI = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

// Fetch load curve by single date
const fetchLoadCurveByDate = async (
  podNumber: string,
  date: Date
): Promise<LoadCurveResponse> => {
  const url = `${API_BASE_URL}/loadcurve/${podNumber}?date=${formatDateForAPI(date)}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch load curve data");
  }
  return response.json();
};

// Fetch load curve by date range (optimized for week/month)
const fetchLoadCurveByDateRange = async (
  podNumber: string,
  fromDate: Date,
  toDate: Date,
  pageSize: number = 1000
): Promise<LoadCurveResponse> => {
  const url = `${API_BASE_URL}/loadcurve/${podNumber}?from_date=${formatDateForAPI(fromDate)}&to_date=${formatDateForAPI(toDate)}&page_size=${pageSize}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch load curve data");
  }
  return response.json();
};

// Fetch monthly aggregated load curve for a year
const fetchLoadCurveMonthly = async (
  podNumber: string,
  year: number
): Promise<LoadCurveResponse> => {
  const url = `${API_BASE_URL}/loadcurve/${podNumber}/monthly?year=${year}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch monthly load curve data");
  }
  const result = await response.json();
  // API returns array directly, wrap it in expected format
  return Array.isArray(result) ? { data: result } : result;
};

// Fetch load curve for multiple days
const fetchLoadCurveMultipleDays = async (
  podNumber: string,
  fromDate: Date,
  toDate: Date
): Promise<LoadCurveData[]> => {
  const days: Date[] = [];
  const currentDate = new Date(fromDate);
  
  // Generate array of dates
  while (currentDate <= toDate) {
    days.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  console.log(`Fetching ${days.length} days from ${formatDateForAPI(fromDate)} to ${formatDateForAPI(toDate)}`);

  // Fetch all days in parallel
  const fetchPromises = days.map((day) => fetchLoadCurveByDate(podNumber, day));
  const results = await Promise.all(fetchPromises);

  // Combine all data
  const allData = results.flatMap((result) => result.data);
  console.log(`Fetched total of ${allData.length} data points`);
  
  return allData;
};

// Fetch production data by single date
const fetchProductionByDate = async (
  projectId: string,
  date: Date
): Promise<ProductionResponse> => {
  const url = `${API_BASE_URL}/projects/${projectId}/production?date=${formatDateForAPI(date)}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch production data for project ${projectId}`);
  }
  return response.json();
};

// Fetch production by date range (optimized for week/month)
const fetchProductionByDateRange = async (
  projectId: string,
  fromDate: Date,
  toDate: Date,
  pageSize: number = 1000
): Promise<ProductionResponse> => {
  const url = `${API_BASE_URL}/projects/${projectId}/production?from_date=${formatDateForAPI(fromDate)}&to_date=${formatDateForAPI(toDate)}&page_size=${pageSize}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch production data for project ${projectId}`);
  }
  return response.json();
};

// Fetch monthly aggregated production for a year
const fetchProductionMonthly = async (
  projectId: string,
  year: number
): Promise<ProductionResponse> => {
  const url = `${API_BASE_URL}/projects/${projectId}/production/monthly?year=${year}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch monthly production data for project ${projectId}`);
  }
  const result = await response.json();
  // API returns array directly, wrap it in expected format
  return Array.isArray(result) ? { data: result } : result;
};

// Fetch production for multiple days
const fetchProductionMultipleDays = async (
  projectId: string,
  fromDate: Date,
  toDate: Date
): Promise<ProductionData[]> => {
  const days: Date[] = [];
  const currentDate = new Date(fromDate);
  
  // Generate array of dates
  while (currentDate <= toDate) {
    days.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Fetch all days in parallel
  const fetchPromises = days.map((day) => fetchProductionByDate(projectId, day));
  const results = await Promise.all(fetchPromises);

  // Combine all data
  return results.flatMap((result) => result.data);
};

// Aggregate data by day for monthly view (generic function)
const aggregateByDay = <T extends { timestamp: string; value: string }>(data: T[]): T[] => {
  const dailyData = new Map<string, { sum: number; count: number }>();

  data.forEach((item) => {
    const date = new Date(item.timestamp);
    const dayKey = date.toISOString().split("T")[0]; // YYYY-MM-DD

    if (!dailyData.has(dayKey)) {
      dailyData.set(dayKey, { sum: 0, count: 0 });
    }

    const entry = dailyData.get(dayKey)!;
    entry.sum += parseFloat(item.value);
    entry.count += 1;
  });

  return Array.from(dailyData.entries()).map(([dayKey, { sum, count }]) => ({
    timestamp: dayKey + "T12:00:00Z", // Use noon as representative time
    value: (sum / count).toFixed(2), // Average value for the day
  })) as T[];
};

export default function DashboardPage() {
  const location = useLocation();
  
  // Get investment data from navigation state or localStorage
  const [portfolioData, setPortfolioData] = useState(() => {
    const savedData = localStorage.getItem('portfolioData');
    return savedData ? JSON.parse(savedData) : null;
  });

  // POD selection state
  const [selectedPod, setSelectedPod] = useState("00011");
  
  // Time period state
  type TimePeriod = "day" | "week" | "month" | "year";
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("day");
  
  // Date selection - default to June 17, 2024
  const [selectedDate, setSelectedDate] = useState(new Date(2024, 8, 20)); // Month is 0-indexed
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Calculate date range based on selected date and time period
  const getDateRange = (date: Date, period: TimePeriod): { fromDate: Date; toDate: Date } => {
    const fromDate = new Date(date);
    const toDate = new Date(date);

    switch (period) {
      case "day":
        // Single day
        fromDate.setHours(0, 0, 0, 0);
        toDate.setHours(23, 59, 59, 999);
        break;
      case "week":
        // Start from Monday of the week
        const dayOfWeek = fromDate.getDay();
        const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Adjust to Monday
        fromDate.setDate(fromDate.getDate() + diff);
        fromDate.setHours(0, 0, 0, 0);
        toDate.setDate(fromDate.getDate() + 6);
        toDate.setHours(23, 59, 59, 999);
        break;
      case "month":
        // Entire month
        fromDate.setDate(1);
        fromDate.setHours(0, 0, 0, 0);
        toDate.setMonth(toDate.getMonth() + 1, 0); // Last day of month
        toDate.setHours(23, 59, 59, 999);
        break;
      case "year":
        // Entire year
        fromDate.setMonth(0, 1); // January 1st
        fromDate.setHours(0, 0, 0, 0);
        toDate.setMonth(11, 31); // December 31st
        toDate.setHours(23, 59, 59, 999);
        break;
    }

    return { fromDate, toDate };
  };

  // Get week number from date
  const getWeekNumber = (date: Date): number => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  };

  // Get actual date range from loaded data
  const getActualDateLabel = (data: LoadCurveData[] | undefined, period: TimePeriod): string => {
    if (!data || data.length === 0) {
      return "No data";
    }

    const firstDate = new Date(data[0].timestamp);
    const lastDate = new Date(data[data.length - 1].timestamp);

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

  // Navigate to previous/next period
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

  // Fetch load curve data using optimized queries
  const { data: rawLoadCurveData, isLoading: isLoadingChart, error: chartError } = useQuery({
    queryKey: ["loadcurve", selectedPod, selectedDate, timePeriod],
    queryFn: async () => {
      if (timePeriod === "year") {
        // Year: Use monthly aggregated endpoint
        return fetchLoadCurveMonthly(selectedPod, selectedDate.getFullYear());
      }
      
      const { fromDate, toDate } = getDateRange(selectedDate, timePeriod);
      
      if (timePeriod === "day") {
        return fetchLoadCurveByDate(selectedPod, selectedDate);
      } else if (timePeriod === "week") {
        // Week: 7 days * 96 = 672 points (within 1000 limit)
        return fetchLoadCurveByDateRange(selectedPod, fromDate, toDate, 1000);
      } else {
        // Month: Split into 2 queries (first half: 1-15, second half: 16-end)
        // Each half: ~10 days * 96 = ~960 points (within 1000 limit)
        const midDate = new Date(fromDate);
        midDate.setDate(15);
        const midDateEnd = new Date(midDate);
        midDateEnd.setDate(midDate.getDate() + 1);
        
        const [firstHalf, secondHalf] = await Promise.all([
          fetchLoadCurveByDateRange(selectedPod, fromDate, midDate, 1000),
          fetchLoadCurveByDateRange(selectedPod, midDateEnd, toDate, 1000),
        ]);
        
        return { data: [...firstHalf.data, ...secondHalf.data] };
      }
    },
  });

  // Fetch wind turbine production (project 00003)
  const { data: rawWindData } = useQuery({
    queryKey: ["production", "00015", selectedDate, timePeriod],
    queryFn: async () => {
      if (timePeriod === "year") {
        return fetchProductionMonthly("00015", selectedDate.getFullYear());
      }
      
      const { fromDate, toDate } = getDateRange(selectedDate, timePeriod);
      
      if (timePeriod === "day") {
        return fetchProductionByDate("00015", selectedDate);
      } else if (timePeriod === "week") {
        return fetchProductionByDateRange("00015", fromDate, toDate, 1000);
      } else {
        const midDate = new Date(fromDate);
        midDate.setDate(15);
        const midDateEnd = new Date(midDate);
        midDateEnd.setDate(midDate.getDate() + 1);
        
        const [firstHalf, secondHalf] = await Promise.all([
          fetchProductionByDateRange("00015", fromDate, midDate, 1000),
          fetchProductionByDateRange("00015", midDateEnd, toDate, 1000),
        ]);
        
        return { data: [...firstHalf.data, ...secondHalf.data] };
      }
    },
  });

  // Fetch PV production (project 00002)
  const { data: rawPvData } = useQuery({
    queryKey: ["production", "00012", selectedDate, timePeriod],
    queryFn: async () => {
      if (timePeriod === "year") {
        return fetchProductionMonthly("00012", selectedDate.getFullYear());
      }
      
      const { fromDate, toDate } = getDateRange(selectedDate, timePeriod);
      
      if (timePeriod === "day") {
        return fetchProductionByDate("00012", selectedDate);
      } else if (timePeriod === "week") {
        return fetchProductionByDateRange("00012", fromDate, toDate, 1000);
      } else {
        const midDate = new Date(fromDate);
        midDate.setDate(15);
        const midDateEnd = new Date(midDate);
        midDateEnd.setDate(midDate.getDate() + 1);
        
        const [firstHalf, secondHalf] = await Promise.all([
          fetchProductionByDateRange("00012", fromDate, midDate, 1000),
          fetchProductionByDateRange("00012", midDateEnd, toDate, 1000),
        ]);
        
        return { data: [...firstHalf.data, ...secondHalf.data] };
      }
    },
  });

  // Process data: aggregate for monthly view, year is already aggregated
  const loadCurveData = rawLoadCurveData
    ? {
        ...rawLoadCurveData,
        data:
          timePeriod === "month"
            ? aggregateByDay(rawLoadCurveData.data)
            : rawLoadCurveData.data,
      }
    : undefined;

  const windProductionData = rawWindData
    ? {
        ...rawWindData,
        data:
          timePeriod === "month"
            ? aggregateByDay(rawWindData.data)
            : rawWindData.data,
      }
    : undefined;

  const pvProductionData = rawPvData
    ? {
        ...rawPvData,
        data:
          timePeriod === "month"
            ? aggregateByDay(rawPvData.data)
            : rawPvData.data,
      }
    : undefined;





  // Merge consumption and production data by timestamp
  const consumptionChartData = (() => {
    if (!loadCurveData?.data) return [];

    // Normalize timestamp to ISO string for consistent comparison
    const normalizeTimestamp = (ts: string) => {
      const date = new Date(ts);
      // For year view, normalize to first day of month at midnight UTC
      if (timePeriod === "year") {
        return new Date(Date.UTC(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0)).toISOString();
      }
      return date.toISOString();
    };

    // Create maps for quick lookup with normalized timestamps
    const windMap = new Map(
      windProductionData?.data.map((item) => [
        normalizeTimestamp(item.timestamp), 
        parseFloat(item.value)
      ]) || []
    );
    const pvMap = new Map(
      pvProductionData?.data.map((item) => [
        normalizeTimestamp(item.timestamp), 
        parseFloat(item.value)
      ]) || []
    );



    const chartData = loadCurveData.data.map((item, index) => {
      const date = new Date(item.timestamp);
      let formattedTimestamp: string;

      switch (timePeriod) {
        case "day":
          // Show only hours for daily view (e.g., "14:00")
          formattedTimestamp = date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          });
          break;
        case "week":
          // Show day name and date for weekly view (e.g., "Mon 17" or "Tue 18")
          // Only show every 16th point to avoid crowding
          if (index % 16 === 0) {
            formattedTimestamp = date.toLocaleDateString("en-US", {
              weekday: "short",
              day: "numeric",
            });
          } else {
            formattedTimestamp = ""; // Empty for intermediate points
          }
          break;
        case "month":
          // Show only date for monthly view (e.g., "17")
          formattedTimestamp = date.toLocaleDateString("en-US", {
            day: "numeric",
          });
          break;
        case "year":
          // Show month name for yearly view (e.g., "Jan", "Feb")
          formattedTimestamp = date.toLocaleDateString("en-US", {
            month: "short",
          });
          break;
        default:
          formattedTimestamp = date.toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
          });
      }

      const normalizedTimestamp = normalizeTimestamp(item.timestamp);
      const wind = windMap.get(normalizedTimestamp) || 0;
      const pv = pvMap.get(normalizedTimestamp) || 0;

      return {
        timestamp: formattedTimestamp,
        Consumption: parseFloat(item.value),
        Wind: Number(wind),
        PV: Number(pv),
        fullDate: date, // Keep full date for tooltip
      };
    });

    return chartData;
  })();

  // Sell dialog state
  const [sellDialogOpen, setSellDialogOpen] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState<any>(null);
  const [sellPercentage, setSellPercentage] = useState<string>("100");

  // Update portfolio data when arriving from confirmation
  useEffect(() => {
    if (location.state?.portfolio) {
      const newPortfolio = location.state.portfolio;
      setPortfolioData(newPortfolio);
      localStorage.setItem('portfolioData', JSON.stringify(newPortfolio));
    }
  }, [location.state]);

  // Use saved portfolio data or default values
  const totalInvestment = portfolioData?.totalInvestment || 5000;
  const recommendations = portfolioData?.recommendations || {
    solar: { percentage: 50, investment: 2500 },
    battery: { percentage: 30, investment: 1500 },
    wind: { percentage: 20, investment: 1000 },
  };

  const portfolio = {
    totalValue: totalInvestment,
    totalReturn: Math.round(totalInvestment * 0.065), // 6.5% average return
    returnPercentage: 6.5,
    co2Saved: (totalInvestment / 1000) * 0.9, // Approximate CO2 calculation
    autonomy: 65,
  };

  // Monthly financial benefits data - calculated based on investment
  // Total annual benefit capped at 10% of initial investment
  // Revenue is approximately 38% of total benefit from selling excess production
  const maxAnnualBenefit = totalInvestment * 0.10;
  const baseSavingsMultiplier = maxAnnualBenefit / 500; // Base values sum to ~500
  
  const monthlyData = [
    { month: "Jan", savings: Math.round(19 * baseSavingsMultiplier), revenue: Math.round(12 * baseSavingsMultiplier) },
    { month: "Feb", savings: Math.round(21 * baseSavingsMultiplier), revenue: Math.round(13 * baseSavingsMultiplier) },
    { month: "Mar", savings: Math.round(24 * baseSavingsMultiplier), revenue: Math.round(15 * baseSavingsMultiplier) },
    { month: "Apr", savings: Math.round(27 * baseSavingsMultiplier), revenue: Math.round(17 * baseSavingsMultiplier) },
    { month: "May", savings: Math.round(30 * baseSavingsMultiplier), revenue: Math.round(19 * baseSavingsMultiplier) },
    { month: "Jun", savings: Math.round(32 * baseSavingsMultiplier), revenue: Math.round(21 * baseSavingsMultiplier) },
    { month: "Jul", savings: Math.round(33 * baseSavingsMultiplier), revenue: Math.round(22 * baseSavingsMultiplier) },
    { month: "Aug", savings: Math.round(31 * baseSavingsMultiplier), revenue: Math.round(20 * baseSavingsMultiplier) },
    { month: "Sep", savings: Math.round(28 * baseSavingsMultiplier), revenue: Math.round(17 * baseSavingsMultiplier) },
    { month: "Oct", savings: Math.round(25 * baseSavingsMultiplier), revenue: Math.round(15 * baseSavingsMultiplier) },
    { month: "Nov", savings: Math.round(22 * baseSavingsMultiplier), revenue: Math.round(13 * baseSavingsMultiplier) },
    { month: "Dec", savings: Math.round(20 * baseSavingsMultiplier), revenue: Math.round(12 * baseSavingsMultiplier) }
  ];
  
  const annualSavings = monthlyData.reduce((sum, m) => sum + m.savings, 0);
  const annualRevenue = monthlyData.reduce((sum, m) => sum + m.revenue, 0);

  const investments = [
    {
      id: 1,
      name: "Luxembourg Solar Park Phase 2",
      type: "solar",
      icon: Sun,
      capacity: ((recommendations.solar.investment / 1111 / 2).toFixed(2)) + " kWc",
      invested: Math.round(recommendations.solar.investment * 0.6),
      currentValue: Math.round(recommendations.solar.investment * 0.6 * 1.07),
      return: 7.2,
      status: "active",
    },
    {
      id: 2,
      name: "Community Battery Storage",
      type: "battery",
      icon: Battery,
      capacity: ((recommendations.battery.investment / 625 / 2).toFixed(2)) + " kWh",
      invested: Math.round(recommendations.battery.investment * 0.5),
      currentValue: Math.round(recommendations.battery.investment * 0.5 * 1.06),
      return: 6.0,
      status: "active",
    },
    {
      id: 3,
      name: "Northern Wind Farm",
      type: "wind",
      icon: Wind,
      capacity: ((recommendations.wind.investment / 2500 / 2).toFixed(2)) + " kW",
      invested: Math.round(recommendations.wind.investment * 0.6),
      currentValue: Math.round(recommendations.wind.investment * 0.6 * 1.065),
      return: 6.5,
      status: "active",
    },
  ];

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


  // Asset ownership breakdown - uses actual investment percentages
  const assetsOwned = [
    { 
      type: "Solar", 
      icon: Sun, 
      capacity: ((recommendations.solar.investment / 1111).toFixed(2)) + " kWc", 
      percentage: recommendations.solar.percentage, 
      amount: recommendations.solar.investment, 
      color: "accent", 
      currentPrice: Math.round(recommendations.solar.investment * 1.04), 
      priceChange: 4.20 
    },
    { 
      type: "Battery", 
      icon: Battery, 
      capacity: ((recommendations.battery.investment / 625).toFixed(2)) + " kWh", 
      percentage: recommendations.battery.percentage, 
      amount: recommendations.battery.investment, 
      color: "secondary", 
      currentPrice: Math.round(recommendations.battery.investment * 0.98), 
      priceChange: -1.80 
    },
    { 
      type: "Wind", 
      icon: Wind, 
      capacity: ((recommendations.wind.investment / 2500).toFixed(2)) + " kW", 
      percentage: recommendations.wind.percentage, 
      amount: recommendations.wind.investment, 
      color: "primary", 
      currentPrice: Math.round(recommendations.wind.investment * 1.025), 
      priceChange: 2.50 
    },
  ];

  const handleOpenSellDialog = (investment: any) => {
    setSelectedInvestment(investment);
    setSellPercentage("100");
    setSellDialogOpen(true);
  };

  const handleSellShares = () => {
    if (!selectedInvestment) return;
    
    const percentage = parseFloat(sellPercentage);
    if (isNaN(percentage) || percentage <= 0 || percentage > 100) {
      toast.error("Please enter a valid percentage between 1 and 100");
      return;
    }

    const sellAmount = (selectedInvestment.currentValue * percentage) / 100;
    toast.success(`Successfully sold ${percentage}% of ${selectedInvestment.name} for €${sellAmount.toFixed(2)}`);
    setSellDialogOpen(false);
  };

  const getSellAmount = () => {
    if (!selectedInvestment) return 0;
    const percentage = parseFloat(sellPercentage) || 0;
    return (selectedInvestment.currentValue * percentage) / 100;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Investment Dashboard</h1>
          <p className="text-muted-foreground">Track and optimize your energy portfolio</p>
        </div>
        <Link to="/opportunities">
          <Button className="bg-primary hover:bg-primary-dark">
            <Plus className="w-4 h-4 mr-2" />
            New Investment
          </Button>
        </Link>
      </div>

      {/* Portfolio Overview */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="p-6 space-y-2 bg-gradient-to-br from-primary/10 to-primary/5">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <DollarSign className="w-4 h-4" />
            <span>Total Value</span>
          </div>
          <div className="text-3xl font-bold text-primary">€{portfolio.totalValue.toLocaleString()}</div>
          <div className="text-sm text-success">+€{portfolio.totalReturn.toLocaleString()} ({portfolio.returnPercentage.toFixed(2)}%)</div>
        </Card>

        <Card className="p-6 space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="w-4 h-4" />
            <span>Total Return</span>
          </div>
          <div className="text-3xl font-bold text-primary">{portfolio.returnPercentage.toFixed(2)}%</div>
          <div className="text-sm text-muted-foreground">Annual average</div>
        </Card>

        <Card className="p-6 space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Leaf className="w-4 h-4" />
            <span>CO₂ Saved</span>
          </div>
          <div className="text-3xl font-bold text-secondary">{portfolio.co2Saved.toFixed(2)} t</div>
          <div className="text-sm text-muted-foreground">This year</div>
        </Card>

        <Card className="p-6 space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Sun className="w-4 h-4" />
            <span>Autonomy</span>
          </div>
          <div className="text-3xl font-bold text-accent">{portfolio.autonomy}%</div>
          <div className="text-sm text-muted-foreground">Energy coverage</div>
        </Card>
      </div>

      {/* Active Investments */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Your Investments</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {investments.map((investment) => {
            const Icon = investment.icon;
            const gain = investment.currentValue - investment.invested;
            const gainPercentage = ((gain / investment.invested) * 100).toFixed(1);

            return (
              <Card key={investment.id} className="p-6 space-y-4 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <Badge className="bg-success">Active</Badge>
                </div>

                <div>
                  <h3 className="font-semibold mb-1">{investment.name}</h3>
                  <p className="text-sm text-muted-foreground">{investment.capacity}</p>
                </div>

                <div className="space-y-2 pt-2 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Invested</span>
                    <span className="font-medium">€{investment.invested.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Current Value</span>
                    <span className="font-bold text-primary">€{investment.currentValue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Gain</span>
                    <span className="font-bold text-success">
                      +€{gain.toLocaleString()} ({gainPercentage}%)
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    View Details
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleOpenSellDialog(investment)}
                  >
                    Sell
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Sell Dialog */}
      <Dialog open={sellDialogOpen} onOpenChange={setSellDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Sell Portfolio Shares</DialogTitle>
            <DialogDescription>
              How much of your {selectedInvestment?.name} investment would you like to sell?
            </DialogDescription>
          </DialogHeader>

          {selectedInvestment && (
            <div className="space-y-6 py-4">
              <div className="space-y-4 p-4 rounded-lg bg-muted/50">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Current Value</span>
                  <span className="font-bold">€{selectedInvestment.currentValue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Original Investment</span>
                  <span className="font-medium">€{selectedInvestment.invested.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Current Gain</span>
                  <span className="font-bold text-success">
                    +€{(selectedInvestment.currentValue - selectedInvestment.invested).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sell-percentage">Percentage to Sell (%)</Label>
                <div className="flex gap-2">
                  <Input
                    id="sell-percentage"
                    type="number"
                    min="1"
                    max="100"
                    value={sellPercentage}
                    onChange={(e) => setSellPercentage(e.target.value)}
                    placeholder="100"
                  />
                  <Button 
                    variant="outline" 
                    onClick={() => setSellPercentage("100")}
                  >
                    Max
                  </Button>
                </div>
              </div>

              <div className="p-4 rounded-lg border-2 border-primary bg-primary/5">
                <div className="flex justify-between items-center">
                  <span className="font-medium">You will receive</span>
                  <span className="text-2xl font-bold text-primary">
                    €{getSellAmount().toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => setSellDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="button"
              variant="destructive"
              onClick={handleSellShares}
            >
              Confirm Sale
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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

      {/* Energy Consumption Chart */}
      <Card className="p-8 space-y-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Energy Consumption</h2>
            <p className="text-muted-foreground">
              Real-time consumption data from your POD
            </p>
          </div>
          <div className="w-48">
           
          </div>
        </div>

        {/* Time Period and Pagination Controls */}
        <div className="space-y-4">
          {/* Date Picker and Period Selector */}
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
              {timePeriod === "month" || timePeriod === "year" ? (
                <BarChart 
                  data={consumptionChartData.map(item => {
                    const totalProduction = item.Wind + item.PV;
                    const productionUsed = Math.min(totalProduction, item.Consumption);
                    const gridImport = Math.max(0, item.Consumption - totalProduction);
                    const excessProduction = Math.max(0, totalProduction - item.Consumption);
                    
                    // Calculate how much of each source is used vs excess
                    const windUsed = Math.min(item.Wind, item.Consumption);
                    const pvUsed = Math.min(item.PV, Math.max(0, item.Consumption - windUsed));
                    
                    return {
                      ...item,
                      WindUsed: windUsed,
                      PVUsed: pvUsed,
                      GridImport: gridImport,
                      Excess: excessProduction,
                    };
                  })}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="timestamp" 
                    tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis 
                    label={{ value: "kWh (avg)", angle: -90, position: "insideLeft", fill: 'hsl(var(--muted-foreground))' }}
                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        const totalProd = data.Wind + data.PV;
                        const coverage = (totalProd / data.Consumption) * 100;
                        
                        return (
                          <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
                            <p className="font-semibold mb-2">{data.timestamp}</p>
                            <p className="text-sm font-semibold">Consumption: {data.Consumption.toFixed(2)} kWh</p>
                            <p className="text-sm text-blue-500">Wind: {data.Wind.toFixed(2)} kWh</p>
                            <p className="text-sm text-orange-500">PV: {data.PV.toFixed(2)} kWh</p>
                            {data.GridImport > 0 && (
                              <p className="text-sm text-gray-500">Grid Import: {data.GridImport.toFixed(2)} kWh</p>
                            )}
                            {data.Excess > 0 && (
                              <p className="text-sm text-green-500">Excess Export: {data.Excess.toFixed(2)} kWh</p>
                            )}
                            <p className="text-sm font-semibold mt-1">Self-Coverage: {Math.min(100, coverage).toFixed(1)}%</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend />
                  {/* Single stacked bar: production (bottom) → grid import (middle) → excess (top) */}
                  <Bar 
                    dataKey="WindUsed" 
                    fill="#3b82f6" 
                    name="Wind"
                    stackId="bar"
                  />
                  <Bar 
                    dataKey="PVUsed" 
                    fill="#f97316" 
                    name="PV"
                    stackId="bar"
                  />
                  <Bar 
                    dataKey="GridImport" 
                    fill="#94a3b8" 
                    name="Grid Import"
                    stackId="bar"
                  />
                  <Bar 
                    dataKey="Excess" 
                    fill="#22c55e" 
                    name="Excess Export"
                    stackId="bar"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              ) : (
                <ComposedChart data={consumptionChartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="timestamp" 
                    angle={timePeriod === "day" ? 0 : -45}
                    textAnchor={timePeriod === "day" ? "middle" : "end"}
                    height={timePeriod === "day" ? 50 : 80}
                    tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                    interval={timePeriod === "day" ? "preserveStartEnd" : 0}
                  />
                  <YAxis 
                    label={{ value: "kWh", angle: -90, position: "insideLeft", fill: 'hsl(var(--muted-foreground))' }}
                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  {/* Production areas (stacked) */}
                  <Area 
                    type="monotone" 
                    dataKey="Wind" 
                    fill="#3b82f6" 
                    stroke="#3b82f6"
                    fillOpacity={0.6}
                    name="Wind"
                    stackId="1"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="PV" 
                    fill="#f97316" 
                    stroke="#f97316"
                    fillOpacity={0.6}
                    name="PV"
                    stackId="1"
                  />
                  {/* Consumption line on top */}
                  <Line 
                    type="monotone" 
                    dataKey="Consumption" 
                    stroke="hsl(var(--primary))" 
                    name="Consumption"
                    strokeWidth={2}
                    dot={false}
                  />
                </ComposedChart>
              )}
            </ResponsiveContainer>
          )}
        </div>
      </Card>

      {/* Monthly Financial Benefits Chart */}
      <Card className="p-8 space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Monthly Financial Benefits</h2>
          <p className="text-muted-foreground">
            Energy consumption cost reduction and revenue from selling excess production
          </p>
        </div>

        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="month" 
                className="text-sm"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis 
                className="text-sm"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                label={{ value: 'Amount (€)', angle: -90, position: 'insideLeft', fill: 'hsl(var(--muted-foreground))' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
                formatter={(value: number) => [`€${value}`, '']}
              />
              <Legend 
                wrapperStyle={{
                  paddingTop: '20px'
                }}
              />
              <Bar 
                dataKey="savings" 
                stackId="a" 
                fill="hsl(var(--primary))" 
                name="Energy Cost Reduction"
                radius={[0, 0, 4, 4]}
              />
              <Bar 
                dataKey="revenue" 
                stackId="a" 
                fill="hsl(var(--secondary))" 
                name="Production Revenue"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Annual Summary */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2 text-primary">
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm font-medium">Annual Savings</span>
          </div>
          <div className="text-3xl font-bold">€{annualSavings.toLocaleString()}</div>
          <p className="text-sm text-muted-foreground">Total energy cost reduction</p>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2 text-secondary">
            <DollarSign className="w-5 h-5" />
            <span className="text-sm font-medium">Annual Revenue</span>
          </div>
          <div className="text-3xl font-bold">€{annualRevenue.toLocaleString()}</div>
          <p className="text-sm text-muted-foreground">From excess production sales</p>
        </Card>

        <Card className="p-6 space-y-4 border-2 border-success bg-gradient-hero">
          <div className="flex items-center gap-2 text-success">
            <DollarSign className="w-5 h-5" />
            <span className="text-sm font-medium">Total Annual Benefit</span>
          </div>
          <div className="text-3xl font-bold text-success">€{(annualSavings + annualRevenue).toLocaleString()}</div>
          <p className="text-sm text-muted-foreground">Combined financial return</p>
        </Card>
      </div>

    </div>
  );
}
