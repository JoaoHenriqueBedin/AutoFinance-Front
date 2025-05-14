function Home() {
  const stats = [
    { label: "Clientes", value: 0 },
    { label: "Ordens em andamento", value: 0 },
    { label: "Veículos", value: 0 },
    { label: "Faturamento mensal", value: 0 },
  ];

  return (
    <div className="">
      <h2 className="text-lg font-semibold text-gray-700 mb-4 mt-16 md:mt-0">Início</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="rounded shadow p-4 flex flex-col items-center justify-center"
            style={{
              backgroundColor: "#F9F9F9",
            }}
          >
            <span className="text-sm text-gray-600">{stat.label}:</span>
            <span className="text-3xl font-semibold text-slate-800">0</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
