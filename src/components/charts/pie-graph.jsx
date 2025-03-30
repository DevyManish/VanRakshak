'use client';

import React, { useMemo } from 'react';
import { TrendingUp } from 'lucide-react';
import { Label, Pie, PieChart } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';

const chartData = [
  { source: 'Transportation', emissions: 2433, fill: 'vhsl(300, 76%, 72%)' },
  { source: 'Electricity', emissions: 2372, fill: 'var(--color-safari)' },
  { source: 'Industry', emissions: 2128, fill: 'var(--color-other)' },
  { source: 'Agriculture', emissions: 1311, fill: 'var(--color-firefox)' },
  { source: 'Waste', emissions: 916, fill: 'var(--color-edge)' },
];

const chartConfig = {
  emissions: {
    label: 'CO₂ Emissions (tons)'
  },
  chrome: {
    label: 'Transportation',
    color: 'hsl(var(--chart-1))'
  },
  safari: {
    label: 'Electricity',
    color: 'hsl(300, 76%, 72%)'
  },
  other: {
    label: 'Industry',
    color: 'hsl(240, 100%, 50%)'
  },
  firefox: {
    label: 'Agriculture',
    color: 'hsl(147, 50%, 47%)'
  },
  edge: {
    label: 'Waste',
    color: 'hsl(248, 53%, 58%)'
  }
};

export function PieGraph() {
  const totalEmissions = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.emissions, 0);
  }, []);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Carbon Emission Share</CardTitle>
        <CardDescription>Jan - Mar 2025</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[360px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="emissions"
              nameKey="source"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalEmissions.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          tons CO₂
                        </tspan>
                      </text>
                    );
                  }
                  return null;
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total carbon emissions by source for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
