import Orchestrator from "@/tests/orchestrator";

const orchestrator = new Orchestrator();

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/v1/recorder-update-sale", () => {
  test("With missing store", async () => {
    const response = await fetch(
      "http://localhost:3000/api/v1/recorder-update-sale",
      {
        method: "POST",
        body: JSON.stringify({
          date: new Date(),
        }),
      },
    );

    expect(response.status).toBe(400);

    const responseBody = await response.json();

    expect(responseBody).toEqual({
      name: "ValidationError",
      status_code: 400,
      action: "Verifique se o campo store está correto e tente novamente.",
      message: "O campo store está inválido.",
    });
  });

  test("With wrong store name", async () => {
    const response = await fetch(
      "http://localhost:3000/api/v1/recorder-update-sale",
      {
        method: "POST",
        body: JSON.stringify({
          date: new Date(),
          store: "wrongName",
        }),
      },
    );

    expect(response.status).toBe(400);

    const responseBody = await response.json();

    expect(responseBody).toEqual({
      name: "ValidationError",
      status_code: 400,
      action: "Verifique se o campo store está correto e tente novamente.",
      message: "O campo store está inválido.",
    });
  });

  test("With missing date", async () => {
    const response = await fetch(
      "http://localhost:3000/api/v1/recorder-update-sale",
      {
        method: "POST",
        body: JSON.stringify({
          store: "14",
        }),
      },
    );

    expect(response.status).toBe(400);

    const responseBody = await response.json();

    expect(responseBody).toEqual({
      name: "ValidationError",
      status_code: 400,
      action: "Verifique se o campo date está correto e tente novamente.",
      message: "O campo date está inválido.",
    });
  });

  test("With wrong date", async () => {
    const response = await fetch(
      "http://localhost:3000/api/v1/recorder-update-sale",
      {
        method: "POST",
        body: JSON.stringify({
          store: "14",
          date: "wrongDate",
        }),
      },
    );

    expect(response.status).toBe(400);

    const responseBody = await response.json();

    expect(responseBody).toEqual({
      name: "ValidationError",
      status_code: 400,
      action: "Verifique se o campo date está correto e tente novamente.",
      message: "O campo date está inválido.",
    });
  });

  test("With valid information", async () => {
    const date = new Date();

    const response = await fetch(
      "http://localhost:3000/api/v1/recorder-update-sale",
      {
        method: "POST",
        body: JSON.stringify({
          store: "14",
          date: date.toISOString(),
        }),
      },
    );

    expect(response.status).toBe(201);

    const responseBody = await response.json();

    expect(responseBody.store).toBe("14");
    expect(responseBody.date).toBe(date.toISOString());
    expect(Number.isNaN(Date.parse(responseBody.created_at))).toBe(false);
    expect(Number.isNaN(Date.parse(responseBody.updated_at))).toBe(false);
  });
});
