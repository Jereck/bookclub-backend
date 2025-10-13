import { relations } from "drizzle-orm";
import { boolean, integer, pgTable, text, timestamp, varchar, primaryKey } from "drizzle-orm/pg-core";

/* =======================
   BETTER AUTH GENERATED
   ======================= */

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified')
    .$defaultFn(() => false)
    .notNull(),
  image: text('image'),
  createdAt: timestamp('created_at')
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp('updated_at')
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
});

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
});

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').$defaultFn(
    () => /* @__PURE__ */ new Date()
  ),
  updatedAt: timestamp('updated_at').$defaultFn(
    () => /* @__PURE__ */ new Date()
  ),
});

/* =======================
   BOOKS + BOOKSHELVES
   ======================= */

export const books = pgTable("books", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: varchar({ length: 255 }).notNull(),
  authors: varchar({ length: 255 }),
  isbn13: varchar().notNull().unique(),
  coverImage: text(),
  publishedYear: integer(),
  description: text(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// user <--> books (for personal like bookshelf)
export const usersToBooks = pgTable(
  'user_to_books',
  {
    userId: text("user_id").notNull().references(() => user.id, { onDelete: 'cascade' }),
    bookId: text("book_id").notNull().references(() => books.id, { onDelete: 'cascade' }),
    status: varchar("status").notNull().default("want_to_read"),
    addedAt: timestamp("added_at").defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.bookId] })]
)

/* =======================
   BOOKCLUBS + MEMBERSHIPS
   ======================= */

export const bookclubs = pgTable("bookclubs", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: varchar({ length: 255 }).notNull(),
  description: text().notNull(),
  currentBookId: text("current_book_id").references(() => books.id, { onDelete: 'cascade' })
});

export const usersToBookclubs = pgTable('users_to_bookclubs', {
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  bookclubId: text('bookclub_id').notNull().references(() => bookclubs.id, { onDelete: 'cascade' }),
  isOwner: boolean('is_owner').default(false).notNull()
}, (t) => [ primaryKey({ columns: [t.userId, t.bookclubId ]})])

// bookclubs <--> books (clud reading history)
export const bookclubsToBooks = pgTable('bookclub_to_books', {
  bookclubId: text('bookclub_id').notNull().references(() => bookclubs.id, { onDelete: 'cascade' }),
  bookId: text('book_id').notNull().references(() => books.id, { onDelete: 'cascade' }),
  status: varchar("status").notNull().default("reading"),
  startedAt: timestamp("started_at"),
  finishedAt: timestamp("finished_at")
}, (t) => [primaryKey({ columns: [t.bookclubId, t.bookId] })])

/* =======================
   RELATIONS
   ======================= */

export const userRelations = relations(user, ({ many }) => ({
  usersToBookclubs: many(usersToBookclubs),
  usersToBooks: many(usersToBooks)
}))

export const booksRelations = relations(books, ({ many }) => ({
  usersToBooks: many(usersToBooks),
  bookclubsToBooks: many(bookclubsToBooks),
}));

export const bookclubRelations = relations(bookclubs, ({ many, one }) => ({
  usersToBookclubs: many(usersToBookclubs),
  bookclubToBooks: many(bookclubsToBooks),
  currentBook: one(books, {
    fields: [bookclubs.currentBookId],
    references: [books.id]
  })
}))

export const usersToBookclubsRelations = relations(usersToBookclubs, ({ one }) => ({
  bookclub: one(bookclubs, {
    fields: [usersToBookclubs.bookclubId],
    references: [bookclubs.id]
  }),
  user: one(user, {
    fields: [usersToBookclubs.userId],
    references: [user.id]
  })
}))

export const usersToBooksRelations = relations(usersToBooks, ({ one }) => ({
  user: one(user, {
    fields: [usersToBooks.userId],
    references: [user.id],
  }),
  book: one(books, {
    fields: [usersToBooks.bookId],
    references: [books.id],
  }),
}));

export const bookclubsToBooksRelations = relations(
  bookclubsToBooks,
  ({ one }) => ({
    bookclub: one(bookclubs, {
      fields: [bookclubsToBooks.bookclubId],
      references: [bookclubs.id],
    }),
    book: one(books, {
      fields: [bookclubsToBooks.bookId],
      references: [books.id],
    }),
  })
);