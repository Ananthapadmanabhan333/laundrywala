import React from 'react'

interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showText?: boolean
  lightMode?: boolean
}

export function Logo({
  className = '',
  size = 'md',
  showText = true,
  lightMode = false,
}: LogoProps) {
  const dimensions = {
    sm: { width: 140, height: 40, iconSize: 32 },
    md: { width: 220, height: 64, iconSize: 48 },
    lg: { width: 320, height: 96, iconSize: 72 },
    xl: { width: 400, height: 180, iconSize: 120 }, // Full stacked logo
  }

  const { width, height, iconSize } = dimensions[size]
  const brandBlue = lightMode ? '#ffffff' : '#0c2340'
  const brandGreen = '#10b981'
  const brandGreenLight = '#34d399'
  const brandText = lightMode ? '#ffffff' : '#0c2340'
  const tagColor = '#10b981'

  // If size is 'xl', let's render a beautiful stacked logo matching the official logo layout!
  if (size === 'xl') {
    return (
      <div className={`flex flex-col items-center justify-center text-center ${className}`}>
        {/* Animated Custom Logo SVG */}
        <div className="relative group transition-transform duration-500 hover:scale-105">
          {/* Outer circle backup glow */}
          <div className="absolute inset-0 bg-accent/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <svg
            width={iconSize}
            height={iconSize}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="relative z-10"
          >
            {/* Soft Green Circle Backdrop (Sage circle) */}
            <circle cx="50" cy="45" r="32" fill="#D1FAE5" fillOpacity="0.8" />
            
            {/* Trail Particles (Droplets) */}
            <circle cx="28" cy="51" r="2.5" fill={brandGreen} className="animate-pulse" />
            <circle cx="31" cy="53" r="1.5" fill={brandGreen} />
            <circle cx="33" cy="49" r="2" fill={brandGreen} />
            <circle cx="34" cy="55" r="1.2" fill={brandGreen} />
            <circle cx="26" cy="54" r="1.5" fill={brandGreen} />
            
            {/* Green Grass underline */}
            <path
              d="M31 60 C 42 63, 58 63, 69 60"
              stroke={brandGreen}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            
            {/* Wifi Smart Signal Waves */}
            <path
              d="M40 37 C 42 34, 48 34, 50 37"
              stroke={brandGreen}
              strokeWidth="2"
              strokeLinecap="round"
              className="animate-pulse"
            />
            <path
              d="M37 32 C 41 27, 49 27, 53 32"
              stroke={brandGreen}
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M34 27 C 40 20, 50 20, 56 27"
              stroke={brandGreen}
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Shopping Cart Body */}
            {/* Handle & Back frame */}
            <path
              d="M26 31 H 34 L 38 52 C 38.5 54.5, 41 55.5, 43 55.5 H 60"
              stroke={brandBlue}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Basket Grid Outline */}
            <path
              d="M35 34.5 H 63 L 60 48.5 H 37.8 L 35 34.5 Z"
              fill={lightMode ? 'none' : '#ffffff'}
              stroke={brandBlue}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Inner Grid details */}
            <line x1="41" y1="35" x2="43.5" y2="48" stroke={brandBlue} strokeWidth="1.5" />
            <line x1="47" y1="35" x2="49.5" y2="48" stroke={brandBlue} strokeWidth="1.5" />
            <line x1="53" y1="35" x2="55" y2="48" stroke={brandBlue} strokeWidth="1.5" />
            <line x1="59" y1="35" x2="60.5" y2="48" stroke={brandBlue} strokeWidth="1.5" />
            <line x1="36" y1="41" x2="61" y2="41" stroke={brandBlue} strokeWidth="1.5" />

            {/* Price Tag Hanging from Handle */}
            <rect
              x="29"
              y="36"
              width="6.5"
              height="10"
              rx="1.5"
              transform="rotate(15, 29, 36)"
              fill={tagColor}
              stroke={brandBlue}
              strokeWidth="1.2"
            />
            <circle
              cx="31.8"
              cy="39.2"
              r="1"
              fill="#ffffff"
            />

            {/* Wheels */}
            {/* Front Wheel */}
            <circle cx="43.5" cy="56.5" r="4.5" fill={brandGreen} stroke={brandBlue} strokeWidth="2.5" />
            <circle cx="43.5" cy="56.5" r="1.5" fill={brandBlue} />
            {/* Rear Wheel */}
            <circle cx="58.5" cy="56.5" r="4.5" fill={brandGreen} stroke={brandBlue} strokeWidth="2.5" />
            <circle cx="58.5" cy="56.5" r="1.5" fill={brandBlue} />
          </svg>
        </div>

        {/* Text Area */}
        <div className="mt-4">
          <h1
            className="text-4xl font-extrabold tracking-wide uppercase"
            style={{
              color: brandText,
              fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif",
            }}
          >
            MANODROP
          </h1>
          <p
            className="text-sm font-semibold tracking-[0.25em] uppercase opacity-90 mt-1"
            style={{
              color: brandGreen,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            ALL YOU DESIRE
          </p>
        </div>
      </div>
    )
  }

  // Row layout for header navigation (Horizontal)
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        {/* Sage green circle */}
        <circle cx="50" cy="45" r="32" fill="#D1FAE5" fillOpacity="0.8" />
        
        {/* Grass underline */}
        <path
          d="M31 60 C 42 63, 58 63, 69 60"
          stroke={brandGreen}
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Wifi smart waves */}
        <path d="M40 37 C 42 34, 48 34, 50 37" stroke={brandGreen} strokeWidth="2" strokeLinecap="round" />
        <path d="M37 32 C 41 27, 49 27, 53 32" stroke={brandGreen} strokeWidth="2" strokeLinecap="round" />
        <path d="M34 27 C 40 20, 50 20, 56 27" stroke={brandGreen} strokeWidth="2" strokeLinecap="round" />

        {/* Shopping Cart Outline */}
        <path
          d="M26 31 H 34 L 38 52 C 38.5 54.5, 41 55.5, 43 55.5 H 60"
          stroke={brandBlue}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M35 34.5 H 63 L 60 48.5 H 37.8 L 35 34.5 Z"
          fill={lightMode ? 'none' : '#ffffff'}
          stroke={brandBlue}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line x1="41" y1="35" x2="43.5" y2="48" stroke={brandBlue} strokeWidth="1.5" />
        <line x1="47" y1="35" x2="49.5" y2="48" stroke={brandBlue} strokeWidth="1.5" />
        <line x1="53" y1="35" x2="55" y2="48" stroke={brandBlue} strokeWidth="1.5" />
        <line x1="59" y1="35" x2="60.5" y2="48" stroke={brandBlue} strokeWidth="1.5" />
        <line x1="36" y1="41" x2="61" y2="41" stroke={brandBlue} strokeWidth="1.5" />

        {/* Tag */}
        <rect
          x="29"
          y="36"
          width="6.5"
          height="10"
          rx="1.5"
          transform="rotate(15, 29, 36)"
          fill={tagColor}
          stroke={brandBlue}
          strokeWidth="1.2"
        />
        <circle cx="31.8" cy="39.2" r="1" fill="#ffffff" />

        {/* Wheels */}
        <circle cx="43.5" cy="56.5" r="4.5" fill={brandGreen} stroke={brandBlue} strokeWidth="2.5" />
        <circle cx="43.5" cy="56.5" r="1.5" fill={brandBlue} />
        <circle cx="58.5" cy="56.5" r="4.5" fill={brandGreen} stroke={brandBlue} strokeWidth="2.5" />
        <circle cx="58.5" cy="56.5" r="1.5" fill={brandBlue} />
      </svg>

      {showText && (
        <div className="flex flex-col">
          <span
            className="text-xl font-extrabold tracking-wide uppercase leading-none"
            style={{
              color: brandText,
              fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif",
            }}
          >
            MANODROP
          </span>
          <span
            className="text-[9px] font-bold tracking-[0.2em] uppercase leading-none mt-0.5"
            style={{
              color: brandGreen,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            ALL YOU DESIRE
          </span>
        </div>
      )}
    </div>
  )
}
