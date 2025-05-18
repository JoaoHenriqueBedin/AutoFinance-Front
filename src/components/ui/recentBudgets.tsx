// src/components/ui/RecentBudgets.tsx
import React from "react";
import { FileText } from "lucide-react";

type Budget = {
  id: string;
  client: string;
  amount: number;
};

const mockBudgets: Budget[] = [
  { id: "1", client: "Gustavo Adoryan", amount: 4500 },
  { id: "2", client: "Silvio Dayko",     amount: 750 },
  { id: "3", client: "Marcos Henrique",  amount: 1160 },
  { id: "4", client: "João Bedin",       amount: 110 },
];

export default function RecentBudgets() {
  return (
    <div className="flex flex-col h-full">
      <h3 className="text-lg font-medium mb-1">Orçamentos realizados</h3>
      <p className="text-sm text-gray-500 mb-4">
        Orçamentos feitos anteriormente
      </p>

      <ul className="flex-1 overflow-auto">
        {mockBudgets.map((b) => (
          <li
            key={b.id}
            className="flex items-center justify-between py-3 border-b last:border-b-0"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-purple-500" />
              <span className="text-gray-800">{b.client}</span>
            </div>
            <span className="text-gray-800 font-semibold">
              R${" "}
              {b.amount.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
