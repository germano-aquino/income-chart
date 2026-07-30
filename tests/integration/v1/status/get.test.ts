import Orchestrator from "@/tests/orchestrator";

const orchestrator = new Orchestrator();

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

describe("GET api/v1/status", () => {
  test("Retriving current system status", async () => {
    const response = await fetch("http://localhost:3000/api/v1/status");

    expect(response.status).toBe(200);

    const responseBody = await response.json();

    expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
    expect(responseBody.dependencies.database.version).toBe("16.12");
    expect(responseBody.dependencies.database.opened_connections).toBe(1);
    expect(responseBody.dependencies.database.max_connections).toBeGreaterThan(
      1,
    );
  });
});
