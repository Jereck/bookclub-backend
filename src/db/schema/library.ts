import { relations } from "drizzle-orm";
import { pgTable, text } from "drizzle-orm/pg-core";
import user from "./user";
import book from "./book";

const library = pgTable("library", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: 'cascade' })
})

export const libraryRelations = relations(library, ({ one, many }) => ({
  user: one(user, {
    fields: [library.id],
    references: [user.id]
  }),
  books: many(book)
}))

export default library;