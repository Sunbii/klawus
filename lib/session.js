import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

const SESSION_PASSWORD =
  process.env.SESSION_PASSWORD || "dev-only-fallback-password-please-set-32-chars";

export const sessionOptions = {
  cookieName: "klawus_session",
  password: SESSION_PASSWORD,
  cookieOptions: {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  },
};

export async function getSession() {
  const c = await cookies();
  return getIronSession(c, sessionOptions);
}
