import { jwtVerify, SignJWT, type JWTPayload } from "jose";
import { cookies } from "next/headers";

function resolveJwtSecret(): Uint8Array {
  const secret = process.env["JWT_SECRET"];
  if (!secret || secret.length < 32) {
    throw new Error(
      "Xavfsizlik xatosi: JWT_SECRET muhit o'zgaruvchisi kiritilishi va kamida 32 belgidan iborat bo'lishi shart!"
    );
  }
  return new TextEncoder().encode(secret);
}

export const getJwtSecret = (): Uint8Array => resolveJwtSecret();

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
