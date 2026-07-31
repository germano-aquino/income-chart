import database from "@/infra/database";

interface ChartFilter {
  store: string;
  partner?: string;
  service?: string;
  category?: string;
  start_date?: string;
  end_date?: string;
  time_granularity: "month" | "day";
}

export default class ChartDataSet {
  async get(inputValues: ChartFilter) {
    const chartDataSetInfo = await runSelectQuery(inputValues);
    return chartDataSetInfo;

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
        query += `AND ( date >= $${values.length} )`;
      }

      if (store) {
        values.push(store);
        query += `AND ( store = $${values.length} )`;
      }

      if (partner) {
        values.push(partner);
        query += `AND ( partner = $${values.length} )`;
      }

      if (service) {
        values.push(service);
        query += `AND ( service = $${values.length} )`;
      }

      if (category) {
        values.push(category);
        query += `AND ( category = $${values.length} )`;
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
