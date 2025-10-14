import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import book from "./book";
import { relations } from "drizzle-orm";
import bookclubUser from "./bookclubUser";
import bookclubBook from "./bookclubBook";

const bookclub = pgTable("bookclub", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: varchar({ length: 255 }).notNull(),
  description: text().notNull(),
  currentBookId: text("current_book_id").references(() => book.id, { onDelete: 'cascade' }),
});

export const bookclubRelations = relations(bookclub, ({ many, one }) => ({
  members: many(bookclubUser),
  books: many(bookclubBook),
  currentBook: one(book, {
    fields: [bookclub.currentBookId],
    references: [book.id]
  })
}))

export default bookclub