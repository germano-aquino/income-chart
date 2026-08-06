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
import ChartFilters from "./chartFilters";

interface ChartDataItem {
  month: string;
  sales: number;
}

export interface ChartFilter {
  store?: string | null;
  partner?: string | null;
  service?: string | null;
  category?: string | null;
  startDate?: Date | undefined;
  endDate?: Date | undefined;
  timeGranularity: string;
}

export interface ChartFilterBody {
  store?: string | null;
  partner?: string | null;
  service?: string | null;
  category?: string | null;
  start_date?: Date | undefined;
  end_date?: Date | undefined;
  time_granularity: string;
}

export default function SalesChart() {
  const [data, setData] = useState<ChartDataItem[]>([]);
  const [loading, setLoading] = useState(false);

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

  async function handleGenerateChart(filter: ChartFilter) {
    try {
      console.log(filter);
      setLoading(true);
      fetch("/api/v1/chart-sales", {
        method: "POST",
        body: getFilterBody(filter),
      })
        .then((res) => res.json())
        .then((data) => {
          setData(data);
        });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function getFilterBody(filter: ChartFilter) {
    const body = {
      time_granularity: filter.timeGranularity,
    } as ChartFilterBody;

    if (filter.store && filter.store !== "all") body["store"] = filter.store;
    if (filter.partner && filter.partner !== "all")
      body["partner"] = filter.partner;
    if (filter.service && filter.service !== "all")
      body["service"] = filter.service;
    if (filter.category && filter.category !== "all")
      body["category"] = filter.category;
    if (filter.startDate) body["start_date"] = filter.startDate;
    if (filter.endDate) body["end_date"] = filter.endDate;

    console.log(filter);
    console.log("body");
    console.log(body);
    return JSON.stringify(body);
  }

  return (
    // ResponsiveContainer makes the chart scale to its parent's width/height
    <div className="block w-full">
      <div className="w-full h-100">
        <ChartFilters
          handleGenerateChart={handleGenerateChart}
          loading={loading}
        />
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
