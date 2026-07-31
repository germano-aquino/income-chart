"use client";

import { useEffect, useState } from "react";
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

interface ChartDataItem {
  month: string;
  sales: number;
}

export default function SalesChart() {
  const [data, setData] = useState<ChartDataItem[]>([]);

  useEffect(() => {
    fetch("/api/v1/chart-sales", {
      method: "POST",
      body: JSON.stringify({
        store: "14",
        time_granularity: "month",
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      });
  }, []);

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
            <XAxis dataKey="date_label" />
            <YAxis />

            {/* Interactive hover tooltips and legends */}
            <Tooltip />
            <Legend />

            {/* Line paths tied to specific numeric keys in your data interface */}
            <Line
              type="monotone"
              dataKey="receita"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
