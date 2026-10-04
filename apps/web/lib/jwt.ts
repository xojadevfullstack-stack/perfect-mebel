import { jwtVerify, SignJWT, type JWTPayload } from "jose";
import { cookies } from "next/headers";

const secretEnv = process.env["JWT_SECRET"] || "fallback_development_secret_key_at_least_32_chars";
const JWT_SECRET_BYTES = new TextEncoder().encode(secretEnv);

export const getJwtSecret = (): Uint8Array => JWT_SECRET_BYTES;

export interface AdminSessionPayload extends JWTPayload {
  sub: string;
  name: string;
  username: string;
}

export async function createAdminToken(payload: { id: string; name: string; username: string }): Promise<string> {
  return await new SignJWT({
    sub: payload.id,
    name: payload.name,
    username: payload.username,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getJwtSecret());
}

export async function verifyAdminToken(token: string): Promise<AdminSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    return payload as AdminSessionPayload;
  } catch {
    return null;
  }
}

export async function getAdminSession(): Promise<AdminSessionPayload | null> {
  const cookieStore = cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token) return null;

  return await verifyAdminToken(token);
}
