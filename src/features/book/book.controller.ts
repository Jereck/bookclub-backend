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
    const book = await db.select().from(books).where(eq(books.isbn13, isbn));
    if (!book) return c.json({ error: "Not found" }, 404);
    return c.json(book);
}

export const createBook = async (c: Context) => {
    const isbn = c.req.param('isbn')

    const existing = await db.select().from(books).where(eq(books.isbn13, isbn)).limit(1);
    if (existing.length > 0) return c.json(existing[0]);

    const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`);
    const data: any = await res.json();

    console.log('Data => ', data)

    const bookInfo = data.items?.[0]?.volumeInfo;
    if (!bookInfo) return c.json({ error: "Book not found" }, 404);

    const [newBook] = await db
        .insert(books)
        .values({
            title: bookInfo.title,
            authors: bookInfo.authors?.join(", "),
            isbn13: isbn,
            coverImage: bookInfo.imageLinks?.thumbnail,
            publishedYear: bookInfo.publishedDate ? parseInt(bookInfo.publishedDate.slice(0, 4)) : null,
            description: bookInfo.description
        })
        .returning();

    return c.json(newBook)
}

