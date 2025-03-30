'use client';

import { TrendingUp } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';

const chartData = [
  { month: 'January', Wildlife: 186, Crimes: 80 },
  { month: 'February', Wildlife: 305, Crimes: 200 },
  { month: 'March', Wildlife: 237, Crimes: 120 },
  { month: 'April', Wildlife: 73, Crimes: 190 },
  { month: 'May', Wildlife: 209, Crimes: 130 },
  { month: 'June', Wildlife: 214, Crimes: 140 }
];

const chartConfig = {
  Wildlife: {
    label: 'Wildlife',
    color: 'hsl(147, 50%, 47%)'
  },
  Crimes: {
    label: 'Crimes',
    color: 'hsl(30, 100%, 50%)'
  }
};

export function AreaGraph() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Area Chart - Stacked</CardTitle>
        <CardDescription>
          Showing Top Incident Categories for the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[310px] w-full"
        >
          <AreaChart
            data={chartData}
            margin={{
              left: 12,
              right: 12
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="Crimes"
              type="natural"
              fill="var(--color-Crimes)"
              fillOpacity={0.4}
              stroke="var(--color-Crimes)"
              stackId="a"
            />
            <Area
              dataKey="Wildlife"
              type="natural"
              fill="var(--color-Wildlife)"
              fillOpacity={0.4}
              stroke="var(--color-Wildlife)"
              stackId="a"
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
