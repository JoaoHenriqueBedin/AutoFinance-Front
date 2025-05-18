// src/components/ui/StatCard.tsx
import React from "react";

type StatCardProps = {
  label: string;
  value: number;
};

export default function StatCard({ label, value }: StatCardProps) {
  return (
    <div
      className="
          w-full        
          h-24
          rounded shadow p-2 flex flex-col items-center justify-center bg-gray-50
        "
    >
      <span className="text-xs text-gray-600">{label}</span>
      <span className="text-xl font-semibold text-slate-800">{value}</span>
    </div>
  );
}
