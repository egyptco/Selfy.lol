export interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  avatar: string;
  globalName?: string;
}

export async function fetchDiscordUser(userId: string): Promise<DiscordUser> {
  const response = await fetch(`/api/discord/user/${userId}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch Discord user: ${response.statusText}`);
  }
  
  return response.json();
}

export function getDiscordAvatarUrl(userId: string, avatarHash: string, size = 512): string {
  if (avatarHash) {
    return `https://cdn.discordapp.com/avatars/${userId}/${avatarHash}.png?size=${size}`;
  }
  
  // Default avatar based on discriminator
  const defaultAvatarIndex = parseInt(userId) % 5;
  return `https://cdn.discordapp.com/embed/avatars/${defaultAvatarIndex}.png`;
}
