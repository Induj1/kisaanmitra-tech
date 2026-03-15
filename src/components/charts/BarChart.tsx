
import React from 'react';
import { ChartContainer } from '@/components/ui/chart';
import { Bar, BarChart as RechartsBarChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface BarChartProps {
  data: any[];
  index: string;
  categories: string[];
  colors?: string[];
  valueFormatter?: (value: number) => string;
  className?: string;
}

const BarChart = ({
  data,
  index,
  categories,
  colors = ["blue", "green", "purple"],
  valueFormatter = (value) => `${value}`,
  className,
}: BarChartProps) => {
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
      <RechartsBarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={index} />
        <YAxis />
        <Tooltip formatter={(value) => valueFormatter(Number(value))} />
        <Legend />
        {categories.map((category, index) => (
          <Bar 
            key={category} 
            dataKey={category} 
            fill={`var(--color-${category}, ${colors[index % colors.length]})`} 
          />
        ))}
      </RechartsBarChart>
    </ChartContainer>
  );
};

export default BarChart;
