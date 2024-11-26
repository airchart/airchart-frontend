import { FareItem } from "@/remote/useFareItems";
import {
  ResponsiveContainer,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  Line,
} from "recharts";
import { motion } from "framer-motion";

export function FareChart({ fareData }: { fareData: FareItem[] }) {
  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
    >
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm mb-8">
        <h2 className="text-xl font-bold mb-4">가격 변동 추이</h2>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={fareData}>
              <XAxis
                dataKey="search_date"
                tickFormatter={(date) => new Date(date).toLocaleDateString()}
              />
              <YAxis />
              <Tooltip
                formatter={(value) => `${value.toLocaleString()}원`}
                labelFormatter={(date) => new Date(date).toLocaleDateString()}
              />
              <Line
                type="monotone"
                dataKey="fare"
                stroke="#2563eb"
                strokeWidth={2}
                dot={{ fill: "#2563eb" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}
