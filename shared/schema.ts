import { pgTable, text, serial, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Waste types enum for reference
export const wasteTypeEnum = z.enum(["general", "recycling", "compost"]);
export type WasteType = z.infer<typeof wasteTypeEnum>;

// Waste records table
export const wasteRecords = pgTable("waste_records", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  wasteType: text("waste_type").notNull(), // "general", "recycling", "compost"
  amount: real("amount").notNull(), // in kg
  date: timestamp("date").defaultNow().notNull(),
});

export const insertWasteRecordSchema = createInsertSchema(wasteRecords).omit({ id: true });
export type InsertWasteRecord = z.infer<typeof insertWasteRecordSchema>;
export type WasteRecord = typeof wasteRecords.$inferSelect;

// Collections schedule table
export const collections = pgTable("collections", {
  id: serial("id").primaryKey(),
  wasteType: text("waste_type").notNull(), // "general", "recycling", "compost"
  scheduledDate: timestamp("scheduled_date").notNull(),
  timeWindow: text("time_window").notNull(), // e.g., "8AM - 10AM"
  locationId: integer("location_id").notNull(),
  isRecurring: boolean("is_recurring").default(false).notNull(),
  recurringPattern: text("recurring_pattern"), // e.g., "weekly", "biweekly"
});

export const insertCollectionSchema = createInsertSchema(collections).omit({ id: true });
export type InsertCollection = z.infer<typeof insertCollectionSchema>;
export type Collection = typeof collections.$inferSelect;

// Reminders table
export const reminders = pgTable("reminders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  collectionId: integer("collection_id").notNull(),
  reminderTime: timestamp("reminder_time").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
});

export const insertReminderSchema = createInsertSchema(reminders).omit({ id: true });
export type InsertReminder = z.infer<typeof insertReminderSchema>;
export type Reminder = typeof reminders.$inferSelect;

// Disposal locations table
export const disposalLocations = pgTable("disposal_locations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  acceptedWasteTypes: text("accepted_waste_types").notNull(), // comma-separated values
  operatingHours: text("operating_hours").notNull(),
  phoneNumber: text("phone_number"),
  website: text("website"),
});

export const insertDisposalLocationSchema = createInsertSchema(disposalLocations).omit({ id: true });
export type InsertDisposalLocation = z.infer<typeof insertDisposalLocationSchema>;
export type DisposalLocation = typeof disposalLocations.$inferSelect;

// Recycling tips table
export const recyclingTips = pgTable("recycling_tips", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // e.g., "general", "plastic", "paper"
});

export const insertRecyclingTipSchema = createInsertSchema(recyclingTips).omit({ id: true });
export type InsertRecyclingTip = z.infer<typeof insertRecyclingTipSchema>;
export type RecyclingTip = typeof recyclingTips.$inferSelect;

// Educational resources table
export const educationalResources = pgTable("educational_resources", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  contentUrl: text("content_url").notNull(),
  resourceType: text("resource_type").notNull(), // e.g., "article", "video", "guide"
});

export const insertEducationalResourceSchema = createInsertSchema(educationalResources).omit({ id: true });
export type InsertEducationalResource = z.infer<typeof insertEducationalResourceSchema>;
export type EducationalResource = typeof educationalResources.$inferSelect;
