import { pgTable, text, serial, integer, boolean, timestamp, jsonb, varchar, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (required for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  discordId: text("discord_id").notNull().unique(),
  username: text("username").notNull(),
  status: text("status").default("last seen unknown"),
  joinDate: text("join_date").notNull(),
  location: text("location").default("Somewhere"),
  mood: text("mood").default("Vibing"),
  avatarUrl: text("avatar_url"),
  discordUsername: text("discord_username"),
  socialLinks: text("social_links"), // JSON string
  viewCount: integer("view_count").default(0),
  isOwner: boolean("is_owner").default(false),
  shareableUrl: text("shareable_url"),
  theme: text("theme").default("theme-dark"),
  audioUrl: text("audio_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const viewStats = pgTable("view_stats", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id").notNull(),
  viewCount: integer("view_count").default(0),
  lastViewed: timestamp("last_viewed").defaultNow(),
});

export const siteStats = pgTable("site_stats", {
  id: serial("id").primaryKey(),
  totalViews: integer("total_views").default(0),
  uniqueVisitors: integer("unique_visitors").default(0),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users);

export const insertProfileSchema = createInsertSchema(profiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertViewStatsSchema = createInsertSchema(viewStats).omit({
  id: true,
  lastViewed: true,
});

export const insertSiteStatsSchema = createInsertSchema(siteStats).omit({
  id: true,
  lastUpdated: true,
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Profile = typeof profiles.$inferSelect;
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type ViewStats = typeof viewStats.$inferSelect;
export type InsertViewStats = z.infer<typeof insertViewStatsSchema>;
export type SiteStats = typeof siteStats.$inferSelect;
export type InsertSiteStats = z.infer<typeof insertSiteStatsSchema>;
