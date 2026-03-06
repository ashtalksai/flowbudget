import {
  pgTable,
  serial,
  varchar,
  numeric,
  boolean,
  integer,
  date,
  timestamp,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  name: varchar("name", { length: 100 }),
  currency: varchar("currency", { length: 3 }).default("EUR").notNull(),
  tier: varchar("tier", { length: 10 }).default("free").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const incomeEntries = pgTable("income_entries", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  source: varchar("source", { length: 100 }).notNull(),
  date: date("date").notNull(),
  isRecurring: boolean("is_recurring").default(false).notNull(),
  frequency: varchar("frequency", { length: 20 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const debts = pgTable("debts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  balance: numeric("balance", { precision: 12, scale: 2 }).notNull(),
  apr: numeric("apr", { precision: 5, scale: 2 }).notNull(),
  minPayment: numeric("min_payment", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const budgetCategories = pgTable("budget_categories", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  name: varchar("name", { length: 50 }).notNull(),
  monthlyLimit: numeric("monthly_limit", { precision: 10, scale: 2 }).notNull(),
  color: varchar("color", { length: 7 }).notNull(),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  categoryId: integer("category_id").references(() => budgetCategories.id),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  description: varchar("description", { length: 200 }),
  date: date("date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
