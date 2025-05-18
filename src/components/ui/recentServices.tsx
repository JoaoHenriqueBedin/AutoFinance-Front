// src/components/ui/RecentServices.tsx
import React from "react";
import { Car } from "lucide-react";

type Service = {
  id: string;
  client: string;
  amount: number;
};

const mockServices: Service[] = [
  { id: "1", client: "Gustavo Adoryan", amount: 4500 },
  { id: "2", client: "Silvio Dayko",     amount: 750 },
  { id: "3", client: "Marcos Henrique",  amount: 1160 },
  { id: "4", client: "João Bedin",       amount: 110 },
];

export default function RecentServices() {
  return (
    <div className="flex flex-col h-full">
      <h3 className="text-lg font-medium mb-1">Últimos Serviços</h3>
      <p className="text-sm text-gray-500 mb-4">
        Atendimentos feitos anteriormente
      </p>

      <ul className="flex-1 overflow-auto">
        {mockServices.map((s) => (
          <li
            key={s.id}
            className="flex items-center justify-between py-3 border-b last:border-b-0"
          >
            <div className="flex items-center gap-3">
              <Car className="w-6 h-6 text-purple-500" />
              <span className="text-gray-800">{s.client}</span>
            </div>
            <span className="text-gray-800 font-semibold">
              R${" "}
              {s.amount.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
