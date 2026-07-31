import { withErrorHandler } from "@/infra/with-error-handler";
import ChartDataSet from "@/models/chartDataSet";
import { NextResponse } from "next/server";

export const POST = withErrorHandler(async (request: Request) => {
  const userInputValues = await request.json();

  const chartDataSet = new ChartDataSet();
  const dataSetInfo = await chartDataSet.get(userInputValues);

  return NextResponse.json(dataSetInfo, { status: 200 });
});
