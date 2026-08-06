import Orchestrator from "@/tests/orchestrator";
const orchestrator = new Orchestrator();

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST api/v1/sales", () => {
  test("With missing store", async () => {
    const response = await fetch("http://localhost:3000/api/v1/sales", {
      method: "POST",
      body: JSON.stringify({
        date: "2026-07-24T00:00:00Z",
        service: "Buço",
        category: "Depilação",
        income_in_cents: 5500,
        partner: "Sara",
      }),
    });

    expect(response.status).toBe(400);

    const responseBody = await response.json();

    expect(responseBody).toEqual({
      name: "ValidationError",
      status_code: 400,
      action:
        "Verifique se as informações de venda estão corretas e tente novamente.",
      message: "O campo store está inválido.",
    });
  });

  test("With missing date", async () => {
    const response = await fetch("http://localhost:3000/api/v1/sales", {
      method: "POST",
      body: JSON.stringify({
        store: "14",
        service: "Buço",
        category: "Depilação",
        income_in_cents: 5500,
        partner: "Sara",
      }),
    });

    expect(response.status).toBe(400);

    const responseBody = await response.json();

    expect(responseBody).toEqual({
      name: "ValidationError",
      status_code: 400,
      action:
        "Verifique se as informações de venda estão corretas e tente novamente.",
      message: "O campo date está inválido.",
    });
  });

  test("With wrong date field", async () => {
    const response = await fetch("http://localhost:3000/api/v1/sales", {
      method: "POST",
      body: JSON.stringify({
        store: "14",
        service: "Buço",
        category: "Depilação",
        date: "wrongDate",
        income_in_cents: 5500,
        partner: "Sara",
      }),
    });

    expect(response.status).toBe(400);

    const responseBody = await response.json();

    expect(responseBody).toEqual({
      name: "ValidationError",
      status_code: 400,
      action:
        "Verifique se as informações de venda estão corretas e tente novamente.",
      message: "O campo date está inválido.",
    });
  });

  test("With missing service", async () => {
    const response = await fetch("http://localhost:3000/api/v1/sales", {
      method: "POST",
      body: JSON.stringify({
        store: "14",
        date: "2026-07-24T00:00:00Z",
        category: "Depilação",
        income_in_cents: 5500,
        partner: "Sara",
      }),
    });

    expect(response.status).toBe(400);

    const responseBody = await response.json();

    expect(responseBody).toEqual({
      name: "ValidationError",
      status_code: 400,
      action:
        "Verifique se as informações de venda estão corretas e tente novamente.",
      message: "O campo service está inválido.",
    });
  });

  test("With missing category", async () => {
    const response = await fetch("http://localhost:3000/api/v1/sales", {
      method: "POST",
      body: JSON.stringify({
        store: "14",
        date: "2026-07-24T00:00:00Z",
        service: "Buço",
        income_in_cents: 5500,
        partner: "Sara",
      }),
    });

    expect(response.status).toBe(400);

    const responseBody = await response.json();

    expect(responseBody).toEqual({
      name: "ValidationError",
      status_code: 400,
      action:
        "Verifique se as informações de venda estão corretas e tente novamente.",
      message: "O campo category está inválido.",
    });
  });

  test("With missing income", async () => {
    const response = await fetch("http://localhost:3000/api/v1/sales", {
      method: "POST",
      body: JSON.stringify({
        store: "14",
        date: "2026-07-24T00:00:00Z",
        service: "Buço",
        category: "Depilação",
        partner: "Sara",
      }),
    });

    expect(response.status).toBe(400);

    const responseBody = await response.json();

    expect(responseBody).toEqual({
      name: "ValidationError",
      status_code: 400,
      action:
        "Verifique se as informações de venda estão corretas e tente novamente.",
      message: "O campo income_in_cents está inválido.",
    });
  });

  test("With missing partner", async () => {
    const response = await fetch("http://localhost:3000/api/v1/sales", {
      method: "POST",
      body: JSON.stringify({
        store: "14",
        date: "2026-07-24T00:00:00Z",
        service: "Buço",
        category: "Depilação",
        income_in_cents: 5500,
      }),
    });

    expect(response.status).toBe(400);

    const responseBody = await response.json();

    expect(responseBody).toEqual({
      name: "ValidationError",
      status_code: 400,
      action:
        "Verifique se as informações de venda estão corretas e tente novamente.",
      message: "O campo partner está inválido.",
    });
  });

  test("With valid information", async () => {
    const response = await fetch("http://localhost:3000/api/v1/sales", {
      method: "POST",
      body: JSON.stringify({
        store: "14",
        date: "2026-07-24T00:00:00Z",
        service: "Buço",
        category: "Depilação",
        income_in_cents: 5500,
        partner: "Sara",
      }),
    });

    expect(response.status).toBe(201);

    const responseBody = await response.json();

    expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
    expect(Date.parse(responseBody.created_at)).not.toBeNaN();
    expect(orchestrator.isUUIDv4Regex(responseBody.id)).toBe(true);
    expect(responseBody.store).toBe("14");
    expect(responseBody.date).toBe("2026-07-24T00:00:00.000Z");
    expect(responseBody.partner).toBe("Sara");
    expect(responseBody.service).toBe("Buço");
    expect(responseBody.category).toBe("Depilação");
    expect(responseBody.income_in_cents).toBe("5500");
  });
});
