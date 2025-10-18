import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// User table
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  password: text("password").notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

// Loan table
export const loans = sqliteTable("loans", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  totalValue: integer("total_value").notNull(),
  isFixed: integer("is_fixed", { mode: "boolean" }).notNull(),
  installments: integer("installments"),
  interestRate: integer("interest_rate"),
  startDate: text("start_date"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  userId: integer("user_id").notNull(),
});

// Parcel table
export const parcels = sqliteTable("parcels", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  value: integer("value").notNull(),
  paidValue: integer("paid_value").notNull(),
  dueDate: text("due_date"),
  paidAt: text("paid_at"),
  loanId: integer("loan_id").notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});
