import Header from "@/infra/header";
import Store, { StoreNames } from "@/infra/store";
import converter from "@/utils/converter";
import { parse } from "csv-parse/sync";
import { Sale } from "./sale";
import SalesUpdateRecorder from "./salesUpdateRecorder";

export interface DatabaseItem {
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
  "Valor Rateio": string;
  "Quem registrou a transação": string;
  "Rateio para": string;
  "Numero da NFC-e": string;
  "Data de Emissão da NFC-e": string;
  "Status da NFC-e": string;
}

export default class SalesUpdater {
  static readonly URL =
    "https://www.trinks.com/BackOffice/Download/ExportarComissoes";

  private headers;

  constructor() {
    this.headers = new Header();
  }

  async update() {
    const finalDate = new Date();

    for (const store of Store.NAMES) {
      const startDate = await this.getLastUpdateDate(store);
      this.headers.setStore(store);

      const csv = await this.csvRequest(store, startDate, finalDate);
      for (const row of csv) {
        const date = converter.stringToDate(row["Atendimento/Venda"]);
        if (!isNaN(date.getTime())) await this.insertNewSale(store, date, row);
      }
      await this.insertLastUpdateDate(store, finalDate);
    }

    return { date: finalDate };
  }

  private async csvRequest(
    store: StoreNames,
    startDate: Date,
    finalDate: Date,
  ) {
    const body = {
      TipoData: 2,
      DataInicio: startDate.toLocaleString("pt-BR"),
      DataFim: finalDate.toLocaleDateString("pt-BR"),
      TipoItemPago: 1,
      ExibirEstornos: false,
      TipoStatusFiltoPagamaneto: 1,
      idRelacaoProfissional: Store.ID_RELACAO_PARCEIRA[store],
    };

    const encodedBody = converter.encodeBody(body);

    const fileResponse = await fetch(SalesUpdater.URL, {
      method: "POST",
      headers: this.headers.get("formdata"),
      body: encodedBody,
    });

    this.headers.setCookie(fileResponse);

    const fileResponseBody = await fileResponse.json();
    const fileUrl = fileResponseBody.UrlDownload;

    const dataResponse = await fetch(fileUrl);
    const rawData = await dataResponse.arrayBuffer();

    const decoder = new TextDecoder("windows-1252");
    const csvFile = decoder.decode(rawData);

    const csvParsed = parse(csvFile, {
      delimiter: ";",
      columns: true,
      relax_column_count: true,
      from_line: 8,
    });

    return csvParsed as DatabaseItem[];
  }

  private async insertNewSale(
    store: StoreNames,
    date: Date,
    row: DatabaseItem,
  ) {
    try {
      const sale = new Sale();
      await sale.create({
        store,
        date: date.toISOString(),
        category: row["Categoria"],
        income_in_cents: converter.stringToInt(row["Valor Rateio"]),
        partner: row["Profissional"],
        service: row["Serviço/Produto/Pacote"],
      });
    } catch (error) {
      console.error(error);
    }
  }

  private async getLastUpdateDate(store: StoreNames) {
    const recorder = new SalesUpdateRecorder();
    const lastDate = await recorder.getLastUpdateDate(store);
    return lastDate;
  }

  private async insertLastUpdateDate(store: StoreNames, date: Date) {
    const recorder = new SalesUpdateRecorder();
    await recorder.setLastUpdateDate(date, store);
  }
}
