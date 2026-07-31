import SalesChart from "@/components/chart";
import ChartDataSet from "@/models/chartDataSet";

export default async function Home() {
  return (
    <div className="flex flex-col flex-1 items-center h-screen justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-5xl flex-col items-center gap-8 py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-center text-black dark:text-zinc-50">
            Gráfico de Receita
          </h1>
        </div>
        <SalesChart />
      </main>
    </div>
  );
}
