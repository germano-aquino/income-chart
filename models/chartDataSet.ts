import database from "@/infra/database";
import { ValidationError } from "@/infra/errors";
import validator from "@/utils/validator";

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
  static readonly EMPTY_VALUES = ["undefined", "null", ""];

  async get(inputValues: ChartFilter) {
    const validInputs = getValidInputs(inputValues);

    const chartDataSetInfo = await runSelectQuery(validInputs);
    return chartDataSetInfo;

    function getValidInputs(inputValues: ChartFilter) {
      const validInputs = {} as ChartFilter;

      validInputs["store"] = getValidStore(inputValues);
      validInputs["start_date"] = getValidDate(inputValues, "start_date");
      validInputs["end_date"] = getValidDate(inputValues, "end_date");
      validInputs["partner"] = getValidString(inputValues, "partner");
      validInputs["service"] = getValidString(inputValues, "service");
      validInputs["category"] = getValidString(inputValues, "category");
      validInputs["time_granularity"] = getValidTimeGranularity(inputValues);

      return validInputs;
    }

    function getValidStore(inputValues: ChartFilter) {
      const storeNames = ["14", "umarizal", "duque", "batista"];
      if (
        !inputValues.store ||
        ChartDataSet.EMPTY_VALUES.includes(inputValues.store)
      )
        return null;

      if (storeNames.includes(inputValues.store)) return inputValues.store;

      throw new ValidationError({
        message: "O campo store está inválido.",
        action:
          "Verifique se a seleção de filtros está correta e tente novamente.",
      });
    }

    function getValidDate(
      inputValue: ChartFilter,
      key: "start_date" | "end_date",
    ) {
      if (
        !inputValue[key] ||
        ChartDataSet.EMPTY_VALUES.includes(inputValue[key])
      )
        return null;

      if (!validator.date(inputValue[key])) {
        throw new ValidationError({
          action:
            "Verifique se a seleção de filtros está correta e tente novamente.",
          message: `O campo ${key} está inválido.`,
        });
      }
      return inputValue[key];
    }

    function getValidString(
      inputValues: ChartFilter,
      key: "partner" | "service" | "category",
    ) {
      if (
        !inputValues[key] ||
        ChartDataSet.EMPTY_VALUES.includes(inputValues[key])
      )
        return null;

      return inputValues[key];
    }

    function getValidTimeGranularity(inputValues: ChartFilter) {
      if (
        inputValues["time_granularity"] !== "day" &&
        inputValues["time_granularity"] !== "month"
      ) {
        throw new ValidationError({
          action:
            "Verifique se a seleção de filtros está correta e tente novamente.",
          message: `O campo time_granularity está inválido.`,
        });
      }

      return inputValues["time_granularity"];
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

      return results.rows;
    }
  }
}
