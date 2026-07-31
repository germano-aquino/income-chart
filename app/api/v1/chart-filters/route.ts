import { withErrorHandler } from "@/infra/with-error-handler";
import ChartFilter from "@/models/chartFilter";
import { NextResponse } from "next/server";

export const GET = withErrorHandler(async () => {
  const chartFilter = new ChartFilter();
  const filterInfo = await chartFilter.get();

  return NextResponse.json(filterInfo, { status: 200 });
});
