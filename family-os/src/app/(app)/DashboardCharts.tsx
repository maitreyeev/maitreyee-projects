"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import Card from "@/components/Card";

const TYPE_LABELS: Record<string, string> = {
  bill: "Bills",
  subscription: "Subscriptions",
  insurance: "Insurance",
  warranty: "Warranties",
  obligation: "Loans/EMIs",
};

const COLORS = ["#8B7CF6", "#E0873E", "#2CA97A", "#3E8FD1", "#C79A1E"];

export default function DashboardCharts({ billsByType }: { billsByType: { type: string; total: number }[] }) {
  const data = billsByType
    .filter((b) => b.total > 0)
    .map((b) => ({ name: TYPE_LABELS[b.type] ?? b.type, value: b.total }));

  if (data.length === 0) return null;

  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <Card className="p-5">
      <h2 className="font-extrabold mb-1">Unpaid, by category</h2>
      <p className="text-xs text-muted mb-3">₹{total.toLocaleString("en-IN")} outstanding right now</p>
      <div className="flex items-center gap-4">
        <div className="h-32 w-32 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" innerRadius={35} outerRadius={60} paddingAngle={3}>
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => `₹${Number(v).toLocaleString("en-IN")}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 flex flex-col gap-1.5 min-w-0">
          {data.map((d, i) => (
            <div key={d.name} className="flex items-center gap-2 text-sm">
              <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
              <span className="truncate flex-1">{d.name}</span>
              <span className="font-bold shrink-0">₹{d.value.toLocaleString("en-IN")}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
