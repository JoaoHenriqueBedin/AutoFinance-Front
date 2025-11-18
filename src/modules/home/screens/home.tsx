import * as React from "react";
import StatCard from "@/components/ui/statCard";
import { Calendar } from "@/components/ui/calendar";
import RecentServices from "@/components/ui/recentServices";
import RecentBudgets from "@/components/ui/recentBudgets";
import { getDashboard, type Dashboard } from "@/servicos/dashboard-service";
import { startOfDay } from "date-fns";

export default function Home() {
  const [diasComAgendamento, setDiasComAgendamento] = React.useState<Date[]>([]);
  const [dashboardData, setDashboardData] = React.useState<Dashboard | null>(null);
  const [loading, setLoading] = React.useState(true);

  // Carregar dados do dashboard
  React.useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        const data = await getDashboard();
        setDashboardData(data);
        
        // Extrair datas do calendário de agendamentos
        const datas = Object.keys(data.calendarioAgendamentos)
          .filter(dataStr => data.calendarioAgendamentos[dataStr])
          .map(dataStr => {
            // Extrai ano, mês e dia da string ISO (ignora timezone)
            const [year, month, day] = dataStr.split('T')[0].split('-').map(Number);
            // Cria uma nova data no timezone local
            return new Date(year, month - 1, day);
          });
        
        setDiasComAgendamento(datas);
      } catch (error) {
        console.error("Erro ao carregar dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const stats = [
    { label: "Clientes cadastrados", value: dashboardData?.totalClientes ?? 0, isCurrency: false },
    { label: "Ordens em andamento", value: dashboardData?.ordensEmAndamento ?? 0, isCurrency: false },
    { label: "Veículos cadastrados", value: dashboardData?.totalVeiculos ?? 0, isCurrency: false },
    { label: "Faturamento mensal previsto", value: dashboardData?.faturamentoMensal ?? 0, isCurrency: true },
  ];

  if (loading) {
    return (
      <div className="px-4 py-6 space-y-6">
        <h2 className="text-lg font-semibold text-gray-700">Início</h2>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Carregando dados do dashboard...</p>
        </div>
      </div>
    );
  }

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
                isCurrency={stat.isCurrency}
              />
            ))}
          </div>

          <div className="w-full h-[360px] flex items-start">
            <Calendar 
              modifiers={{
                comAgendamento: (date) => {
                  // Normaliza a data do calendário para comparação
                  const normalizedDate = startOfDay(date);
                  // Verifica se alguma data do array corresponde
                  return diasComAgendamento.some(
                    agendamento => agendamento.getTime() === normalizedDate.getTime()
                  );
                }
              }}
              modifiersClassNames={{
                comAgendamento: "bg-red-500 text-white hover:bg-red-600 hover:text-white"
              }}
            />
          </div>
        </div>

        {/* Coluna Direita */}
        <div className="flex flex-col space-y-6 w-full">
        
          <RecentServices services={dashboardData?.servicosRecentes ?? []} />

          <RecentBudgets budgets={dashboardData?.orcamentosRecentes ?? []} />
        </div>
      </div>
    </div>
  );
}
