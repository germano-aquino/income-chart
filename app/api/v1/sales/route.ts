import { withErrorHandler } from "@/infra/with-error-handler";
import { Sale } from "@/models/sale";
import { NextResponse } from "next/server";

export const POST = withErrorHandler(async (request: Request) => {
  const userInputValues = await request.json();

  const sale = new Sale();
  const createdSale = await sale.create(userInputValues);

  return NextResponse.json(createdSale, { status: 201 });
});
