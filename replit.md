# Discord Profile Application

## Overview

This is a full-stack web application that creates personalized Discord-style profile pages. Users can create shareable profile cards with customizable themes, social links, music, and view statistics. The application features a modern, animated interface with particle effects and theme switching capabilities.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **UI Components**: Radix UI primitives with shadcn/ui design system
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state, React hooks for local state
- **Animations**: Framer Motion for smooth animations and transitions
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon serverless PostgreSQL
- **Session Management**: Express sessions with PostgreSQL storage
- **Development**: Hot module replacement with Vite middleware integration

### Database Design
- **ORM**: Drizzle with type-safe schema definitions
- **Tables**: 
  - `users` - User authentication data (Replit Auth compatible)
  - `profiles` - Discord profile information and customization settings
  - `viewStats` - Profile view tracking
  - `siteStats` - Global site statistics
  - `sessions` - Session storage for authentication

## Key Components

### Profile Management
- **Profile Creation**: Users can create profiles with Discord ID, username, status, location, and mood
- **Social Links**: Support for multiple platforms (Discord, Instagram, GitHub, Telegram, TikTok, Spotify, Snapchat, Roblox)
- **Customization**: Theme switching, background music, and shareable URLs
- **View Tracking**: Real-time view count updates for profiles and site-wide statistics

### Theme System
- **Multiple Themes**: Dark, blue, purple, and red color schemes
- **CSS Variables**: Dynamic theming using CSS custom properties
- **Persistent Storage**: Theme preferences saved to localStorage
- **Smooth Transitions**: Animated theme switching with Framer Motion

### Interactive Features
- **Particle Background**: Canvas-based particle animation system
- **Audio Player**: Background music support with volume controls
- **Welcome Screen**: Interactive entry point with click-to-enter functionality
- **Responsive Design**: Mobile-optimized layouts and touch interactions

## Data Flow

1. **Profile Loading**: Client requests profile data via REST API
2. **View Tracking**: Automatic view count increment on profile access
3. **Real-time Updates**: TanStack Query handles data synchronization
4. **Theme Management**: Local storage integration with React context
5. **Social Integration**: External links to various social platforms

## External Dependencies

### Core Dependencies
- **Database**: @neondatabase/serverless for PostgreSQL connectivity
- **ORM**: drizzle-orm with drizzle-kit for migrations
- **UI Framework**: React with extensive Radix UI component library
- **Styling**: Tailwind CSS with PostCSS processing
- **Icons**: Lucide React and React Icons for social platform icons
- **Animations**: Framer Motion for complex animations

### Development Tools
- **TypeScript**: Full type safety across frontend and backend
- **Vite**: Development server with hot reload and build optimization
- **ESBuild**: Production build tool for server-side code
- **Replit Integration**: Development environment plugins and error handling

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with Express API proxy
- **Hot Reload**: Full-stack hot module replacement
- **Error Handling**: Runtime error overlay for development debugging

### Production Build
- **Client Build**: Vite builds optimized React application to `dist/public`
- **Server Build**: ESBuild bundles Express server to `dist/index.js`
- **Static Assets**: Client files served from Express in production mode

### Replit Deployment
- **Auto-scaling**: Configured for Replit's auto-scale deployment target
- **Environment**: PostgreSQL 16 and Node.js 20 modules
- **Port Configuration**: Express server on port 5000, external port 80

### Database Management
- **Schema**: Shared TypeScript schema definitions between client and server
- **Migrations**: Drizzle Kit handles database schema updates
- **Connection**: Neon serverless with WebSocket support for optimal performance

## Changelog

Changelog:
- June 19, 2025. Initial setup
- June 19, 2025. Added comprehensive profile image upload functionality with 5MB limit and multiple format support (JPG, PNG, GIF, WebP)
- June 19, 2025. Fixed audio player to use profile-specific audio URLs and enabled auto-unmute on page load
- June 19, 2025. Enhanced settings panel with individual input fields for 9 social platforms (Discord, Instagram, GitHub, Telegram, TikTok, Spotify, Snapchat, Roblox, YouTube)
- June 19, 2025. Added editable join date field in profile settings
- June 19, 2025. Fixed all control buttons positioning and functionality (Settings, Share, Theme switcher)
- June 19, 2025. Implemented proper static file serving for uploaded images
- June 19, 2025. Added advanced audio controls with mute/unmute toggle, volume slider, and interactive control panel
- June 19, 2025. Repositioned site statistics box to bottom-right for better alignment with copyright footer
- June 19, 2025. Removed LinkedIn, Twitch, and Twitter/X from social media options per user request
- June 19, 2025. Added comprehensive social media icon customization (default, transparent, colored, dynamic styles)
- June 19, 2025. Implemented custom background support (particles, image, video) with file upload capability
- June 19, 2025. Added "Now Playing" display component for current music with YouTube/Spotify source detection
- June 19, 2025. Enhanced audio settings with title field for better music identification
- June 19, 2025. Fixed audio player to always display control button even without audio URL
- June 19, 2025. Added luxury gradient backgrounds (black-to-dark-purple and black-to-gray-white)
- June 19, 2025. Cleaned up default social media links from demo profile
- June 19, 2025. Added immersive dark rain theme with realistic falling raindrops and lightning effects
- June 19, 2025. Added deep black background theme for maximum darkness effect
- June 19, 2025. Implemented custom background upload functionality for images and videos (up to 50MB)
- June 19, 2025. Enhanced background system to support user-uploaded media files

## User Preferences

Preferred communication style: Simple, everyday language.