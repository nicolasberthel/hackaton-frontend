import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Loader2 } from "lucide-react";

interface LoadCurveData {
  timestamp: string;
  value: string;
}

interface LoadCurveResponse {
  data: LoadCurveData[];
}

const fetchLoadCurve = async (podNumber: string): Promise<LoadCurveResponse> => {
  const response = await fetch(`https://3zt62irsak.execute-api.us-west-2.amazonaws.com/loadcurve/${podNumber}`);
  if (!response.ok) {
    throw new Error("Failed to fetch load curve data");
  }
  return response.json();
};

export default function CustomerProfilePage() {
  const [podNumber, setPodNumber] = useState("00007");
  const [searchPod, setSearchPod] = useState("00007");

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["loadcurve", searchPod],
    queryFn: () => fetchLoadCurve(searchPod),
    enabled: !!searchPod,
  });

  const handleSearch = () => {
    setSearchPod(podNumber);
    refetch();
  };

  const chartData = data?.data.map((item) => ({
    timestamp: new Date(item.timestamp).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
    }),
    value: parseFloat(item.value),
  })) || [];

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Customer Profile</h1>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Search Customer</CardTitle>
            <CardDescription>Enter POD number to view consumption data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                placeholder="Enter POD number (e.g., 00007)"
                value={podNumber}
                onChange={(e) => setPodNumber(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button onClick={handleSearch}>Search</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Energy Consumption Chart</CardTitle>
            <CardDescription>POD: {searchPod}</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            )}

            {error && (
              <div className="flex items-center justify-center h-96 text-red-500">
                Error loading data: {error.message}
              </div>
            )}

            {data && !isLoading && (
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="timestamp" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis label={{ value: "kWh", angle: -90, position: "insideLeft" }} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#8884d8" 
                    name="Consumption (kWh)"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
    </div>
  );
}
