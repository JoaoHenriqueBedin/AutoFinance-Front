// src/components/ui/RecentServices.tsx
import React from "react";
import { Car } from "lucide-react";
import type { ServicoRecente } from "@/servicos/dashboard-service";

type RecentServicesProps = {
  services: ServicoRecente[];
};

export default function RecentServices({ services }: RecentServicesProps) {
  return (
    <div className="flex flex-col h-full">
      <h3 className="text-lg font-medium mb-1">Últimos Serviços</h3>
      <p className="text-sm text-gray-500 mb-4">
        Atendimentos feitos anteriormente
      </p>

      <ul className="flex-1 overflow-auto">
        {services.length === 0 ? (
          <li className="py-3 text-gray-500 text-center">
            Nenhum serviço recente
          </li>
        ) : (
          services.map((s, index) => (
            <li
              key={index}
              className="flex items-center justify-between py-3 border-b last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <Car className="w-6 h-6 text-purple-500" />
                <span className="text-gray-800">{s.nomeCliente}</span>
              </div>
              <span className="text-gray-800 font-semibold">
                R${" "}
                {s.valorTotal.toLocaleString("pt-BR", {
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
