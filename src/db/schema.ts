import {
  pgTable,
  serial,
  varchar,
  numeric,
  boolean,
  integer,
  date,
  timestamp,
  text,
  jsonb,
  unique,
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

export const accounts = pgTable("accounts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  label: varchar("label", { length: 100 }).notNull(),
  iban: varchar("iban", { length: 50 }),
  accountNumber: varchar("account_number", { length: 50 }),
  currency: varchar("currency", { length: 10 }).default("EUR"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const imports = pgTable("imports", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  accountId: integer("account_id").references(() => accounts.id),
  filename: varchar("filename", { length: 500 }),
  formatDetected: varchar("format_detected", { length: 50 }),
  rowsTotal: integer("rows_total").default(0),
  rowsNew: integer("rows_new").default(0),
  rowsDuplicate: integer("rows_duplicate").default(0),
  rowsAutoCategorized: integer("rows_auto_categorized").default(0),
  status: varchar("status", { length: 20 }).default("completed"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  importId: integer("import_id").references(() => imports.id),
  accountId: integer("account_id").references(() => accounts.id),
  date: date("date").notNull(),
  description: text("description"),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 10 }).default("EUR"),
  amountBase: numeric("amount_base", { precision: 12, scale: 2 }),
  category: varchar("category", { length: 100 }),
  subcategory: varchar("subcategory", { length: 100 }),
  status: varchar("status", { length: 20 }).default("pending"),
  isInternal: boolean("is_internal").default(false),
  isReimbursable: boolean("is_reimbursable").default(false),
  reimbursableFrom: varchar("reimbursable_from", { length: 100 }),
  rawRow: jsonb("raw_row"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const rules = pgTable("rules", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  pattern: varchar("pattern", { length: 500 }).notNull(),
  matchType: varchar("match_type", { length: 20 }).default("contains"),
  category: varchar("category", { length: 100 }).notNull(),
  subcategory: varchar("subcategory", { length: 100 }),
  isReimbursable: boolean("is_reimbursable").default(false),
  reimbursableFrom: varchar("reimbursable_from", { length: 100 }),
  applyRetroactively: boolean("apply_retroactively").default(true),
  priority: integer("priority").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const budgets = pgTable("budgets", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  monthlyLimit: numeric("monthly_limit", { precision: 10, scale: 2 }).notNull(),
  color: varchar("color", { length: 7 }).default("#0D9488"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  uniqueUserCategory: unique().on(table.userId, table.category),
}));

export const debts = pgTable("debts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  balance: numeric("balance", { precision: 12, scale: 2 }).notNull(),
  apr: numeric("apr", { precision: 5, scale: 2 }).default("0"),
  minPayment: numeric("min_payment", { precision: 10, scale: 2 }).default("0"),
  notes: text("notes"),
  dueDate: date("due_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const reimbursables = pgTable("reimbursables", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  fromPerson: varchar("from_person", { length: 200 }).notNull(),
  description: text("description"),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 10 }).default("EUR"),
  date: date("date").notNull(),
  status: varchar("status", { length: 20 }).default("outstanding"),
  transactionId: integer("transaction_id").references(() => transactions.id),
  paidDate: date("paid_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  parentId: integer("parent_id").references((): any => categories.id),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }),
  icon: varchar("icon", { length: 50 }),
  color: varchar("color", { length: 7 }),
  createdAt: timestamp("created_at").defaultNow(),
});
