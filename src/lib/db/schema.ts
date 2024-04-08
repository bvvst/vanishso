import { sqliteTable, int, text } from "drizzle-orm/sqlite-core";

// declaring enum in database - SQLite does not support enums like MySQL, so we use text instead
export const notes = sqliteTable("notes", {
  id: text("id").primaryKey().notNull(), // SQLite uses dynamic typing, so varchar with length can be represented as text
  confirmBeforeViewing: int("confirmBeforeViewing", {
    mode: "boolean",
  }).notNull(), // SQLite does not have a boolean type, integers 0 (false) and 1 (true) are used
  mode: text("mode").notNull(), // Enum replaced with text type
  encrypted: text("encrypted").notNull(),
  exp: int("exp").notNull(), // bigint in MySQL can be represented as integer in SQLite, considering the storage class system
  h: text("h").notNull(),
  cs: text("cs").notNull(),
  ss: text("ss").notNull(),
});

export type Note = typeof notes.$inferInsert;

// export const notes = mysqlTable("notes", {
//   id: varchar("id", { length: 256 }).primaryKey().notNull(),
//   confirmBeforeViewing: boolean("confirmBeforeViewing").notNull(),
//   mode: mysqlEnum("mode", ["p", "k", "otp"]).notNull(),
//   encrypted: text("encrypted").notNull(),
//   exp: bigint("exp", { mode: "number" }).notNull(),
//   h: varchar("h", { length: 256 }).notNull(),
//   cs: varchar("cs", { length: 256 }).notNull(),
//   ss: varchar("ss", { length: 256 }).notNull(),
// });
