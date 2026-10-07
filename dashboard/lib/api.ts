/** Talks to the API through this app's own /api proxy (same origin, so the httpOnly login cookie just works). */

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
  }
}

interface Options {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  json?: unknown;
  form?: FormData;
}

/** The API answers errors as { message: string | string[] }. Turn that into one readable sentence. */
function messageFrom(body: unknown, fallback: string): string {
  const m = (body as { message?: unknown } | null)?.message;
  if (Array.isArray(m)) return m.join(". ");
  return typeof m === "string" && m ? m : fallback;
}

export async function api<T>(path: string, { method = "GET", json, form }: Options = {}): Promise<T> {
  const headers: Record<string, string> = {};
  let body: BodyInit | undefined;
  if (json !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(json);
  } else if (form) {
    body = form; // the browser sets the multipart boundary itself
  }

  let res: Response;
  try {
    res = await fetch(`/api${path}`, { method, headers, body });
  } catch {
    throw new ApiError("Cannot reach the server. Check your internet connection and try again.", 0);
  }

  const text = await res.text();
  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    /* not JSON */
  }

  if (res.status === 401 && typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
    // A full page load is intended here (not router.push): it throws away every cached bit of the expired session.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.assign(`/login?next=${encodeURIComponent(window.location.pathname)}`);
  }
  // A gateway error with no JSON body means the dashboard's server could not reach the API at all (it is not
  // running, or API_URL points at the wrong place). Say that, instead of a vague "something went wrong".
  if ([500, 502, 503, 504].includes(res.status) && data === null) {
    throw new ApiError("Cannot reach the shop server. Make sure the API is running (in apps/api, run: npm run bot), then try again.", res.status);
  }
  if (!res.ok) {
    const fallback =
      res.status === 413 ? "That file is too big." : res.status === 429 ? "Too many attempts. Wait a minute and try again." : "Something went wrong. Please try again.";
    throw new ApiError(messageFrom(data, fallback), res.status);
  }
  return data as T;
}

/** SWR fetcher: the SWR key is the API path, e.g. "/products". */
export const fetcher = <T,>(path: string) => api<T>(path);
