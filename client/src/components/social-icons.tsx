import { motion } from "framer-motion";
import {
  SiDiscord,
  SiInstagram,
  SiGithub,
  SiTelegram,
  SiTiktok,
  SiSpotify,
  SiSnapchat,
  SiRoblox,
} from "react-icons/si";

interface SocialIconsProps {
  socialLinks: Record<string, string>;
}

const socialPlatforms = [
  { key: "discord", icon: SiDiscord, color: "bg-[#5865F2]", name: "Discord" },
  { key: "instagram", icon: SiInstagram, color: "bg-gradient-to-br from-[#E4405F] via-[#F56040] to-[#FFDC80]", name: "Instagram" },
  { key: "github", icon: SiGithub, color: "bg-[#333]", name: "GitHub" },
  { key: "telegram", icon: SiTelegram, color: "bg-[#0088cc]", name: "Telegram" },
  { key: "tiktok", icon: SiTiktok, color: "bg-black", name: "TikTok" },
  { key: "spotify", icon: SiSpotify, color: "bg-[#1DB954]", name: "Spotify" },
  { key: "snapchat", icon: SiSnapchat, color: "bg-[#FFFC00]", name: "Snapchat" },
  { key: "roblox", icon: SiRoblox, color: "bg-[#00A2FF]", name: "Roblox" },
];

export default function SocialIcons({ socialLinks }: SocialIconsProps) {
  return (
    <div className="grid grid-cols-4 md:grid-cols-8 gap-6">
      {socialPlatforms.map((platform, index) => {
        const Icon = platform.icon;
        const href = socialLinks[platform.key] || "#";
        const isSnapchat = platform.key === "snapchat";
        
        return (
          <motion.a
            key={platform.key}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ 
              y: -5, 
              scale: 1.1,
              filter: "drop-shadow(0 10px 20px rgba(0, 212, 255, 0.4))"
            }}
            whileTap={{ scale: 0.95 }}
            className="social-icon group"
          >
            <div className={`w-14 h-14 ${platform.color} rounded-xl flex items-center justify-center transition-all duration-300 group-hover:shadow-lg`}>
              <Icon 
                className={`text-xl ${isSnapchat ? 'text-black' : 'text-white'} group-hover:scale-110 transition-transform duration-200`} 
              />
            </div>
          </motion.a>
        );
      })}
    </div>
  );
}
