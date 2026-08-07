import database from "@/infra/database";

export default class ChartFilter {
  public async get() {
    const categories = await runSelectDistinctField("category");

    const services = await runSelectDistinctField("service");

    const partners = await runSelectDistinctField("partner");

    const stores = await runSelectDistinctField("store");

    console.log(stores);
    console.log(categories);
    console.log(partners);
    console.log(services);
    return {
      categories: categories.map((category) => category.lower),
      services: services.map((service) => service.lower),
      partners: partners.map((partner) => partner.lower),
      stores: stores.map((store) => store.lower),
    };

    async function runSelectDistinctField(
      field: string,
    ): Promise<Record<string, string>[]> {
      const query = `SELECT DISTINCT LOWER(${field}) FROM sales;`;

      const results = await database.query({ text: query });
      return results.rows;
    }
  }
}
