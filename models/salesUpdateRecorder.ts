import database from "@/infra/database";
import { NotFoundError, ValidationError } from "@/infra/errors";
import Store, { StoreNames } from "@/infra/store";
import validator from "@/utils/validator";

interface createInputValues {
  store: StoreNames;
  date: string;
}

export default class SalesUpdateRecorder {
  async getLastUpdateDate(store: StoreNames) {
    if (!store || !Store.NAMES.includes(store))
      throw new ValidationError({
        message: "O campo store está inválido.",
        action: "Verifique se o campo store está correto e tente novamente.",
      });

    const lastDate = await runSelectQuery(store);
    return lastDate.date;

    async function runSelectQuery(store: StoreNames) {
      const results = await database.query({
        text: `
          SELECT
            date
          FROM
            last_update_sale
          WHERE
            LOWER(store) = LOWER($1)
        ;`,
        values: [store],
      });

      if (results.rows.length === 0)
        throw new NotFoundError({
          message: `Não foi possível encontrar a última data de atualização para loja ${store}`,
          action: `Verifique se o nome da loja está correto e tente novamente.`,
        });

      return results.rows[0];
    }
  }

  async setLastUpdateDate(date: Date, store: StoreNames) {
    this.validateStoreAndDate(store, date.toISOString());

    const record = await runUpdateQuery(date, store);
    return record;

    async function runUpdateQuery(date: Date, store: StoreNames) {
      const results = await database.query({
        text: `
          UPDATE
            last_update_sale
          SET
            date = $1,
            updated_at = timezone('utc', now())
          WHERE
            LOWER(store) = LOWER($2)
          RETURNING
            date
        ;`,
        values: [date, store],
      });

      if (results.rows.length === 0)
        throw new NotFoundError({
          message: `Não foi possível encontrar a loja ${store}`,
          action: `Verifique se o nome da loja está correto e tente novamente.`,
        });

      return results.rows[0];
    }
  }

  async create(inputValues: createInputValues) {
    this.validateStoreAndDate(inputValues.store, inputValues.date);

    const newRecord = await runInsertQuery(inputValues.date, inputValues.store);
    return newRecord;

    async function runInsertQuery(date: string, store: StoreNames) {
      const results = await database.query({
        text: `
          INSERT INTO
            last_update_sale
            (date, store)
          VALUES
            ($1, $2)
          RETURNING
            *
        ;`,
        values: [date, store],
      });

      return results.rows[0];
    }
  }

  private validateStoreAndDate(store: StoreNames, date: string) {
    if (!store || !Store.NAMES.includes(store))
      throw new ValidationError({
        message: "O campo store está inválido.",
        action: "Verifique se o campo store está correto e tente novamente.",
      });

    if (!date || !validator.date(date))
      throw new ValidationError({
        message: "O campo date está inválido.",
        action: "Verifique se o campo date está correto e tente novamente.",
      });
  }
}
