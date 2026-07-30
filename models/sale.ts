import database from "@/infra/database"

export class Sale {

  public async create() {
    const createdSale = await runInsertQuery()
    return createdSale

    async function runInsertQuery() {
      const results = await database.query({
        text: ``,
        values: []
      })

      return results.rows[0]
    }
  }
}