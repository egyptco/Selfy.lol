import { useEffect, useState } from "react";
import ParticlesBackground from "./particles-background";

interface CustomBackgroundProps {
  backgroundType: string;
  backgroundUrl?: string | null;
}

const GradientBackground = ({ type }: { type: string }) => {
  const gradients = {
    "gradient-blue": "bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800",
    "gradient-purple": "bg-gradient-to-br from-purple-600 via-pink-600 to-red-600",
    "gradient-sunset": "bg-gradient-to-br from-orange-500 via-red-500 to-pink-600",
    "gradient-ocean": "bg-gradient-to-br from-teal-400 via-blue-500 to-purple-600",
    "gradient-luxury": "bg-gradient-to-br from-black via-purple-950 to-purple-900",
    "gradient-elegant": "bg-gradient-to-br from-black via-gray-800 to-gray-600",
    "gradient-deep-black": "bg-black",
  };
  
  return (
    <div className={`fixed inset-0 z-0 ${gradients[type as keyof typeof gradients]} animate-gradient-x`}>
      <div className="absolute inset-0 bg-black/20" />
    </div>
  );
};

const MatrixBackground = () => (
  <div className="fixed inset-0 z-0 bg-black overflow-hidden">
    <div className="absolute inset-0 opacity-20">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="absolute text-green-400 text-xs font-mono animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
          }}
        >
          {Math.random().toString(36).substr(2, 8)}
        </div>
      ))}
    </div>
  </div>
);

const StarsBackground = () => (
  <div className="fixed inset-0 z-0 bg-gradient-to-b from-purple-900 to-black">
    <div className="absolute inset-0">
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
          }}
        />
      ))}
    </div>
  </div>
);

const WavesBackground = () => (
  <div className="fixed inset-0 z-0 bg-gradient-to-b from-blue-400 to-blue-800">
    <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-blue-600 to-transparent animate-pulse" />
    <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-blue-500 to-transparent animate-bounce" style={{ animationDuration: '3s' }} />
  </div>
);

const GeometricBackground = () => (
  <div className="fixed inset-0 z-0 bg-gradient-to-br from-gray-900 to-gray-700">
    <div className="absolute inset-0 opacity-10">
      {Array.from({ length: 15 }).map((_, i) => (
        <div
          key={i}
          className="absolute border border-white/20 rotate-45 animate-spin"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${20 + Math.random() * 40}px`,
            height: `${20 + Math.random() * 40}px`,
            animationDuration: `${10 + Math.random() * 20}s`,
          }}
        />
      ))}
    </div>
  </div>
);

const RainBackground = () => {
  return (
    <div className="fixed inset-0 z-0 bg-black overflow-hidden">
      {/* Very dark overlay for deep black effect */}
      <div className="absolute inset-0 bg-black/95" />
      
      {/* Subtle rain drops */}
      <div className="absolute inset-0">
        {Array.from({ length: 60 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-6 bg-gradient-to-b from-gray-500/20 to-transparent"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animation: `rain-fall ${1 + Math.random() * 2}s linear infinite`,
            }}
          />
        ))}
      </div>
      
      {/* Very subtle lightning effect */}
      <div 
        className="absolute inset-0 opacity-0 bg-gray-200/5" 
        style={{
          animation: `lightning-flash 8s ease-in-out infinite`,
          animationDelay: `${Math.random() * 12}s`
        }} 
      />
    </div>
  );
};

const CustomImageBackground = ({ backgroundUrl }: { backgroundUrl?: string | null }) => {
  if (!backgroundUrl) return null;
  
  const isVideo = backgroundUrl.includes('.mp4') || backgroundUrl.includes('.webm') || backgroundUrl.includes('.mov') || backgroundUrl.includes('.avi');
  
  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {isVideo ? (
        <video
          autoPlay
          loop
          muted
          className="w-full h-full object-cover"
          src={backgroundUrl}
        />
      ) : (
        <img
          src={backgroundUrl}
          alt="Custom Background"
          className="w-full h-full object-cover"
        />
      )}
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/30" />
    </div>
  );
};

export default function CustomBackground({ backgroundType, backgroundUrl }: CustomBackgroundProps) {
  // Custom image/video background takes priority
  if (backgroundType === "custom" && backgroundUrl) {
    return <CustomImageBackground backgroundUrl={backgroundUrl} />;
  }

  if (backgroundType === "particles" || !backgroundType) {
    return <ParticlesBackground />;
  }

  if (backgroundType.startsWith("gradient-")) {
    return <GradientBackground type={backgroundType} />;
  }

  if (backgroundType === "matrix") {
    return <MatrixBackground />;
  }

  if (backgroundType === "stars") {
    return <StarsBackground />;
  }

  if (backgroundType === "waves") {
    return <WavesBackground />;
  }

  if (backgroundType === "geometric") {
    return <GeometricBackground />;
  }

  if (backgroundType === "rain") {
    return <RainBackground />;
  }

  return <ParticlesBackground />;
}