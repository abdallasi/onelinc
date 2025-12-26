import { useEffect, useState } from "react";

interface Snowflake {
  id: number;
  x: number;
  size: number;
  opacity: number;
  animationDuration: number;
  delay: number;
  emoji: string;
}

const CHRISTMAS_EMOJIS = ["❄️", "✨", "🎄", "⭐", "❄️", "✨", "❄️"];

const ChristmasSnow = () => {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Create snowflakes
    const flakes: Snowflake[] = [];
    const count = window.innerWidth < 768 ? 25 : 40;

    for (let i = 0; i < count; i++) {
      flakes.push({
        id: i,
        x: Math.random() * 100,
        size: Math.random() * 12 + 10,
        opacity: Math.random() * 0.6 + 0.3,
        animationDuration: Math.random() * 8 + 6,
        delay: Math.random() * 5,
        emoji: CHRISTMAS_EMOJIS[Math.floor(Math.random() * CHRISTMAS_EMOJIS.length)],
      });
    }

    setSnowflakes(flakes);

    // Fade out after 12 seconds for subtle Apple-like experience
    const fadeTimer = setTimeout(() => {
      setIsVisible(false);
    }, 12000);

    return () => clearTimeout(fadeTimer);
  }, []);

  if (!isVisible && snowflakes.length > 0) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-50 overflow-hidden transition-opacity duration-1000"
      style={{ opacity: isVisible ? 1 : 0 }}
    >
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="absolute animate-snowfall"
          style={{
            left: `${flake.x}%`,
            fontSize: `${flake.size}px`,
            opacity: flake.opacity,
            animationDuration: `${flake.animationDuration}s`,
            animationDelay: `${flake.delay}s`,
            top: "-30px",
          }}
        >
          {flake.emoji}
        </div>
      ))}
      
      {/* Subtle Christmas greeting - Apple style */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 text-center animate-christmas-fade">
        <p className="text-lg md:text-xl font-medium text-foreground/80 tracking-wide">
          Happy Holidays ✨
        </p>
      </div>
    </div>
  );
};

export default ChristmasSnow;
