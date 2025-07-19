import React from 'react';

interface HeroLogoProps {
  size?: number | string;
  className?: string;
  animated?: boolean;
  showText?: boolean;
  textContent?: string;
}

const HeroLogo: React.FC<HeroLogoProps> = ({ 
  size = 300, 
  className = '',
  animated = true,
  showText = true,
  textContent = "Community Guide"
}) => {
  const sizeValue = typeof size === 'number' ? `${size}px` : size;
  
  return (
    <div 
      className={`relative inline-flex flex-col items-center justify-center ${className}`}
      style={{ width: sizeValue }}
    >
      {/* Main Logo SVG */}
      <svg
        viewBox="0 0 400 400"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full ${animated ? 'hero-logo-animated' : ''}`}
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="heroGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6E2FFF" />
            <stop offset="100%" stopColor="#FF7A00" />
          </linearGradient>
          
          <linearGradient id="pulseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6E2FFF" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#FF7A00" stopOpacity="0.1" />
          </linearGradient>
          
          <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6E2FFF" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#FF7A00" stopOpacity="0.05" />
          </linearGradient>
          
          {/* Filters */}
          <filter id="heroShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="8" />
            <feOffset dx="2" dy="2" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.5" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          
          <filter id="heroGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.8" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          
          <filter id="heroWarp" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="turbulence" baseFrequency="0.01" numOctaves="3" seed="5" />
            <feDisplacementMap in="SourceGraphic" scale="10" />
          </filter>
          
          {/* Patterns */}
          <pattern id="circuitPattern" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M10 0 L10 50 M0 10 L50 10 M20 0 L20 50 M0 20 L50 20 M30 0 L30 50 M0 30 L50 30 M40 0 L40 50 M0 40 L50 40" 
                  stroke="#6E2FFF" strokeWidth="0.5" strokeOpacity="0.2" />
            <circle cx="10" cy="10" r="1.5" fill="#FF7A00" fillOpacity="0.3" />
            <circle cx="30" cy="10" r="1.5" fill="#FF7A00" fillOpacity="0.3" />
            <circle cx="10" cy="30" r="1.5" fill="#FF7A00" fillOpacity="0.3" />
            <circle cx="30" cy="30" r="1.5" fill="#FF7A00" fillOpacity="0.3" />
          </pattern>
        </defs>
        
        {/* Background Elements */}
        <rect x="0" y="0" width="400" height="400" fill="url(#bgGradient)" rx="20" ry="20" />
        <rect x="20" y="20" width="360" height="360" fill="url(#circuitPattern)" rx="15" ry="15" className="hero-logo-rotate-slow" />
        
        {/* Pulse Rings */}
        <circle cx="200" cy="200" r="160" fill="none" stroke="url(#pulseGradient)" strokeWidth="8" className="hero-logo-pulse-ring" />
        <circle cx="200" cy="200" r="140" fill="none" stroke="url(#pulseGradient)" strokeWidth="6" className="hero-logo-pulse-ring" style={{ animationDelay: '0.5s' }} />
        <circle cx="200" cy="200" r="120" fill="none" stroke="url(#pulseGradient)" strokeWidth="4" className="hero-logo-pulse-ring" style={{ animationDelay: '1s' }} />
        
        {/* Main Logo Container */}
        <g filter="url(#heroShadow)" transform="translate(100, 100) scale(2)">
          {/* Outer Gear - More Detailed */}
          <path
            d="M50 5
               L54 2 L58 1 L62 2 L66 4
               L69 7 L71 10 L72 14 L73 18
               L75 21 L76 25 L76 29 L75 33
               L73 36 L71 39 L68 42 L65 44
               L67 48 L68 52 L67 56 L65 60
               L62 63 L58 65 L54 66 L50 67
               L46 66 L42 65 L38 63 L35 60
               L33 56 L32 52 L33 48 L35 44
               L32 42 L29 39 L27 36 L25 33
               L24 29 L24 25 L25 21 L27 18
               L28 14 L29 10 L31 7 L34 4
               L38 2 L42 1 L46 2 L50 5"
            fill="#6E2FFF"
            opacity="0.9"
            filter="url(#heroWarp)"
            className="hero-logo-rotate"
          />
          
          {/* Inner Gear - More Detailed */}
          <path
            d="M50 20
               L53 18 L56 17 L59 18 L62 20
               L64 23 L65 26 L65 29 L64 32
               L62 35 L59 37 L56 38 L53 37
               L50 35 L47 37 L44 38 L41 37
               L38 35 L36 32 L35 29 L35 26
               L36 23 L38 20 L41 18 L44 17
               L47 18 L50 20"
            fill="#FF7A00"
            opacity="0.9"
            filter="url(#heroGlow)"
            className="hero-logo-rotate-reverse"
          />
          
          {/* Brain/Circuit Network - More Detailed */}
          <g className="hero-logo-pulse-inverse">
            {/* Central Hub */}
            <circle cx="50" cy="50" r="15" fill="white" opacity="0.9" />
            <circle cx="50" cy="50" r="10" fill="url(#heroGradient)" />
            
            {/* Connection Lines */}
            <path
              d="M50 35 L50 20
                 M50 65 L50 80
                 M35 50 L20 50
                 M65 50 L80 50
                 M40 40 L25 25
                 M60 40 L75 25
                 M40 60 L25 75
                 M60 60 L75 75"
              stroke="url(#heroGradient)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="1,3"
            />
            
            {/* Connection Nodes */}
            <circle cx="50" cy="20" r="4" fill="#6E2FFF" />
            <circle cx="50" cy="80" r="4" fill="#FF7A00" />
            <circle cx="20" cy="50" r="4" fill="#6E2FFF" />
            <circle cx="80" cy="50" r="4" fill="#FF7A00" />
            <circle cx="25" cy="25" r="4" fill="#6E2FFF" />
            <circle cx="75" cy="25" r="4" fill="#FF7A00" />
            <circle cx="25" cy="75" r="4" fill="#6E2FFF" />
            <circle cx="75" cy="75" r="4" fill="#FF7A00" />
            
            {/* Secondary Connections */}
            <path
              d="M50 20 C 30 15, 15 30, 20 50
                 M50 20 C 70 15, 85 30, 80 50
                 M50 80 C 30 85, 15 70, 20 50
                 M50 80 C 70 85, 85 70, 80 50"
              stroke="url(#heroGradient)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray="1,2"
              fill="none"
            />
            
            {/* Data Pulses - These will animate along the paths */}
            <circle cx="0" cy="0" r="2" fill="#FF7A00" className="hero-logo-data-pulse" />
            <circle cx="0" cy="0" r="2" fill="#6E2FFF" className="hero-logo-data-pulse" style={{ animationDelay: '0.5s' }} />
            <circle cx="0" cy="0" r="2" fill="#FF7A00" className="hero-logo-data-pulse" style={{ animationDelay: '1s' }} />
            <circle cx="0" cy="0" r="2" fill="#6E2FFF" className="hero-logo-data-pulse" style={{ animationDelay: '1.5s' }} />
            <circle cx="0" cy="0" r="2" fill="#FF7A00" className="hero-logo-data-pulse" style={{ animationDelay: '2s' }} />
          </g>
        </g>
        
        {/* "COMMUNITY" Text Above */}
        <text
          x="200"
          y="60"
          fontSize="24"
          fontFamily="Arial, sans-serif"
          fontWeight="bold"
          textAnchor="middle"
          fill="#6E2FFF"
          filter="url(#heroGlow)"
          className="hero-logo-text-glow"
        >
          COMMUNITY
        </text>
        
        {/* "UNOFFICIAL" Text Below */}
        <text
          x="200"
          y="340"
          fontSize="16"
          fontFamily="Arial, sans-serif"
          fontWeight="bold"
          textAnchor="middle"
          fill="#FF7A00"
          filter="url(#heroGlow)"
          className="hero-logo-text-glow"
        >
          UNOFFICIAL
        </text>
      </svg>
      
      {/* Guide Text Below */}
      {showText && (
        <div className="mt-4 text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-factory-purple to-factory-orange bg-clip-text text-transparent">
            {textContent}
          </h2>
        </div>
      )}
      
      {/* Inline styles using a regular <style> tag instead of styled-jsx */}
      <style>{`
        @keyframes rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes rotateSlow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes rotateReverse {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(-360deg); }
        }
        
        @keyframes pulse {
          0% { transform: scale(0.95); opacity: 0.7; }
          50% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(0.95); opacity: 0.7; }
        }
        
        @keyframes pulseInverse {
          0% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(0.95); opacity: 1; }
          100% { transform: scale(1); opacity: 0.9; }
        }
        
        @keyframes pulseRing {
          0% { transform: scale(0.8); opacity: 0; }
          50% { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(1.2); opacity: 0; }
        }
        
        @keyframes dataPulse {
          0% { 
            transform: translate(50px, 50px); 
            opacity: 0; 
          }
          10% { 
            transform: translate(50px, 35px); 
            opacity: 1; 
          }
          20% { 
            transform: translate(50px, 20px); 
            opacity: 0; 
          }
          30% { 
            transform: translate(35px, 35px); 
            opacity: 1; 
          }
          40% { 
            transform: translate(20px, 50px); 
            opacity: 0; 
          }
          50% { 
            transform: translate(35px, 65px); 
            opacity: 1; 
          }
          60% { 
            transform: translate(50px, 80px); 
            opacity: 0; 
          }
          70% { 
            transform: translate(65px, 65px); 
            opacity: 1; 
          }
          80% { 
            transform: translate(80px, 50px); 
            opacity: 0; 
          }
          90% { 
            transform: translate(65px, 35px); 
            opacity: 1; 
          }
          100% { 
            transform: translate(50px, 50px); 
            opacity: 0; 
          }
        }
        
        @keyframes textGlow {
          0% { filter: drop-shadow(0 0 2px rgba(110, 47, 255, 0.7)); }
          50% { filter: drop-shadow(0 0 5px rgba(255, 122, 0, 0.9)); }
          100% { filter: drop-shadow(0 0 2px rgba(110, 47, 255, 0.7)); }
        }
        
        .hero-logo-animated .hero-logo-rotate {
          animation: rotate 20s linear infinite;
          transform-origin: center center;
        }
        
        .hero-logo-animated .hero-logo-rotate-slow {
          animation: rotateSlow 80s linear infinite;
          transform-origin: center center;
        }
        
        .hero-logo-animated .hero-logo-rotate-reverse {
          animation: rotateReverse 15s linear infinite;
          transform-origin: center center;
        }
        
        .hero-logo-animated .hero-logo-pulse-inverse {
          animation: pulseInverse 4s ease-in-out infinite;
          transform-origin: center center;
        }
        
        .hero-logo-animated .hero-logo-pulse-ring {
          animation: pulseRing 6s ease-out infinite;
          transform-origin: center center;
        }
        
        .hero-logo-animated .hero-logo-data-pulse {
          animation: dataPulse 10s linear infinite;
        }
        
        .hero-logo-animated .hero-logo-text-glow {
          animation: textGlow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default HeroLogo;
