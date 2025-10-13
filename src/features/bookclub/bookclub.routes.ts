import { Hono } from "hono";
import { createBookclub, deleteBookclub, getAllBookclubs, getBookclubById, joinBookclub, leaveBookclub, setCurrentBook, updateBookclub } from "./bookclub.controller";
import { type HonoEnv } from "../../types";
import { authMiddleware } from "../../middlewares/auth.middleware";

const bookclubRoutes = new Hono<HonoEnv>();
bookclubRoutes.use(authMiddleware);

bookclubRoutes.get('/', getAllBookclubs)
bookclubRoutes.post('/', createBookclub)
bookclubRoutes.get('/:id', getBookclubById)
bookclubRoutes.put('/:id', updateBookclub)
bookclubRoutes.delete('/:id', deleteBookclub)
bookclubRoutes.post('/:id/join', joinBookclub)
bookclubRoutes.delete('/:id/leave', leaveBookclub)
bookclubRoutes.post('/:id/set-book', setCurrentBook)

export default bookclubRoutes;