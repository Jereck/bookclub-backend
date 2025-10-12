import { Hono } from "hono";
import { createBookclub, deleteBookclub, getAllBookclubs, getBookclubById, updateBookclub } from "./bookclub.controller";

const bookclubRoutes = new Hono();

bookclubRoutes.get('/', getAllBookclubs)
bookclubRoutes.post('/', createBookclub)
bookclubRoutes.get('/:id{[0-9]+}', getBookclubById)
bookclubRoutes.put('/:id{[0-9]+}', updateBookclub)
bookclubRoutes.delete('/:id{[0-9]+}', deleteBookclub)

export default bookclubRoutes;