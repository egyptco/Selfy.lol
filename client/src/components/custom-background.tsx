import { useEffect, useState } from "react";
import ParticlesBackground from "./particles-background";

interface CustomBackgroundProps {
  backgroundType: string;
  backgroundUrl?: string | null;
}

export default function CustomBackground({ backgroundType, backgroundUrl }: CustomBackgroundProps) {
  const [mediaError, setMediaError] = useState(false);

  useEffect(() => {
    setMediaError(false);
  }, [backgroundUrl]);

  if (backgroundType === "particles" || !backgroundUrl || mediaError) {
    return <ParticlesBackground />;
  }

  if (backgroundType === "image") {
    return (
      <div className="fixed inset-0 z-0">
        <img
          src={backgroundUrl}
          alt="Custom Background"
          className="w-full h-full object-cover object-center"
          style={{
            minWidth: '100%',
            minHeight: '100%',
            maxWidth: 'none',
            maxHeight: 'none'
          }}
          onError={() => setMediaError(true)}
          onLoad={() => setMediaError(false)}
        />
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" />
      </div>
    );
  }

  if (backgroundType === "video") {
    return (
      <div className="fixed inset-0 z-0">
        <video
          src={backgroundUrl}
          className="w-full h-full object-cover object-center"
          style={{
            minWidth: '100%',
            minHeight: '100%',
            maxWidth: 'none',
            maxHeight: 'none'
          }}
          autoPlay
          loop
          muted
          playsInline
          onError={() => setMediaError(true)}
          onLoadedData={() => setMediaError(false)}
        />
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" />
      </div>
    );
  }

  return <ParticlesBackground />;
}