export interface UserConfig {
  discordId: string;
  username: string;
  status: string;
  joinDate: string;
  location: string;
  mood: string;
}

export interface SocialConfig {
  discord?: string;
  instagram?: string;
  github?: string;
  telegram?: string;
  tiktok?: string;
  spotify?: string;
  snapchat?: string;
  roblox?: string;
}

export interface AppConfig {
  user: UserConfig;
  social: SocialConfig;
  themes: string[];
  particleCount: number;
  audioUrl?: string;
}

export const defaultConfig: AppConfig = {
  user: {
    discordId: "123456789012345678",
    username: "Ahmed",
    status: "last seen unknown",
    joinDate: "Jan 2024",
    location: "Somewhere",
    mood: "Vibing"
  },
  social: {
    discord: "https://discord.gg/yourserver",
    instagram: "https://instagram.com/yourusername",
    github: "https://github.com/yourusername",
    telegram: "https://t.me/yourusername",
    tiktok: "https://tiktok.com/@yourusername",
    spotify: "https://open.spotify.com/user/yourusername",
    snapchat: "https://snapchat.com/add/yourusername",
    roblox: "https://roblox.com/users/yourid"
  },
  themes: ["dark", "blue", "purple", "red"],
  particleCount: 50
};
