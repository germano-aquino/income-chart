import database from "@/infra/database";
import { ValidationError } from "@/infra/errors";

interface CreateInputValue {
  store: string;
  date: string;
  category: string;
  service: string;
  income_in_cents: number;
  partner: string;
}

type CreateInputValueKeys = keyof CreateInputValue;

export class Sale {
  public async create(userInputValues: CreateInputValue) {
    validateInputs(userInputValues);

    const createdSale = await runInsertQuery(userInputValues);
    return createdSale;

    function validateInputs(inputValues: CreateInputValue) {
      const stringKeys = [
        "store",
        "category",
        "service",
        "partner",
      ] as CreateInputValueKeys[];

      stringKeys.map((key) => {
        validateStringInput(inputValues, key);
      });

      if (!("date" in inputValues) || !isValidDate(inputValues.date)) {
        throw new ValidationError({
          action:
            "Verifique se as informações de venda estão corretas e tente novamente.",
          message: `O campo date está inválido.`,
        });
      }

      if (
        !("income_in_cents" in inputValues) ||
        !isValidPrice(inputValues.income_in_cents)
      ) {
        throw new ValidationError({
          action:
            "Verifique se as informações de venda estão corretas e tente novamente.",
          message: `O campo income_in_cents está inválido.`,
        });
      }
    }

    function validateStringInput(
      inputValues: CreateInputValue,
      key: CreateInputValueKeys,
    ) {
      if (!(key in inputValues) || !inputValues[key]) {
        throw new ValidationError({
          action:
            "Verifique se as informações de venda estão corretas e tente novamente.",
          message: `O campo ${key} está inválido.`,
        });
      }
    }

    function isValidDate(date: string) {
      const dateObj = new Date(date);
      return !Number.isNaN(dateObj.getTime());
    }

    function isValidPrice(value: number) {
      return value >= 0 && Number.isInteger(value);
    }

    async function runInsertQuery(userInputValues: CreateInputValue) {
      const store = userInputValues.store;
      const service = userInputValues.service;
      const partner = userInputValues.partner;
      const category = userInputValues.category;
      const date = userInputValues.date;
      const incomeInCents = userInputValues.income_in_cents;

      const results = await database.query({
        text: `
          INSERT INTO
            sales
            (store, service, partner, category, date, income_in_cents)
          VALUES
            ($1, $2, $3, $4, $5, $6)
          RETURNING
            *
        ;`,
        values: [store, service, partner, category, date, incomeInCents],
      });

      return results.rows[0];
    }
  }
}
