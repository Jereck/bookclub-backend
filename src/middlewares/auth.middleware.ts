import { createMiddleware } from "hono/factory";
import { auth } from "../utils/auth";
import { type HonoEnv } from "../types";

export const authMiddleware = createMiddleware<HonoEnv>(async (c, next) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });

    if (!session) {
        return c.json({ errors: 'Unauthorized' }, 401);
    }

    c.set('user', session.user);
    c.set('session', session.session);
    return next();
})