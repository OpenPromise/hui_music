import { NextResponse } from "next/server";
import { getCharts } from "@/lib/api/discover";

export async function GET() {
  const charts = await getCharts();
  return NextResponse.json(charts);
} 