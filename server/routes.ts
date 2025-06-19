import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProfileSchema, insertUserAccountSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure multer for file uploads
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage_multer = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage_multer,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

const uploadBackground = multer({
  storage: storage_multer,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit for videos
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'video/mp4', 'video/webm', 'video/ogg', 'video/avi', 'video/mov'
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed'));
    }
  }
});

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
      await storage.incrementSiteViews(); // Increment site-wide views
      res.json(viewStats);
    } catch (error) {
      console.error("Error incrementing view count:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get site statistics
  app.get("/api/site/stats", async (req, res) => {
    try {
      const stats = await storage.getSiteStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching site stats:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Auth routes for new user system
  
  // Register new user
  app.post("/api/auth/register", async (req, res) => {
    try {
      // Validate input data
      const validationResult = insertUserAccountSchema.safeParse(req.body);
      if (!validationResult.success) {
        const validationError = fromZodError(validationResult.error);
        return res.status(400).json({ 
          message: "بيانات غير صحيحة", 
          error: validationError.message 
        });
      }

      const { userId, password, name, email } = validationResult.data;

      // Check if user already exists
      const existingUser = await storage.getUserAccount(userId);
      if (existingUser) {
        return res.status(409).json({ message: "هذا المعرف مستخدم بالفعل" });
      }

      // Check if email already exists
      const existingEmail = await storage.getUserAccountByEmail(email);
      if (existingEmail) {
        return res.status(409).json({ message: "هذا البريد الإلكتروني مستخدم بالفعل" });
      }

      // Simple password hashing (base64 + salt)
      const hashedPassword = Buffer.from(password + userId + "salt").toString('base64');

      // Create new user account
      const newUser = await storage.createUserAccount({
        userId,
        password: hashedPassword,
        name,
        email,
        bio: "",
        website: "",
        avatar: ""
      });

      // Return user data without password
      const { password: _, ...userResponse } = newUser;
      res.status(201).json(userResponse);
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ message: "حدث خطأ أثناء إنشاء الحساب" });
    }
  });

  // Login user
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { userId, password } = req.body;

      if (!userId || !password) {
        return res.status(400).json({ message: "معرف المستخدم وكلمة المرور مطلوبان" });
      }

      // Get user account
      const user = await storage.getUserAccount(userId);
      if (!user) {
        return res.status(401).json({ message: "معرف المستخدم أو كلمة المرور غير صحيحة" });
      }

      // Check password
      const hashedPassword = Buffer.from(password + userId + "salt").toString('base64');
      if (user.password !== hashedPassword) {
        return res.status(401).json({ message: "معرف المستخدم أو كلمة المرور غير صحيحة" });
      }

      // Update last login
      await storage.updateUserAccount(userId, { lastLogin: new Date() });

      // Return user data without password
      const { password: _, ...userResponse } = user;
      res.json(userResponse);
    } catch (error) {
      console.error("Error logging in user:", error);
      res.status(500).json({ message: "حدث خطأ أثناء تسجيل الدخول" });
    }
  });

  // Get user profile by userId
  app.get("/api/auth/user/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await storage.getUserAccount(userId);
      
      if (!user) {
        return res.status(404).json({ message: "المستخدم غير موجود" });
      }

      // Return user data without password
      const { password: _, ...userResponse } = user;
      res.json(userResponse);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "حدث خطأ أثناء جلب بيانات المستخدم" });
    }
  });

  // Update user profile
  app.put("/api/auth/user/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const { name, bio, website, avatar } = req.body;

      const updatedUser = await storage.updateUserAccount(userId, {
        name,
        bio,
        website,
        avatar
      });

      if (!updatedUser) {
        return res.status(404).json({ message: "المستخدم غير موجود" });
      }

      // Return user data without password
      const { password: _, ...userResponse } = updatedUser;
      res.json(userResponse);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "حدث خطأ أثناء تحديث البيانات" });
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

  // Upload profile image
  app.post("/api/profile/:discordId/upload-avatar", upload.single('avatar'), async (req, res) => {
    try {
      const { discordId } = req.params;
      
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }
      
      const avatarUrl = `/uploads/${req.file.filename}`;
      const updatedProfile = await storage.updateProfile(discordId, { avatarUrl });
      
      if (!updatedProfile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      
      res.json({ 
        message: "Profile image updated successfully", 
        avatarUrl,
        profile: updatedProfile 
      });
    } catch (error) {
      console.error("Error uploading avatar:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Upload background image/video
  app.post("/api/profile/:discordId/upload-background", uploadBackground.single('background'), async (req, res) => {
    try {
      const { discordId } = req.params;
      
      if (!req.file) {
        return res.status(400).json({ message: "No background file provided" });
      }
      
      const backgroundUrl = `/uploads/${req.file.filename}`;
      const backgroundType = req.file.mimetype.startsWith('video/') ? 'video' : 'image';
      
      const updatedProfile = await storage.updateProfile(discordId, { 
        backgroundUrl,
        backgroundType 
      });
      
      if (!updatedProfile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      
      res.json({ 
        message: "Background updated successfully", 
        backgroundUrl,
        backgroundType,
        profile: updatedProfile 
      });
    } catch (error) {
      console.error("Error uploading background:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Serve uploaded files
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

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
