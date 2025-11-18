// src/components/ui/StatCard.tsx


type StatCardProps = {
  label: string;
  value: number;
  isCurrency?: boolean;
};

export default function StatCard({ label, value, isCurrency = false }: StatCardProps) {
  const formattedValue = isCurrency
    ? `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : value;

  return (
    <div
      className="
          w-full        
          h-24
          rounded shadow p-2 flex flex-col items-center justify-center bg-gray-50
        "
    >
      <span className="text-xs text-gray-600">{label}</span>
      <span className="text-xl font-semibold text-slate-800">{formattedValue}</span>
    </div>
  );
}
