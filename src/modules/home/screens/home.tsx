import * as React from "react";
import StatCard from "@/components/ui/statCard";
import { Calendar } from "@/components/ui/calendar";
import RecentServices from "@/components/ui/recentServices";
import RecentBudgets from "@/components/ui/recentBudgets";
import { getAgendamentos } from "@/servicos/schedules-service";
import { startOfDay, parseISO } from "date-fns";

export default function Home() {
  const [diasComAgendamento, setDiasComAgendamento] = React.useState<Date[]>([]);

  const stats = [
    { label: "Clientes", value: 0 },
    { label: "Ordens em andamento", value: 0 },
    { label: "Veículos", value: 0 },
    { label: "Faturamento mensal", value: 0 },
  ];

  // Carregar agendamentos
  React.useEffect(() => {
    const loadAgendamentos = async () => {
      try {
        const data = await getAgendamentos();
        
        // Extrair datas únicas dos agendamentos
        const datas = data.map((agendamento) => {
          const date = parseISO(agendamento.dataAgendada);
          return startOfDay(date);
        });
        
        // Remover duplicatas usando Set
        const datasUnicas = Array.from(
          new Set(datas.map(d => d.getTime()))
        ).map(time => new Date(time));
        
        setDiasComAgendamento(datasUnicas);
      } catch (error) {
        console.error("Erro ao carregar agendamentos:", error);
      }
    };

    loadAgendamentos();
  }, []);

  return (
    <div className="px-4 py-6 space-y-6">
      <h2 className="text-lg font-semibold text-gray-700">Início</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Coluna Esquerda */}
        <div className="flex flex-col space-y-6">
          <div className="grid grid-cols-2 gap-2">
            {stats.map((stat) => (
              <StatCard 
                key={stat.label} 
                label={stat.label} 
                value={stat.value} 
              />
            ))}
          </div>

          <div className="w-full h-[360px] flex items-start">
            <Calendar 
              modifiers={{
                comAgendamento: diasComAgendamento
              }}
              modifiersClassNames={{
                comAgendamento: "bg-red-500 text-white hover:bg-red-600 hover:text-white"
              }}
            />
          </div>
        </div>

        {/* Coluna Direita */}
        <div className="flex flex-col space-y-6 w-full">
        
          <RecentServices />

          <RecentBudgets />
        </div>
      </div>
    </div>
  );
}
