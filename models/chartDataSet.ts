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

export default class ChartDataSet {
  private static dataRetrieved = false;
  private results = [] as ChartDataItem[];
  private services: Set<string> = new Set();
  private categories: Set<string> = new Set();
  private partners: Set<string> = new Set();

  constructor() {}

  public async getDataFromCsv() {
    if (ChartDataSet.dataRetrieved) return;

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
          this.results.push({
            date: new Date(row["Atendimento/Venda"]),
            partner: row["Profissional"],
            service: row["Serviço/Produto/Pacote"],
            category: row["Categoria"],
            income: row["Valor Rateio"],
          });
          this.partners.add(row["Profissional"]);
          this.services.add(row["Categoria"]);
          this.categories.add(row["Serviço/Produto/Pacote"]);
        })
        .on("error", (err: Error) => rejects(err))
        .on("end", () => {
          resolve(records);
        });
    });

    const output = JSON.stringify(this.results, null, 2);
    const buffer = iconv.encode(output, "windows-1252");

    fs.writeFileSync("./infra/database/output.txt", buffer);

    ChartDataSet.dataRetrieved = true;
  }

  public getServices(): string[] {
    return Array.from(this.services);
  }

  public getCategories(): string[] {
    return Array.from(this.categories);
  }

  public getPartners(): string[] {
    return Array.from(this.partners);
  }
}
