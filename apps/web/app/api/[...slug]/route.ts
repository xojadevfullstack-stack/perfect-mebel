import { dispatchApiRoute } from "@/lib/api-handlers/router";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

interface RouteParams {
  params: {
    slug: string[];
  };
}

export async function GET(req: Request, { params }: RouteParams) {
  return dispatchApiRoute(req, params.slug || []);
}

export async function POST(req: Request, { params }: RouteParams) {
  return dispatchApiRoute(req, params.slug || []);
}

export async function PUT(req: Request, { params }: RouteParams) {
  return dispatchApiRoute(req, params.slug || []);
}

export async function PATCH(req: Request, { params }: RouteParams) {
  return dispatchApiRoute(req, params.slug || []);
}

export async function DELETE(req: Request, { params }: RouteParams) {
  return dispatchApiRoute(req, params.slug || []);
}
