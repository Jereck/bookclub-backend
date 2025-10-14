import { db } from "../../db/db";
import { book } from "../../db/schema";
import { eq } from "drizzle-orm";

export async function findBookByISBN(isbn: string) {
  const [foundBook] = await db.select().from(book).where(eq(book.isbn13, isbn));
  return foundBook || null;
}

export async function createBookInDb(data: {
  title: string;
  authors?: string;
  isbn13: string;
  coverImage?: string | null;
  publishedYear?: number | null;
  description?: string | null;
}) {
  const [newBook] = await db
    .insert(book)
    .values(data)
    .returning();

  return newBook ?? null;
}
