import { users, profiles, viewStats, siteStats, type User, type UpsertUser, type Profile, type InsertProfile, type ViewStats, type InsertViewStats, type SiteStats, type InsertSiteStats } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  getProfile(discordId: string): Promise<Profile | undefined>;
  getProfileByShareableUrl(shareableUrl: string): Promise<Profile | undefined>;
  createProfile(profile: InsertProfile): Promise<Profile>;
  updateProfile(discordId: string, updates: Partial<InsertProfile>): Promise<Profile | undefined>;
  
  getViewStats(profileId: number): Promise<ViewStats | undefined>;
  incrementViewCount(profileId: number): Promise<ViewStats>;
  createViewStats(stats: InsertViewStats): Promise<ViewStats>;
  
  getSiteStats(): Promise<SiteStats | undefined>;
  incrementSiteViews(): Promise<SiteStats>;
}

export class DatabaseStorage implements IStorage {
  // User operations (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getProfile(discordId: string): Promise<Profile | undefined> {
    const [profile] = await db.select().from(profiles).where(eq(profiles.discordId, discordId));
    return profile;
  }

  async getProfileByShareableUrl(shareableUrl: string): Promise<Profile | undefined> {
    const [profile] = await db.select().from(profiles).where(eq(profiles.shareableUrl, shareableUrl));
    return profile;
  }

  async createProfile(insertProfile: InsertProfile): Promise<Profile> {
    const [profile] = await db.insert(profiles).values(insertProfile).returning();
    return profile;
  }

  async updateProfile(discordId: string, updates: Partial<InsertProfile>): Promise<Profile | undefined> {
    const [profile] = await db
      .update(profiles)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(profiles.discordId, discordId))
      .returning();
    return profile;
  }

  async getViewStats(profileId: number): Promise<ViewStats | undefined> {
    const [stats] = await db.select().from(viewStats).where(eq(viewStats.profileId, profileId));
    return stats;
  }

  async incrementViewCount(profileId: number): Promise<ViewStats> {
    const existing = await this.getViewStats(profileId);
    
    if (existing) {
      const [updated] = await db
        .update(viewStats)
        .set({
          viewCount: (existing.viewCount || 0) + 1,
          lastViewed: new Date(),
        })
        .where(eq(viewStats.profileId, profileId))
        .returning();
      return updated;
    } else {
      const [newStats] = await db
        .insert(viewStats)
        .values({
          profileId,
          viewCount: 1,
        })
        .returning();
      return newStats;
    }
  }

  async createViewStats(insertStats: InsertViewStats): Promise<ViewStats> {
    const [stats] = await db.insert(viewStats).values(insertStats).returning();
    return stats;
  }

  async getSiteStats(): Promise<SiteStats | undefined> {
    const [stats] = await db.select().from(siteStats).limit(1);
    return stats;
  }

  async incrementSiteViews(): Promise<SiteStats> {
    const existing = await this.getSiteStats();
    
    if (existing) {
      const [updated] = await db
        .update(siteStats)
        .set({
          totalViews: (existing.totalViews || 0) + 1,
          lastUpdated: new Date(),
        })
        .where(eq(siteStats.id, existing.id))
        .returning();
      return updated;
    } else {
      const [newStats] = await db
        .insert(siteStats)
        .values({
          totalViews: 1,
          uniqueVisitors: 1,
        })
        .returning();
      return newStats;
    }
  }
}

export const storage = new DatabaseStorage();
