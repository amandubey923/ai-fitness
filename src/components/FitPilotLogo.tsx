import React from "react";

interface FitPilotLogoProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
}

export default function FitPilotLogo({
  size = 20,
  className = "",
  ...props
}: FitPilotLogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      fill="none"
      width={size}
      height={size}
      className={className}
      aria-label="FitPilot AI Logo"
      {...props}
    >
      {/* Outer aerodynamic pilot wing / dynamic ascension chevron */}
      <path
        d="M16 3L4 27L16 22L28 27L16 3Z"
        fill="url(#fp-grad)"
        stroke="#18cef2"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Inner cyber facet / core */}
      <path
        d="M16 9L9.5 22.5L16 19.5L22.5 22.5L16 9Z"
        fill="#0a0c14"
        stroke="#18cef2"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      {/* Pilot AI intelligent guidance beacon */}
      <circle cx="16" cy="15" r="2" fill="#18cef2" />
      <path
        d="M16 19.5V25"
        stroke="#18cef2"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <defs>
        <linearGradient
          id="fp-grad"
          x1="16"
          y1="3"
          x2="16"
          y2="27"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#18cef2" stopOpacity="0.8" />
          <stop offset="1" stopColor="#0369a1" stopOpacity="0.3" />
        </linearGradient>
      </defs>
    </svg>
  );
}

