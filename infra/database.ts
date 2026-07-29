import { Client, QueryConfig } from "pg";
import { ServiceError } from "./errors";

async function query(queryObject: QueryConfig) {
  let client;

  try {
    client = await getNewClient();
    const result = await client.query(queryObject);

    return result;
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      const serviceErrorObject = new ServiceError({
        message: "Erro na conexão com o Banco ou com a Query.",
        cause: error,
      });
      throw serviceErrorObject;
    } else throw error;
  } finally {
    client?.end();
  }
}

async function getNewClient() {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    ssl: process.env.NODE_ENV === "production",
  });
  await client.connect();

  return client;
}

const database = { query, getNewClient };

export default database;
