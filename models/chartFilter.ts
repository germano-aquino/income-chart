import database from "@/infra/database";

export default class ChartFilter {
  public async get() {
    const categories = await runSelectDistinctField("category");

    const services = await runSelectDistinctField("service");

    const partners = await runSelectDistinctField("partner");

    const stores = await runSelectDistinctField("store");

    return {
      categories: categories.map((category) => category.category),
      services: services.map((service) => service.service),
      partners: partners.map((partner) => partner.partner),
      stores: stores.map((store) => store.store),
    };

    async function runSelectDistinctField(
      field: string,
    ): Promise<Record<string, string>[]> {
      const query = `SELECT DISTINCT ${field} FROM sales;`;

      const results = await database.query({ text: query });
      return results.rows;
    }
  }
}
