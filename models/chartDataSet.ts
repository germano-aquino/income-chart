import database from "@/infra/database";
import { ValidationError } from "@/infra/errors";

interface ChartFilter {
  store: string | null;
  partner: string | null;
  service: string | null;
  category: string | null;
  start_date: string | null;
  end_date: string | null;
  time_granularity: "month" | "day";
}

export default class ChartDataSet {
  async get(inputValues: ChartFilter) {
    const validInputs = getValidInputs(inputValues);

    const chartDataSetInfo = await runSelectQuery(inputValues);
    return chartDataSetInfo;

    function getValidInputs(inputValues: ChartFilter) {
      const validInputs = {} as ChartFilter;

      validInputs["store"] = getValidStore(inputValues);
      console.log(validInputs);

      if (inputValues.partner && inputValues.partner === "undefined")
        validInputs["partner"] = null;
      return validInputs;
    }

    function getValidStore(inputValues: ChartFilter) {
      const storeNames = ["14", "umarizal", "duque", "batista"];
      const emptyValues = ["undefined", "null"];
      if (!inputValues.store || emptyValues.includes(inputValues.store))
        return null;

      if (storeNames.includes(inputValues.store)) return inputValues.store;

      throw new ValidationError({
        message: "O campo store está inválido.",
        action:
          "Verifique se a seleção de filtros está correta e tente novamente.",
      });
    }

    async function runSelectQuery(inputValues: ChartFilter) {
      const store = inputValues.store;
      const partner = inputValues.partner;
      const service = inputValues.service;
      const category = inputValues.category;
      const startDate = inputValues.start_date;
      const endDate = inputValues.end_date;
      const timeGranularity =
        inputValues.time_granularity === "month" ? "YYYY-MM" : "YYYY-MM-DD";

      const values = [timeGranularity];

      let query = `
          SELECT 
            TO_CHAR(date, $1) AS date_label,
            ROUND(SUM(income_in_cents) / 100.0, 2) AS receita
          FROM sales
          WHERE
            1 = 1 `;

      if (startDate) {
        values.push(startDate);
        query += `AND ( date >= $${values.length} )`;
      }

      if (endDate) {
        values.push(endDate);
        query += `AND ( date <= $${values.length} )`;
      }

      if (store) {
        values.push(store);
        query += `AND ( store = $${values.length} )`;
      }

      if (partner) {
        values.push(partner);
        query += `AND ( LOWER(partner) = LOWER($${values.length}) )`;
      }

      if (service) {
        values.push(service);
        query += `AND ( LOWER(service) = LOWER($${values.length}) )`;
      }

      if (category) {
        values.push(category);
        query += `AND ( LOWER(category) = LOWER($${values.length}) )`;
      }

      query += `
        GROUP BY date_label
        ORDER BY date_label ASC;
      `;

      const results = await database.query({
        text: query,
        values,
      });

      console.log(query);
      console.log(values);

      return results.rows;
    }
  }
}
