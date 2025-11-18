// src/components/ui/RecentBudgets.tsx
import React from "react";
import { FileText } from "lucide-react";
import type { OrcamentoRecente } from "@/servicos/dashboard-service";

type RecentBudgetsProps = {
  budgets: OrcamentoRecente[];
};

export default function RecentBudgets({ budgets }: RecentBudgetsProps) {
  return (
    <div className="flex flex-col h-full">
      <h3 className="text-lg font-medium mb-1">Orçamentos realizados</h3>
      <p className="text-sm text-gray-500 mb-4">
        Orçamentos feitos anteriormente
      </p>

      <ul className="flex-1 overflow-auto">
        {budgets.length === 0 ? (
          <li className="py-3 text-gray-500 text-center">
            Nenhum orçamento recente
          </li>
        ) : (
          budgets.map((b, index) => (
            <li
              key={index}
              className="flex items-center justify-between py-3 border-b last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-purple-500" />
                <span className="text-gray-800">{b.nomeCliente}</span>
              </div>
              <span className="text-gray-800 font-semibold">
                R${" "}
                {b.valor.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
