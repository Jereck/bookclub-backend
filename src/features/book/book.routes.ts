import { Hono } from "hono";
import { authMiddleware } from "../../middlewares/auth.middleware";
import type { HonoEnv } from "../../types";
import { createBook, getAllBooks } from "./book.controller";

const bookRoutes = new Hono<HonoEnv>();
bookRoutes.use(authMiddleware);

bookRoutes.get('/', getAllBooks);
bookRoutes.get('/search/:isbn', createBook)

export default bookRoutes;