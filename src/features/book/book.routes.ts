import { Hono } from "hono";
import { authMiddleware } from "../../middlewares/auth.middleware";
import type { HonoEnv } from "../../types";
import { createBook, getAllBooks, getBookByISBN } from "./book.controller";

const bookRoutes = new Hono<HonoEnv>();
bookRoutes.use(authMiddleware);

bookRoutes.get('/', getAllBooks);
bookRoutes.get('/:isbn', getBookByISBN)
bookRoutes.post('/', createBook)


export default bookRoutes;