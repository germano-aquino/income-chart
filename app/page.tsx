import SalesChart from "@/components/Chart";
import ChartDataSet from "@/models/ChartDataSet";

export default async function Home() {
  const dataset = new ChartDataSet();
  await dataset.getDataFromCsv();

  const categories = dataset.getCategories();
  const partners = dataset.getPartners();
  const services = dataset.getServices();

  return (
    <div className="flex flex-col flex-1 items-center h-screen justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center gap-8 py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Gráfico de Receita
          </h1>
        </div>
        <SalesChart
          categories={categories}
          partners={partners}
          services={services}
        />
      </main>
    </div>
  );
}
