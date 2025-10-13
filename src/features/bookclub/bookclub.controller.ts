import { Hono, type Context } from "hono";
import { db } from "../../db/db";
import { bookclubs, usersToBookclubs } from "../../db/schema";
import { eq, and } from "drizzle-orm";


export const getAllBookclubs = async (c: Context) => {
    const allClubs = await db.select().from(bookclubs);
    return c.json(allClubs);
}

export const getBookclubById = async (c: Context) => {
    const id = c.req.param("id")
    const bookclub = await db.query.bookclubs.findFirst({
        where: (bookclubs, { eq }) => eq(bookclubs.id, id),
        with: {
            currentBook: true,
            usersToBookclubs: {
                with: {
                    user: true
                }
            }
        },
    })
    if (!bookclub) return c.json({ error: "Not found" }, 404);
    return c.json(bookclub );
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
    return c.json({ message: "bookclub created", bookclub}, 201);
}

export const updateBookclub = async (c: Context) => {
    const user = c.get("user");
    const id = c.req.param("id")
    const data = await c.req.json();

    const ownership = await db.query.usersToBookclubs.findFirst({
        where: (utb, { and, eq }) => and(eq(utb.userId, user.id), eq(utb.bookclubId, id), eq(utb.isOwner, true))
    });

    if (!ownership) return c.json({ error: "Forbidden" }, 403);

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
    const id = c.req.param("id")

    const [deletedBookclub] = await db
        .delete(bookclubs)
        .where(eq(bookclubs.id, id))
        .returning();

    if (!deletedBookclub) return c.json({ error: "Not found" }, 404);

    return c.json({ message: "Deleted bookclub", deletedBookclub})
}

export const joinBookclub = async (c: Context) => {
    const user = c.get("user");
    const bookclubId = c.req.param("id")

    if (!user) return c.json({ message: "Not authorized" });

    const existing = await db.query.usersToBookclubs.findFirst({
        where: (utb, { and, eq }) => and(
            eq(utb.bookclubId, bookclubId),
            eq(utb.userId, user.id)
        )
    });

    if (existing) return c.json({ message: "Already a member"}, 400);

    const [membership] = await db.insert(usersToBookclubs).values({
        userId: user.id,
        bookclubId,
        isOwner: false
    }).returning();

    return c.json(membership);
}

export const setCurrentBook = async (c: Context) => {
    const user = c.get("user");
    const bookclubId = c.req.param("id");
    const { currentBookId } = await c.req.json();

    const ownership = await db.query.usersToBookclubs.findFirst({
        where: (utb, { and, eq }) =>
            and(eq(utb.userId, user.id), eq(utb.bookclubId, bookclubId), eq(utb.isOwner, true)),
        });

    if (!ownership) return c.json({ error: "Forbidden" }, 403);

    const [updatedBookclub] = await db.update(bookclubs)
        .set({ currentBookId })
        .where(eq(bookclubs.id, bookclubId))
        .returning();

    if (!updatedBookclub) return c.json({ error: "Not found" }, 404);

    return c.json(updatedBookclub)
}