import database from "@/infra/database";
import { withErrorHandler } from "@/infra/with-error-handler";
import { NextResponse } from "next/server";

export const GET = withErrorHandler(async () => {
  const updatedAt = new Date().toISOString();

  const versionResult = await database.query({ text: "SHOW server_version;" });
  const version = versionResult.rows[0].server_version;

  const maxConnectionsResult = await database.query({
    text: "SHOW max_connections;",
  });
  const maxConnections = Number(maxConnectionsResult.rows[0].max_connections);

  const databaseName = process.env.POSTGRES_DB;
  const openedConnectionsResult = await database.query({
    text: "SELECT * FROM pg_stat_activity WHERE state = 'active' AND datname = $1;",
    values: [databaseName],
  });
  const openedConnections = openedConnectionsResult.rowCount;

  const statusBody = {
    updated_at: updatedAt,
    dependencies: {
      database: {
        version,
        max_connections: maxConnections,
        opened_connections: openedConnections,
      },
    },
  };

  return NextResponse.json(statusBody, { status: 200 });
});
