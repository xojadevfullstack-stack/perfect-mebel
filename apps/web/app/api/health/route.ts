import { NextResponse } from "next/server";

export interface HealthCheckResponse {
  success: boolean;
  data: {
    status: string;
    environment: string;
    timestamp: string;
  };
}

export async function GET(): Promise<NextResponse<HealthCheckResponse>> {
  return NextResponse.json({
    success: true,
    data: {
      status: "healthy",
      environment: process.env["NODE_ENV"] || "development",
      timestamp: new Date().toISOString(),
    },
  });
}
