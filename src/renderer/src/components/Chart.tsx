import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface TrackedData {
  time: string;
  len: number;
  src: string;
  dst: string;
}

const chartConfig = {
  len: {
    label: "Traffic",
    color: "hsl(var(--chart-1))",
  },
};

export default function Chart(): JSX.Element {
  const [data, setData] = useState<TrackedData[]>([]);

  useEffect(() => {
    async function tracker(): Promise<void> {
      console.log(await window.api.netracker(5));
      window.api.onTrackerData((data) => {
        const parsedData = JSON.parse(data);
        setData((prev) => [...prev, parsedData]); // Correctly update state
      });
    }
    tracker();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Traffic Data</CardTitle>
        <CardDescription>
          Traffic length over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Pass the required config to ChartContainer */}
        <ChartContainer config={chartConfig}>
          <AreaChart
            width={600}
            height={300}
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" tickFormatter={(value) => value.slice(0, 5)} />
            <YAxis />
            <Tooltip content={<ChartTooltipContent />} />
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="len"
              stroke="#8884d8"
              fillOpacity={1}
              fill="url(#gradient)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              January - June 2024
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
