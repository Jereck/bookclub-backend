import { Hono } from "hono";
import { type HonoEnv } from "../../types";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { addBookToLibrary, getUserLibrary } from "./library.controller";

const libraryRoutes = new Hono<HonoEnv>();
libraryRoutes.use(authMiddleware);

libraryRoutes.get('/', getUserLibrary);
libraryRoutes.post('/add', addBookToLibrary);

export default libraryRoutes;