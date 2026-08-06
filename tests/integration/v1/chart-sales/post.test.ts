import Orchestrator from "@/tests/orchestrator";
import converter from "@/utils/converter";
const orchestrator = new Orchestrator();

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
  await insertSalesForTest();
});

async function insertSalesForTest() {
  const salesInputValues = [
    {
      store: "14",
      date: converter.stringToDate("12/01/2026").toISOString(),
      category: "Depilação",
      service: "Buço",
      income_in_cents: 712,
      partner: "Márcia",
    },
    {
      store: "14",
      date: converter.stringToDate("12/02/2026").toISOString(),
      category: "Depilação",
      service: "Suvaco",
      income_in_cents: 4400,
      partner: "Sara",
    },
    {
      store: "14",
      date: converter.stringToDate("12/03/2026").toISOString(),
      category: "Design",
      service: "Coloração",
      income_in_cents: 6698,
      partner: "Jaque",
    },
    {
      store: "umarizal",
      date: converter.stringToDate("12/03/2026").toISOString(),
      category: "Design",
      service: "Coloração",
      income_in_cents: 6698,
      partner: "Ananda",
    },
    {
      store: "14",
      date: converter.stringToDate("12/04/2026").toISOString(),
      category: "Depilação",
      service: "Intima",
      income_in_cents: 7766,
      partner: "Ully",
    },
    {
      store: "14",
      date: converter.stringToDate("12/05/2026").toISOString(),
      category: "Manicure",
      service: "Francesinha",
      income_in_cents: 552,
      partner: "Germano",
    },
    {
      store: "14",
      date: converter.stringToDate("12/06/2026").toISOString(),
      category: "Limpeza de Pele",
      service: "Esfoliação",
      income_in_cents: 7789,
      partner: "Germano",
    },
  ];

  for (const sale of salesInputValues) await orchestrator.insertSale(sale);
}

describe("POST /api/v1/chart-sales", () => {
  test("With invalid store", async () => {
    const response = await fetch("http://localhost:3000/api/v1/chart-sales", {
      method: "POST",
      body: JSON.stringify({
        store: "invalidStore",
        time_granularity: "month",
      }),
    });

    expect(response.status).toBe(400);

    const responseBody = await response.json();

    expect(responseBody).toEqual({
      name: "ValidationError",
      status_code: 400,
      action:
        "Verifique se a seleção de filtros está correta e tente novamente.",
      message: "O campo store está inválido.",
    });
  });

  test("With invalid start_date", async () => {
    const response = await fetch("http://localhost:3000/api/v1/chart-sales", {
      method: "POST",
      body: JSON.stringify({
        start_date: "wrongDate",
        time_granularity: "month",
      }),
    });

    expect(response.status).toBe(400);

    const responseBody = await response.json();

    expect(responseBody).toEqual({
      name: "ValidationError",
      status_code: 400,
      action:
        "Verifique se a seleção de filtros está correta e tente novamente.",
      message: "O campo start_date está inválido.",
    });
  });

  test("With invalid end_date", async () => {
    const response = await fetch("http://localhost:3000/api/v1/chart-sales", {
      method: "POST",
      body: JSON.stringify({
        end_date: "wrongDate",
        time_granularity: "month",
      }),
    });

    expect(response.status).toBe(400);

    const responseBody = await response.json();

    expect(responseBody).toEqual({
      name: "ValidationError",
      status_code: 400,
      action:
        "Verifique se a seleção de filtros está correta e tente novamente.",
      message: "O campo end_date está inválido.",
    });
  });

  test("With invalid time_granularity", async () => {
    const response = await fetch("http://localhost:3000/api/v1/chart-sales", {
      method: "POST",
      body: JSON.stringify({
        time_granularity: "wrongTimeGranularity",
      }),
    });

    expect(response.status).toBe(400);

    const responseBody = await response.json();

    expect(responseBody).toEqual({
      name: "ValidationError",
      status_code: 400,
      action:
        "Verifique se a seleção de filtros está correta e tente novamente.",
      message: "O campo time_granularity está inválido.",
    });
  });

  test("With valid partner", async () => {
    const response = await fetch("http://localhost:3000/api/v1/chart-sales", {
      method: "POST",
      body: JSON.stringify({
        partner: "germano",
        time_granularity: "month",
      }),
    });

    expect(response.status).toBe(200);

    const responseBody = await response.json();

    expect(responseBody).toEqual([
      { date_label: "2026-05", receita: "5.52" },
      { date_label: "2026-06", receita: "77.89" },
    ]);
  });

  test("With valid store", async () => {
    const response = await fetch("http://localhost:3000/api/v1/chart-sales", {
      method: "POST",
      body: JSON.stringify({
        store: "umarizal",
        time_granularity: "month",
      }),
    });

    expect(response.status).toBe(200);

    const responseBody = await response.json();

    expect(responseBody).toEqual([{ date_label: "2026-03", receita: "66.98" }]);
  });

  test("With valid start_date", async () => {
    const response = await fetch("http://localhost:3000/api/v1/chart-sales", {
      method: "POST",
      body: JSON.stringify({
        start_date: converter.stringToDate("01/06/2026"),
        time_granularity: "month",
      }),
    });

    expect(response.status).toBe(200);

    const responseBody = await response.json();

    expect(responseBody).toEqual([{ date_label: "2026-06", receita: "77.89" }]);
  });

  test("With valid end_date", async () => {
    const response = await fetch("http://localhost:3000/api/v1/chart-sales", {
      method: "POST",
      body: JSON.stringify({
        end_date: converter.stringToDate("01/02/2026"),
        time_granularity: "month",
      }),
    });

    expect(response.status).toBe(200);

    const responseBody = await response.json();

    expect(responseBody).toEqual([{ date_label: "2026-01", receita: "7.12" }]);
  });

  test("With correct sum values and time_granularity as month", async () => {
    const response = await fetch("http://localhost:3000/api/v1/chart-sales", {
      method: "POST",
      body: JSON.stringify({
        time_granularity: "month",
      }),
    });

    expect(response.status).toBe(200);

    const responseBody = await response.json();

    expect(responseBody).toEqual([
      { date_label: "2026-01", receita: "7.12" },
      { date_label: "2026-02", receita: "44.00" },
      { date_label: "2026-03", receita: "133.96" },
      { date_label: "2026-04", receita: "77.66" },
      { date_label: "2026-05", receita: "5.52" },
      { date_label: "2026-06", receita: "77.89" },
    ]);
  });
});
