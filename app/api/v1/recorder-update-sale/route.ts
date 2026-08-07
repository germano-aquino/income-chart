import { withErrorHandler } from "@/infra/with-error-handler";
import SalesUpdateRecorder from "@/models/salesUpdateRecorder";
import { NextResponse } from "next/server";

export const POST = withErrorHandler(async (request: Request) => {
  const userInputValues = await request.json();

  const recorder = new SalesUpdateRecorder();
  const createdRecord = await recorder.create(userInputValues);

  return NextResponse.json(createdRecord, { status: 201 });
});
