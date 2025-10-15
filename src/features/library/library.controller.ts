import type { Context } from "hono";
import { db } from "../../db/db";
import library from "../../db/schema/library";
import { createBookInDb, findBookByISBN } from "../book/book.services";
import { libraryBook } from "../../db/schema";

export const getUserLibrary = async (c: Context) => {
  const user = c.get("user");
  if (!user) return c.json({ error: "Unauthorized" }, 401);

  const userLibrary = await db.query.library.findFirst({
    where: (lib, { eq }) => eq(lib.userId, user.id),
    with: {
      libraryBooks: {
        with: {
          book: true
        }
      }
    }
  });

  return c.json(userLibrary || null);
}

export const addBookToLibrary = async (c: Context) => {
  const user = c.get("user");
  if (!user) return c.json({ error: "Unauthorized" }, 401);

  const { isbn, bookData } = await c.req.json();

  let userLibrary = await db.query.library.findFirst({
    where: (lib, { eq }) => eq(lib.userId, user.id)
  })

  if (!userLibrary) {
    const [newLib] = await db
      .insert(library)
      .values({ userId: user.id })
      .returning()
    userLibrary = newLib;
  }

  let foundBook = await findBookByISBN(isbn);
  if (!foundBook) {
    foundBook = await createBookInDb({
      title: bookData.title,
      authors: bookData.authors,
      isbn13: isbn,
      coverImage: bookData.coverImage,
      publishedYear: bookData.publishedYear
        ? Number(bookData.publishedYear)
        : null,
      description: bookData.description,
    })
  }

  if (!foundBook) return c.json({ error: "Book coud not be cerated" }, 500);

  try {
    await db.insert(libraryBook).values({
      libraryId: userLibrary?.id,
      bookId: foundBook.id
    })
  } catch (error) {
    console.log("Error: ", error);
  }

  return c.json({ message: "Book added to library", book: foundBook })
}