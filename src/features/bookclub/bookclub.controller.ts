import { Hono, type Context } from "hono";
import { db } from "../../db/db";
import { bookclubs } from "../../db/schema";
import { eq } from "drizzle-orm";
import { type HonoEnv } from "../../types";
import { authMiddleware } from "../../middlewares/auth.middleware";

export const bookclubs = new Hono<HonoEnv>();
bookclubs.use(authMiddleware);

export const getAllBookclubs = async (c: Context) => {
    const allClubs = await db.select().from(bookclubs);
    return c.json(allClubs);
}

export const getBookclubById = async (c: Context) => {
    const id = Number(c.req.param("id"))
    const bookclub = await db.select().from(bookclubs).where(eq(bookclubs.id, id))
    if (!bookclub) return c.json({ error: "Not found" }, 404);
    return c.json(bookclub);
}

export const createBookclub = async (c: Context) => {
    const data = await c.req.json();
    const userID = 

    const [bookclub] = await db
        .insert(bookclubs)
        .values({ name: data.name, description: data.description })
        .returning();
    return c.json(bookclub, 201);
}

export const updateBookclub = async (c: Context) => {
    const id = Number(c.req.param("id"))
    const data = await c.req.json();

    const [updatedBookclub] = await db
        .update(bookclubs)
        .set({
            name: data.name,
            description: data.description
        })
        .where(eq(bookclubs.id, id))
        .returning();

    if (!updatedBookclub) return c.json({ error: "Not found" }, 404);

    return c.json(updatedBookclub)
}

export const deleteBookclub = async (c: Context) => {
    const id = Number(c.req.param("id"))

    const [deletedBookclub] = await db
        .delete(bookclubs)
        .where(eq(bookclubs.id, id))
        .returning();

    if (!deletedBookclub) return c.json({ error: "Not found" }, 404);

    return c.json({ message: "Deleted bookclub", deletedBookclub})
}