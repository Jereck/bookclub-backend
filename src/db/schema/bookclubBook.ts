import { pgTable, primaryKey, text } from "drizzle-orm/pg-core";
import bookclub from "./bookclub";
import book from "./book";

const bookclubBook = pgTable("bookclub_book", {
  bookclubId: text("bookclub_id").notNull().references(() => bookclub.id, { onDelete: 'cascade'}),
  bookId: text("book_id").notNull().references(() => book.id, { onDelete: 'cascade' })
}, (t) => ({
  pk: primaryKey({ columns: [t.bookclubId, t.bookId] })
}))

export default bookclubBook;