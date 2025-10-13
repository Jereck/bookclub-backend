import { db } from "../../db/db";
import { books } from "../../db/schema";
import { eq } from "drizzle-orm";

export async function findBookByISBN(isbn: string) {
  const [book] = await db.select().from(books).where(eq(books.isbn13, isbn));
  return book || null;
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
    .insert(books)
    .values(data)
    .returning();

  return newBook;
}
