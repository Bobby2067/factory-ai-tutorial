import React from 'react';

interface CommunityLogoProps {
  size?: number | string;
  className?: string;
  animated?: boolean;
}

const CommunityLogo: React.FC<CommunityLogoProps> = ({ 
  size = 40, 
  className = '',
  animated = true
}) => {
  const sizeValue = typeof size === 'number' ? `${size}px` : size;
  
  return (
    <div 
      className={`inline-flex items-center justify-center ${className}`}
      style={{ width: sizeValue, height: sizeValue }}
    >
      <svg
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full ${animated ? 'community-logo-animated' : ''}`}
      >
        <defs>
          <linearGradient id="purpleOrangeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="10%" stopColor="#6E2FFF" />
            <stop offset="90%" stopColor="#FF7A00" />
          </linearGradient>
          
          <filter id="warpFilter" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="turbulence" baseFrequency="0.01" numOctaves="2" seed="2" />
            <feDisplacementMap in="SourceGraphic" scale="5" />
          </filter>
          
          <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
            <feOffset dx="1" dy="1" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.5" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {/* Background Circle */}
        <circle 
          cx="50" 
          cy="50" 
          r="45" 
          fill="white" 
          filter="url(#softShadow)"
          className="community-logo-pulse"
        />
        
        {/* Outer Gear */}
        <path
          d="M50 10
             L53 5 L57 6 L60 10
             L65 8 L68 10 L70 15
             L75 15 L77 18 L78 23
             L83 25 L84 29 L82 34
             L86 38 L85 42 L82 46
             L85 51 L82 55 L78 57
             L78 62 L75 65 L70 66
             L68 71 L64 73 L60 72
             L55 75 L50 76 L45 75
             L40 77 L35 76 L32 72
             L27 71 L23 68 L22 64
             L17 61 L15 57 L16 53
             L12 48 L11 44 L14 40
             L12 35 L13 30 L17 27
             L18 22 L22 19 L27 18
             L30 13 L34 11 L39 12
             L44 9 L50 10"
          fill="#6E2FFF"
          opacity="0.9"
          filter="url(#warpFilter)"
          className="community-logo-rotate"
        />
        
        {/* Inner Brain/Circuit */}
        <g filter="url(#softShadow)" className="community-logo-pulse-inverse">
          {/* Brain Hemisphere Left */}
          <path
            d="M30 40
               C25 45, 25 55, 30 60
               C35 65, 45 65, 50 60"
            fill="none"
            stroke="#FF7A00"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="1,2"
          />
          
          {/* Brain Hemisphere Right */}
          <path
            d="M70 40
               C75 45, 75 55, 70 60
               C65 65, 55 65, 50 60"
            fill="none"
            stroke="#FF7A00"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="1,2"
          />
          
          {/* Circuit Lines */}
          <path
            d="M50 30 L50 70
               M35 50 L65 50
               M40 40 L60 60
               M40 60 L60 40"
            stroke="url(#purpleOrangeGradient)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          
          {/* Circuit Nodes */}
          <circle cx="50" cy="50" r="4" fill="#6E2FFF" />
          <circle cx="50" cy="30" r="3" fill="#FF7A00" />
          <circle cx="50" cy="70" r="3" fill="#FF7A00" />
          <circle cx="35" cy="50" r="3" fill="#FF7A00" />
          <circle cx="65" cy="50" r="3" fill="#FF7A00" />
          <circle cx="40" cy="40" r="2" fill="#6E2FFF" />
          <circle cx="60" cy="60" r="2" fill="#6E2FFF" />
          <circle cx="40" cy="60" r="2" fill="#6E2FFF" />
          <circle cx="60" cy="40" r="2" fill="#6E2FFF" />
        </g>
        
        {/* "Community" Text */}
        <text
          x="50"
          y="85"
          fontSize="8"
          fontFamily="Arial, sans-serif"
          fontWeight="bold"
          textAnchor="middle"
          fill="#6E2FFF"
        >
          COMMUNITY
        </text>
      </svg>
      
      <style>{`
        @keyframes rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes rotateCounterClockwise {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(-360deg); }
        }
        
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        @keyframes pulseInverse {
          0% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(0.95); opacity: 1; }
          100% { transform: scale(1); opacity: 0.9; }
        }
        
        .community-logo-animated .community-logo-rotate {
          animation: rotate 20s linear infinite;
          transform-origin: center center;
        }
        
        .community-logo-animated .community-logo-pulse {
          animation: pulse 3s ease-in-out infinite;
          transform-origin: center center;
        }
        
        .community-logo-animated .community-logo-pulse-inverse {
          animation: pulseInverse 3s ease-in-out infinite;
          transform-origin: center center;
        }
      `}</style>
    </div>
  );
};

export default CommunityLogo;
