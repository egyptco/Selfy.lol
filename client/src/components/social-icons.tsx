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
  SiYoutube,
} from "react-icons/si";

interface SocialIconsProps {
  socialLinks: Record<string, string>;
  iconStyle?: string;
  iconColor?: string;
}

const socialPlatforms = [
  { key: "discord", icon: SiDiscord, color: "bg-[#5865F2]", hexColor: "#5865F2", name: "Discord" },
  { key: "instagram", icon: SiInstagram, color: "bg-gradient-to-br from-[#E4405F] via-[#F56040] to-[#FFDC80]", hexColor: "#E4405F", name: "Instagram" },
  { key: "github", icon: SiGithub, color: "bg-[#333]", hexColor: "#333333", name: "GitHub" },
  { key: "telegram", icon: SiTelegram, color: "bg-[#0088cc]", hexColor: "#0088cc", name: "Telegram" },
  { key: "tiktok", icon: SiTiktok, color: "bg-black", hexColor: "#000000", name: "TikTok" },
  { key: "spotify", icon: SiSpotify, color: "bg-[#1DB954]", hexColor: "#1DB954", name: "Spotify" },
  { key: "snapchat", icon: SiSnapchat, color: "bg-[#FFFC00]", hexColor: "#FFFC00", name: "Snapchat" },
  { key: "roblox", icon: SiRoblox, color: "bg-[#00A2FF]", hexColor: "#00A2FF", name: "Roblox" },
  { key: "youtube", icon: SiYoutube, color: "bg-[#FF0000]", hexColor: "#FF0000", name: "YouTube" },
];

export default function SocialIcons({ socialLinks, iconStyle = "default", iconColor = "#8B5CF6" }: SocialIconsProps) {
  const getIconStyles = (platform: any, index: number) => {
    const baseClasses = "w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:shadow-lg group-hover:scale-105";
    
    switch (iconStyle) {
      case "transparent":
        return {
          className: `${baseClasses} bg-transparent border-2 border-white/30 group-hover:border-white/60 backdrop-blur-sm`,
          backgroundColor: 'transparent',
          iconColor: platform.hexColor,
        };
      
      case "colored":
        return {
          className: `${baseClasses} backdrop-blur-sm`,
          backgroundColor: iconColor + "30",
          iconColor: iconColor,
        };
      
      case "dynamic":
        const hue = (index * 60) % 360;
        const dynamicColor = `hsl(${hue}, 70%, 60%)`;
        return {
          className: `${baseClasses} backdrop-blur-sm`,
          backgroundColor: dynamicColor + "30",
          iconColor: dynamicColor,
        };
      
      default:
        return {
          className: `${baseClasses} ${platform.color} backdrop-blur-sm`,
          backgroundColor: undefined,
          iconColor: platform.key === "snapchat" ? "#000000" : "#ffffff",
        };
    }
  };
  const filteredPlatforms = socialPlatforms.filter(platform => 
    socialLinks[platform.key] && socialLinks[platform.key].trim() !== ""
  );

  if (filteredPlatforms.length === 0) return null;

  return (
    <div className="grid grid-cols-4 md:grid-cols-8 gap-4 md:gap-6">
      {filteredPlatforms.map((platform, index) => {
        const Icon = platform.icon;
        const href = socialLinks[platform.key];
        const styles = getIconStyles(platform, index);
        
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
            <div 
              className={styles.className}
              style={{ 
                backgroundColor: styles.backgroundColor,
                border: iconStyle === "transparent" ? "2px solid rgba(255,255,255,0.3)" : "none"
              }}
            >
              <Icon 
                className="text-lg md:text-xl group-hover:scale-110 transition-transform duration-200"
                style={{ color: styles.iconColor }}
              />
            </div>
          </motion.a>
        );
      })}
    </div>
  );
}
