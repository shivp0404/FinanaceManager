"use client";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

type CategoryData = {
  name: string;
  amount: number;
};

type DailyData = {
  day: string;
  amount: number;
};

type Props = {
  categoryData: CategoryData[];
  dailyData: DailyData[];
};

const COLORS = [
  "#3B82F6",
  "#8B5CF6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#06B6D4",
  "#64748B",
];

const currency = (value: number) =>
  `₹${value.toLocaleString("en-IN")}`;

export default function DashboardCharts({
  categoryData,
  dailyData,
}: Props) {
  return (
    <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">

      {/* Category Spending */}
      <div className="rounded-xl bg-white p-5 shadow">

        <h2 className="text-lg font-semibold">
          Spending by Category
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Distribution of your monthly expenses
        </p>

        {categoryData.length === 0 ? (
          <p className="mt-10 text-center text-gray-500">
            No expense data available.
          </p>
        ) : (
          <div className="mt-5 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="amount"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={95}
                  innerRadius={55}
                  paddingAngle={3}
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(value) => currency(Number(value))}
                />

                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Daily Spending */}
      <div className="rounded-xl bg-white p-5 shadow">

        <h2 className="text-lg font-semibold">
          Spending Trend
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Your daily expenses this month
        </p>

        <div className="mt-5 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="day"
                label={{
                  value: "Day of month",
                  position: "insideBottom",
                  offset: -5,
                }}
              />

              <YAxis
                tickFormatter={(value) =>
                  `₹${value >= 1000 ? `${value / 1000}k` : value}`
                }
              />

              <Tooltip
                formatter={(value) => currency(Number(value))}
                labelFormatter={(label) => `Day ${label}`}
              />

              <Line
                type="monotone"
                dataKey="amount"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}