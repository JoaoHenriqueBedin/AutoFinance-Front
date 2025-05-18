import StatCard from "@/components/ui/statCard";
import { Calendar } from "@/components/ui/calendar";
import RecentServices from "@/components/ui/recentServices";
import RecentBudgets from "@/components/ui/recentBudgets";

export default function Home() {
  const stats = [
    { label: "Clientes", value: 0 },
    { label: "Ordens em andamento", value: 0 },
    { label: "Veículos", value: 0 },
    { label: "Faturamento mensal", value: 0 },
  ];

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

          <div className="w-full">
            <Calendar />
          </div>
        </div>

        {/* Coluna Direita */}
        <div className="flex flex-col space-y-6">
        
          <RecentServices />

          <RecentBudgets />
        </div>
      </div>
    </div>
  );
}
