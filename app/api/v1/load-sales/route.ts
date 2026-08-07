import { withErrorHandler } from "@/infra/with-error-handler";
import SalesUpdater from "@/models/salesUpdater";
import SalesUpdateRecorder from "@/models/salesUpdateRecorder";
import { NextResponse } from "next/server";

export const POST = withErrorHandler(async (request: Request) => {
  const sale = new SalesUpdater();
  const lastRecordDate = await sale.update();

  return NextResponse.json(lastRecordDate, { status: 201 });
});
