import { exec, ExecException } from "node:child_process";

function checkForPostgres() {
  exec("docker exec postgres-chart pg_isready", handleReturn);

  function handleReturn(error: ExecException | null, stdout: string) {
    if (stdout.search("accepting connection") == -1) {
      process.stdout.write(".");
      checkForPostgres();
      return;
    }

    console.log("\n 🟢 Postgres está pronto e aceitando conexões!");
  }
}

console.log("🔴 Aguardando Postgres aceitar conexões");
checkForPostgres();
