import {
  mysqlEnum,
  mysqlTable,
  bigint,
  varchar,
  boolean,
  text,
} from "drizzle-orm/mysql-core";

// declaring enum in database
export const notes = mysqlTable("notes", {
  id: varchar("id", { length: 256 }).primaryKey().notNull(),
  confirmBeforeViewing: boolean("confirmBeforeViewing").notNull(),
  mode: mysqlEnum("mode", ["p", "k", "otp"]).notNull(),
  encrypted: text("encrypted").notNull(),
  exp: bigint("exp", { mode: "number" }).notNull(),
  h: varchar("h", { length: 256 }).notNull(),
  cs: varchar("cs", { length: 256 }).notNull(),
  ss: varchar("ss", { length: 256 }).notNull(),
});

export type Note = typeof notes.$inferInsert;
