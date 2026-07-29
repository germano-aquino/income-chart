"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// 1. Define the interface for your data items
interface ChartDataItem {
  month: string;
  sales: number;
  profit: number;
}

// 2. Mock data adhering to the interface
const data: ChartDataItem[] = [
  { month: "Jan", sales: 4000, profit: 2400 },
  { month: "Feb", sales: 3000, profit: 1398 },
  { month: "Mar", sales: 2000, profit: 9800 },
  { month: "Apr", sales: 2780, profit: 3908 },
  { month: "May", sales: 1890, profit: 4800 },
  { month: "Jun", sales: 2390, profit: 3800 },
];

interface SalesChartProps {
  categories: string[];
  partners: string[];
  services: string[];
}

export default function SalesChart({
  categories,
  partners,
  services,
}: SalesChartProps) {
  return (
    // ResponsiveContainer makes the chart scale to its parent's width/height
    <div className="block w-full">
      <div className="w-full h-100">
        <ResponsiveContainer>
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            {/* Visual grid background */}
            <CartesianGrid strokeDasharray="3 3" />

            {/* Axes configuration mapped to data keys */}
            <XAxis dataKey="month" />
            <YAxis />

            {/* Interactive hover tooltips and legends */}
            <Tooltip />
            <Legend />

            {/* Line paths tied to specific numeric keys in your data interface */}
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
            <Line type="monotone" dataKey="profit" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
