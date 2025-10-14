import { boolean, pgTable, primaryKey, text } from "drizzle-orm/pg-core";
import bookclub from "./bookclub";
import user from "./user";
import { relations } from "drizzle-orm";

const bookclubUser = pgTable('bookclub_user', 
  {
    bookclubId: text("bookclub_id").notNull().references(() => bookclub.id, { onDelete: 'cascade' }),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: 'cascade' }),
    isOwner: boolean("is_owner").default(false).notNull()
  },
  (t) => ({
    pk: primaryKey({ columns: [t.bookclubId, t.userId] })
  })
)

export const bookclubUserRelations = relations(bookclubUser, ({ one }) => ({
  user: one(user, {
    fields: [bookclubUser.userId],
    references: [user.id]
  }),
  bookclub: one(bookclub, {
    fields: [bookclubUser.bookclubId],
    references: [bookclub.id]
  })
}))

export default bookclubUser;