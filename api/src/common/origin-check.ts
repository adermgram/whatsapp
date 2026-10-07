import type { NextFunction, Request, Response } from 'express';

const SAFE = new Set(['GET', 'HEAD', 'OPTIONS']);

/**
 * Cross-site request forgery guard. A browser always tells us which website a state-changing request came from
 * (the Origin header). If it names any site other than the dashboard, refuse it, even if the login cookie came
 * along. Requests with no Origin (Paystack's webhook, scripts, tests) are not browsers acting for a logged-in
 * user, so they are not affected: they carry their own proof (a signature, or a bearer token).
 * The cookie is also SameSite=Lax, so this is a second lock on the same door.
 */
export function originCheck(allowedOrigins: string[]) {
  const allowed = new Set(allowedOrigins.map((o) => o.replace(/\/$/, '')));
  return (req: Request, res: Response, next: NextFunction) => {
    const origin = req.headers.origin;
    if (SAFE.has(req.method) || !origin || allowed.has(origin.replace(/\/$/, ''))) return next();
    res.status(403).json({ statusCode: 403, message: 'Request not allowed from this website' });
  };
}
