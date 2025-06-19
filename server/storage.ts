import { users, profiles, viewStats, type User, type InsertUser, type Profile, type InsertProfile, type ViewStats, type InsertViewStats } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getProfile(discordId: string): Promise<Profile | undefined>;
  getProfileByShareableUrl(shareableUrl: string): Promise<Profile | undefined>;
  createProfile(profile: InsertProfile): Promise<Profile>;
  updateProfile(discordId: string, updates: Partial<InsertProfile>): Promise<Profile | undefined>;
  
  getViewStats(profileId: number): Promise<ViewStats | undefined>;
  incrementViewCount(profileId: number): Promise<ViewStats>;
  createViewStats(stats: InsertViewStats): Promise<ViewStats>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private profiles: Map<string, Profile>;
  private viewStatsMap: Map<number, ViewStats>;
  private currentUserId: number;
  private currentProfileId: number;
  private currentViewStatsId: number;

  constructor() {
    this.users = new Map();
    this.profiles = new Map();
    this.viewStatsMap = new Map();
    this.currentUserId = 1;
    this.currentProfileId = 1;
    this.currentViewStatsId = 1;
    
    // Initialize with default profile
    this.initializeDefaultProfile();
  }

  private initializeDefaultProfile() {
    const defaultProfile: Profile = {
      id: 1,
      discordId: "123456789012345678",
      username: "Ahmed",
      status: "last seen unknown",
      joinDate: "Jan 2024",
      location: "Somewhere",
      mood: "Vibing",
      avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
      discordUsername: "Ahmed#1234",
      socialLinks: JSON.stringify({
        discord: "https://discord.gg/yourserver",
        instagram: "https://instagram.com/yourusername",
        github: "https://github.com/yourusername",
        telegram: "https://t.me/yourusername",
        tiktok: "https://tiktok.com/@yourusername",
        spotify: "https://open.spotify.com/user/yourusername",
        snapchat: "https://snapchat.com/add/yourusername",
        roblox: "https://roblox.com/users/yourid"
      }),
      viewCount: 1337,
      isOwner: true,
      shareableUrl: "ahmed-profile",
      theme: "theme-dark",
      audioUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.profiles.set(defaultProfile.discordId, defaultProfile);
    
    const defaultViewStats: ViewStats = {
      id: 1,
      profileId: 1,
      viewCount: 1337,
      lastViewed: new Date(),
    };
    
    this.viewStatsMap.set(1, defaultViewStats);
    this.currentProfileId = 2;
    this.currentViewStatsId = 2;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getProfile(discordId: string): Promise<Profile | undefined> {
    return this.profiles.get(discordId);
  }

  async getProfileByShareableUrl(shareableUrl: string): Promise<Profile | undefined> {
    return Array.from(this.profiles.values()).find(
      (profile) => profile.shareableUrl === shareableUrl,
    );
  }

  async createProfile(insertProfile: InsertProfile): Promise<Profile> {
    const id = this.currentProfileId++;
    const profile: Profile = { 
      ...insertProfile, 
      id,
      status: insertProfile.status || "last seen unknown",
      location: insertProfile.location || "Somewhere",
      mood: insertProfile.mood || "Vibing",
      avatarUrl: insertProfile.avatarUrl || null,
      discordUsername: insertProfile.discordUsername || null,
      socialLinks: insertProfile.socialLinks || "{}",
      viewCount: insertProfile.viewCount || 0,
      isOwner: insertProfile.isOwner || false,
      shareableUrl: insertProfile.shareableUrl || null,
      theme: insertProfile.theme || "theme-dark",
      audioUrl: insertProfile.audioUrl || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.profiles.set(insertProfile.discordId, profile);
    return profile;
  }

  async updateProfile(discordId: string, updates: Partial<InsertProfile>): Promise<Profile | undefined> {
    const existing = this.profiles.get(discordId);
    if (!existing) return undefined;
    
    const updated: Profile = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };
    
    this.profiles.set(discordId, updated);
    return updated;
  }

  async getViewStats(profileId: number): Promise<ViewStats | undefined> {
    return this.viewStatsMap.get(profileId);
  }

  async incrementViewCount(profileId: number): Promise<ViewStats> {
    const existing = this.viewStatsMap.get(profileId);
    
    if (existing) {
      const updated: ViewStats = {
        ...existing,
        viewCount: (existing.viewCount || 0) + 1,
        lastViewed: new Date(),
      };
      this.viewStatsMap.set(profileId, updated);
      
      // Also update profile view count
      const profile = Array.from(this.profiles.values()).find(p => p.id === profileId);
      if (profile) {
        profile.viewCount = updated.viewCount || 0;
        this.profiles.set(profile.discordId, profile);
      }
      
      return updated;
    } else {
      const newStats: ViewStats = {
        id: this.currentViewStatsId++,
        profileId,
        viewCount: 1,
        lastViewed: new Date(),
      };
      this.viewStatsMap.set(profileId, newStats);
      return newStats;
    }
  }

  async createViewStats(insertStats: InsertViewStats): Promise<ViewStats> {
    const id = this.currentViewStatsId++;
    const stats: ViewStats = {
      ...insertStats,
      id,
      viewCount: insertStats.viewCount || 0,
      lastViewed: new Date(),
    };
    this.viewStatsMap.set(stats.profileId, stats);
    return stats;
  }
}

export const storage = new MemStorage();
