import { useEffect, useMemo, useState } from "react";
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
} from "@/components/ui/chart";
import * as RechartsPrimitive from "recharts"
import { cn } from "@renderer/lib/utils";

interface TrackedData {
  time: string;
  len: number;
  src: string;
  dst: string;
}

const chartConfig = {
  len: {
    label: "Traffic Data",
    color: "hsl(var(--chart-1))",
  },
};

export default function Chart(): JSX.Element {
  const [data, setData] = useState<TrackedData[]>([]);
  const [max, setMax] = useState<TrackedData>()

  useEffect(() => {
    async function tracker(): Promise<void> {
      console.log(await window.api.netracker(5));
      window.api.onTrackerData((data) => {
        const parsedData = JSON.parse(data);
        // populating the max value
        if (max == undefined || parsedData.len > max.len) setMax(parsedData)
        setData((prev) => [...prev, parsedData]); // Correctly update state
      });
    }
    tracker();
  }, []);

  return (
    <Card className="">
      <CardHeader>
        <CardTitle>Traffic Data</CardTitle>
        <CardDescription>
          Traffic length over time
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {/* Pass the required config to ChartContainer */}
        <ChartContainer config={chartConfig}>
          <AreaChart
            width={500}
            height={50}
            data={data.slice(-50)}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" tickFormatter={(value) => value.slice(0, 5)} />
            <YAxis />
            <Tooltip content={<CustomChartToolTip />} />
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
          {max && <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Current max traffic ({max.len}) <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex flex-col items-start gap-2 leading-none text-muted-foreground">
              <p>Source: {max.src}</p>
              <p>Destination: {max.dst}</p>
              <p>Length (in Bytes): {max.len}</p>
              <p>DateTime: {max.time}</p>
            </div>
          </div>}
        </div>
      </CardFooter>
    </Card>
  );
}


const CustomChartToolTip = ({ active, payload, labelClassName }: React.ComponentProps<typeof RechartsPrimitive.Tooltip>): React.ReactElement => {
  const toolTip = useMemo(() => {
    if (active && payload && payload.length) {
      const [value] = payload
      return <Card className="">
        <CardHeader className="pb-1">
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Source: {value.payload.src}</p>
          <p>Destination: {value.payload.dst}</p>
          <p>Length (in Bytes): {value.payload.len}</p>
          <p>DateTime: {value.payload.time}</p>
        </CardContent>
      </Card>
    }
    return <p>Hello</p>
  }, [payload])
  return <div className={cn("", labelClassName)}>
    {active && payload && payload.length && <div>
      {toolTip}
    </div>}
  </div >
}
