import { relations } from "drizzle-orm";
import { pgTable, text } from "drizzle-orm/pg-core";
import user from "./user";
import libraryBooks from "./libraryBook";
import bookclub from "./bookclub";

const library = pgTable("library", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").references(() => user.id, { onDelete: 'cascade' }),
  bookclubId: text("bookclub_id").references(() => bookclub.id, { onDelete: 'cascade' })
})

export const libraryRelations = relations(library, ({ one, many }) => ({
  user: one(user, { fields: [library.id], references: [user.id] }),
  bookclub: one(bookclub, { fields: [library.bookclubId], references: [bookclub.id]}),
  libraryBooks: many(libraryBooks)
}))

export default library;