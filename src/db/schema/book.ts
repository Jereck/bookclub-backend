import { relations } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import bookclub from "./bookclub";
import libraryBooks from "./libraryBook";

const book = pgTable("book", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: varchar({ length: 255 }).notNull(),
  authors: varchar({ length: 255 }),
  isbn13: varchar().notNull().unique(),
  coverImage: text(),
  publishedYear: integer(),
  description: text(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const booksRelations = relations(book, ({ many }) => ({
  libraries: many(libraryBooks),
}));

export default book