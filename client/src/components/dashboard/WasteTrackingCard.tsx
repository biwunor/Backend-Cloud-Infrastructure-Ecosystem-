import { Card } from "@/components/ui/card";
import { useState } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";

interface ChartDataItem {
  day: string;
  amount: number;
}

interface WasteTrackingCardProps {
  chartData: ChartDataItem[];
  weeklyAverage: number;
  recyclingRate: number;
  weeklyComparison: number;
  recyclingComparison: number;
}

const WasteTrackingCard = ({
  chartData,
  weeklyAverage,
  recyclingRate,
  weeklyComparison,
  recyclingComparison,
}: WasteTrackingCardProps) => {
  const [timeframe, setTimeframe] = useState<"weekly" | "monthly" | "yearly">("weekly");

  return (
    <Card className="overflow-hidden h-full">
      <div className="p-4 bg-primary text-white flex justify-between items-center">
        <h2 className="font-semibold text-lg">Waste Tracking</h2>
        <div className="flex space-x-2">
          <button
            className={`text-sm font-medium p-1 rounded ${
              timeframe === "weekly" ? "text-white" : "text-white/70 hover:bg-primary-dark"
            }`}
            onClick={() => setTimeframe("weekly")}
          >
            Weekly
          </button>
          <button
            className={`text-sm font-medium p-1 rounded ${
              timeframe === "monthly" ? "text-white" : "text-white/70 hover:bg-primary-dark"
            }`}
            onClick={() => setTimeframe("monthly")}
          >
            Monthly
          </button>
          <button
            className={`text-sm font-medium p-1 rounded ${
              timeframe === "yearly" ? "text-white" : "text-white/70 hover:bg-primary-dark"
            }`}
            onClick={() => setTimeframe("yearly")}
          >
            Yearly
          </button>
        </div>
      </div>
      <div className="p-4">
        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 10, left: 10, bottom: 5 }}
            >
              <XAxis dataKey="day" axisLine={false} tickLine={false} />
              <Tooltip
                formatter={(value) => [`${value} kg`, 'Waste']}
                labelFormatter={(value) => `${value}`}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #E0E6E0',
                  borderRadius: '4px'
                }}
              />
              <Bar
                dataKey="amount"
                fill="#2E7D32"
                radius={[4, 4, 0, 0]}
                barSize={30}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="p-3 bg-neutral-lightest rounded-md">
            <div className="text-xs text-neutral-medium">Weekly Average</div>
            <div className="font-semibold mt-1">{weeklyAverage} kg</div>
            <div className={`mt-1 text-xs flex items-center ${weeklyComparison < 0 ? 'text-green-600' : 'text-red-600'}`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 mr-1"
              >
                {weeklyComparison < 0 ? (
                  <path d="M7 6v12L1 12" />
                ) : (
                  <path d="M7 18V6l6 6" />
                )}
              </svg>
              <span>{Math.abs(weeklyComparison)}% {weeklyComparison < 0 ? 'less' : 'more'}</span>
            </div>
          </div>
          <div className="p-3 bg-neutral-lightest rounded-md">
            <div className="text-xs text-neutral-medium">Recycling Rate</div>
            <div className="font-semibold mt-1">{recyclingRate}%</div>
            <div className={`mt-1 text-xs flex items-center ${recyclingComparison > 0 ? 'text-green-600' : 'text-red-600'}`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 mr-1"
              >
                {recyclingComparison > 0 ? (
                  <path d="M7 18V6l6 6" />
                ) : (
                  <path d="M7 6v12L1 12" />
                )}
              </svg>
              <span>{Math.abs(recyclingComparison)}% {recyclingComparison > 0 ? 'better' : 'worse'}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default WasteTrackingCard;
