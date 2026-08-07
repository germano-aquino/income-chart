import fs from "fs";
import { parse } from "csv-parse";
import * as iconv from "iconv-lite";
import converter from "@/utils/converter";
import Orchestrator from "@/tests/orchestrator";
import { DatabaseItem } from "@/models/salesUpdater";

interface ChartDataItem {
  store: string;
  date: Date;
  partner: string;
  service: string;
  category: string;
  income_in_cents: number;
}

async function getDataFromCsv() {
  const storeNames = ["14", "duque", "umarizal", "batista"];

  for (const store of storeNames) {
    const parser = parse({
      columns: true,
      delimiter: ",",
      relax_column_count: true,
      trim: true,
      skip_empty_lines: true,
    });

    const decoderStream = iconv.decodeStream("win1252");

    const stream = fs
      .createReadStream(`./infra/database/relatorio_${store}_jan_jun.csv`)
      .pipe(decoderStream)
      .pipe(parser);

    for await (const row of stream as unknown as DatabaseItem[]) {
      if (!isNaN(converter.stringToDate(row["Atendimento/Venda"]).getTime())) {
        const response = await fetch("http://localhost:3000/api/v1/sales", {
          method: "POST",
          body: JSON.stringify({
            store: store,
            date: converter.stringToDate(row["Atendimento/Venda"]),
            partner: row["Profissional"].toLocaleLowerCase(),
            service: row["Serviço/Produto/Pacote"].toLocaleLowerCase(),
            category: row["Categoria"].toLocaleLowerCase(),
            income_in_cents: converter.stringToInt(row["Valor Rateio"]),
          }),
        });

        if (response.status !== 201) {
          const error = await response.json();
          console.log(error);
        }
      }
    }
  }
}

async function main() {
  const orchestrator = new Orchestrator();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
  await getDataFromCsv();
}

(async () => {
  await main();
})();
