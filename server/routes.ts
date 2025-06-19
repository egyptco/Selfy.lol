import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProfileSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get profile by Discord ID
  app.get("/api/profile/:discordId", async (req, res) => {
    try {
      const { discordId } = req.params;
      const profile = await storage.getProfile(discordId);
      
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      
      res.json(profile);
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get default profile (for demo)
  app.get("/api/profile", async (req, res) => {
    try {
      const profile = await storage.getProfile("123456789012345678");
      if (!profile) {
        return res.status(404).json({ message: "Default profile not found" });
      }
      res.json(profile);
    } catch (error) {
      console.error("Error fetching default profile:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Increment view count
  app.post("/api/profile/:discordId/view", async (req, res) => {
    try {
      const { discordId } = req.params;
      const profile = await storage.getProfile(discordId);
      
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      
      const viewStats = await storage.incrementViewCount(profile.id);
      res.json(viewStats);
    } catch (error) {
      console.error("Error incrementing view count:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Fetch Discord user info (proxy to avoid CORS)
  app.get("/api/discord/user/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const discordToken = process.env.DISCORD_BOT_TOKEN;
      
      if (!discordToken) {
        return res.status(500).json({ message: "Discord bot token not configured" });
      }

      const response = await fetch(`https://discord.com/api/v10/users/${userId}`, {
        headers: {
          'Authorization': `Bot ${discordToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return res.status(404).json({ message: "Discord user not found" });
        }
        throw new Error(`Discord API error: ${response.status}`);
      }

      const userData = await response.json();
      
      // Transform Discord user data
      const discordProfile = {
        id: userData.id,
        username: userData.username,
        discriminator: userData.discriminator,
        avatar: userData.avatar 
          ? `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png?size=512`
          : `https://cdn.discordapp.com/embed/avatars/${parseInt(userData.discriminator) % 5}.png`,
        globalName: userData.global_name,
      };

      res.json(discordProfile);
    } catch (error) {
      console.error("Error fetching Discord user:", error);
      res.status(500).json({ message: "Failed to fetch Discord user data" });
    }
  });

  // Update profile
  app.put("/api/profile/:discordId", async (req, res) => {
    try {
      const { discordId } = req.params;
      const updates = req.body;
      
      const updatedProfile = await storage.updateProfile(discordId, updates);
      
      if (!updatedProfile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      
      res.json(updatedProfile);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get profile by shareable URL
  app.get("/api/profile/share/:shareableUrl", async (req, res) => {
    try {
      const { shareableUrl } = req.params;
      const profile = await storage.getProfileByShareableUrl(shareableUrl);
      
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      
      res.json(profile);
    } catch (error) {
      console.error("Error fetching shared profile:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Sync Discord data
  app.post("/api/profile/:discordId/sync", async (req, res) => {
    try {
      const { discordId } = req.params;
      const discordToken = process.env.DISCORD_BOT_TOKEN;
      
      if (!discordToken) {
        return res.status(500).json({ message: "Discord bot token not configured" });
      }

      const response = await fetch(`https://discord.com/api/v10/users/${discordId}`, {
        headers: {
          'Authorization': `Bot ${discordToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return res.status(404).json({ message: "Discord user not found" });
        }
        throw new Error(`Discord API error: ${response.status}`);
      }

      const userData = await response.json();
      
      // Update profile with Discord data
      const updates = {
        username: userData.global_name || userData.username,
        discordUsername: `${userData.username}#${userData.discriminator}`,
        avatarUrl: userData.avatar 
          ? `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png?size=512`
          : `https://cdn.discordapp.com/embed/avatars/${parseInt(userData.discriminator) % 5}.png`,
      };

      const updatedProfile = await storage.updateProfile(discordId, updates);
      
      if (!updatedProfile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      
      res.json(updatedProfile);
    } catch (error) {
      console.error("Error syncing Discord data:", error);
      res.status(500).json({ message: "Failed to sync Discord data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
