
import React from 'react';
import { ChartContainer } from '@/components/ui/chart';
import { Line, LineChart as RechartsLineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface LineChartProps {
  data: any[];
  index: string;
  categories: string[];
  colors?: string[];
  valueFormatter?: (value: number) => string;
  className?: string;
}

const LineChart = ({
  data,
  index,
  categories,
  colors = ["blue", "green", "purple"],
  valueFormatter = (value) => `${value}`,
  className,
}: LineChartProps) => {
  // Generate a config object for the chart component
  const chartConfig = categories.reduce((acc, category, i) => {
    acc[category] = {
      label: category,
      color: colors[i % colors.length],
    };
    return acc;
  }, {} as Record<string, { label: string; color: string }>);

  return (
    <ChartContainer config={chartConfig} className={className}>
      <RechartsLineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={index} />
        <YAxis />
        <Tooltip formatter={(value) => valueFormatter(Number(value))} />
        <Legend />
        {categories.map((category, index) => (
          <Line 
            key={category} 
            type="monotone" 
            dataKey={category} 
            stroke={`var(--color-${category}, ${colors[index % colors.length]})`} 
            activeDot={{ r: 8 }} 
          />
        ))}
      </RechartsLineChart>
    </ChartContainer>
  );
};

export default LineChart;
