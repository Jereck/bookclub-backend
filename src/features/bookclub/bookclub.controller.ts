import { Hono, type Context } from "hono";
import { db } from "../../db/db";
import { bookclubs, usersToBookclubs } from "../../db/schema";
import { eq, and } from "drizzle-orm";


export const getAllBookclubs = async (c: Context) => {
    const allClubs = await db.select().from(bookclubs);
    return c.json(allClubs);
}

export const getBookclubById = async (c: Context) => {
    const id = Number(c.req.param("id"))
    const bookclub = await db.select().from(bookclubs).where(eq(bookclubs.id, id))
    if (!bookclub) return c.json({ error: "Not found" }, 404);
    const members = await db.select().from(usersToBookclubs).where(eq(usersToBookclubs.bookclubId, id));
    return c.json({ ...bookclub, members});
}

export const createBookclub = async (c: Context) => {
    const data = await c.req.json();
    const user = c.get('user');

    if (!user) return c.json({ error: "Unauthorized" });

    const [bookclub] = await db
        .insert(bookclubs)
        .values({ name: data.name, description: data.description })
        .returning();

    if (!bookclub) return c.json({ message: "No bookclub" })

    await db.insert(usersToBookclubs)
        .values({
            userId: user.id,
            bookclubId: bookclub.id,
            isOwner: true
        })
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

export const joinBookclub = async (c: Context) => {
//    const data = await c.req.json();
    const user = c.get("user");
    const bookclubId = Number(c.req.param("id"))

    if (!user) return c.json({ message: "Not authorized" });

    const existing = await db.select().from(usersToBookclubs).where
    (
        and(
            eq(usersToBookclubs.bookclubId, bookclubId),
            eq(usersToBookclubs.userId, user.id)
        )
    )

    if (existing.length > 0) return c.json({ message: "Already a member"}, 400);

    const [membership] = await db.insert(usersToBookclubs).values({
        userId: user.id,
        bookclubId,
        isOwner: false
    }).returning();

    return c.json(membership);
}