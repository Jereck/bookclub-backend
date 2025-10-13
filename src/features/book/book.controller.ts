import type { Context } from "hono";
import { db } from "../../db/db";
import { books } from "../../db/schema"
import { eq } from "drizzle-orm";

export const getAllBooks = async (c: Context) => {
    const allBooks = await db.select().from(books);
    return c.json(allBooks);
}

export const getBookByISBN = async (c: Context) => {
    const isbn = c.req.param("isbn");
    if (!isbn) return c.json({ error: "ISBN required" }, 400);

    const [book] = await db.select().from(books).where(eq(books.isbn13, isbn));
    if (!book) return c.json({ error: "Not found" }, 404);

    return c.json(book);
}

export const createBook = async (c: Context) => {
    const isbn = c.req.param('isbn');
    if (!isbn) return c.json({ error: "ISBN required" }, 400);

    const [existing] = await db.select().from(books).where(eq(books.isbn13, isbn));
    if (existing) return c.json(existing);

    const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`);
    if (!res.ok) return c.json({ error: "Failed to fetch book data" }, 502);

    const data: any = await res.json();
    const bookInfo = data.items?.[0]?.volumeInfo;
    if (!bookInfo) return c.json({ error: "Book not found" }, 404);

    const publishedYear = (() => {
        const year = bookInfo.publishedDate?.slice(0, 4);
        return year && !isNaN(Number(year)) ? Number(year) : null;
    })();

    const [newBook] = await db
        .insert(books)
        .values({
            title: bookInfo.title,
            authors: bookInfo.authors?.join(", "),
            isbn13: isbn,
            coverImage: bookInfo.imageLinks?.thumbnail ?? null,
            publishedYear,
            description: bookInfo.description ?? null
        })
        .returning();

    return c.json(newBook)
}

