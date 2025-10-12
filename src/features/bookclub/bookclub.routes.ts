import { Hono } from "hono";
import { createBookclub, deleteBookclub, getAllBookclubs, getBookclubById, joinBookclub, updateBookclub } from "./bookclub.controller";
import { type HonoEnv } from "../../types";
import { authMiddleware } from "../../middlewares/auth.middleware";

const bookclubRoutes = new Hono<HonoEnv>();
bookclubRoutes.use(authMiddleware);

bookclubRoutes.get('/', getAllBookclubs)
bookclubRoutes.post('/', createBookclub)
bookclubRoutes.get('/:id{[0-9]+}', getBookclubById)
bookclubRoutes.put('/:id{[0-9]+}', updateBookclub)
bookclubRoutes.delete('/:id{[0-9]+}', deleteBookclub)
bookclubRoutes.post('/:id{[0-9]+}/join', joinBookclub)

export default bookclubRoutes;