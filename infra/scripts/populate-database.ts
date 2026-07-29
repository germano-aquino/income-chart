import fs from "fs";
import { parse } from "csv-parse";
import * as iconv from "iconv-lite";

interface ChartDataItem {
  date: Date;
  partner: string;
  service: string;
  category: string;
  income: number;
}

interface DatabaseItem {
  "Atendimento/Venda": string;
  "Pagamento / Estorno": Date;
  "Data de Liberaçao do Rateio": Date;
  Profissional: string;
  Assistente: string;
  "Serviço/Produto/Pacote": string;
  Categoria: string;
  "Consumo de Pacote": string;
  Cliente: string;
  CPF: string;
  Valor: number;
  "Desconto Cliente": number;
  "Desconto administrativo": number;
  "Pago em": string;
  "Motivo de Desconto": string;
  "Custo operacional": number;
  "Valor Base Rateio": number;
  "% Rateio": number;
  "Desconto Operadora": number;
  "Valor Rateio": number;
  "Quem registrou a transação": string;
  "Rateio para": string;
  "Numero da NFC-e": string;
  "Data de Emissão da NFC-e": string;
  "Status da NFC-e": string;
}

const results = [] as ChartDataItem[];
const services: Set<string> = new Set();
const categories: Set<string> = new Set();
const partners: Set<string> = new Set();

async function getDataFromCsv() {
  await new Promise(async (resolve, rejects) => {
    const records: DatabaseItem[] = [];

    const parser = parse({
      columns: true,
      delimiter: ",",
      relax_column_count: true,
      trim: true,
      skip_empty_lines: true,
    });

    const decoderStream = iconv.decodeStream("win1252");

    fs.createReadStream("./infra/database/relatorio_14_jan_jun.csv")
      .pipe(decoderStream)
      .pipe(parser)
      .on("data", (row: DatabaseItem) => {
        results.push({
          date: new Date(row["Atendimento/Venda"]),
          partner: row["Profissional"],
          service: row["Serviço/Produto/Pacote"],
          category: row["Categoria"],
          income: row["Valor Rateio"],
        });
        partners.add(row["Profissional"]);
        services.add(row["Categoria"]);
        categories.add(row["Serviço/Produto/Pacote"]);
      })
      .on("error", (err: Error) => rejects(err))
      .on("end", () => {
        resolve(records);
      });
  });
}

async function main() {
  await getDataFromCsv();
  console.log(results);
}

(async () => {
  await main();
})();
