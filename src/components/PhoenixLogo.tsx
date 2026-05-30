/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface PhoenixLogoProps {
  className?: string;
  size?: number | string;
}

export default function PhoenixLogo({ className = "", size = 48 }: PhoenixLogoProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 512 512" 
      fill="none" 
      className={`${className} transition-transform duration-300 hover:scale-105`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Fiery Wing Left Gradient */}
        <linearGradient id="fireWingLeft" x1="439.4" y1="91.1" x2="310.4" y2="447.8" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFAE00" />
          <stop offset="20%" stopColor="#FF6A00" />
          <stop offset="70%" stopColor="#D80000" />
          <stop offset="100%" stopColor="#8A0000" />
        </linearGradient>

        {/* Fiery Wing Right Gradient */}
        <linearGradient id="fireWingRight" x1="72.6" y1="91.1" x2="201.6" y2="447.8" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFF000" />
          <stop offset="30%" stopColor="#FF8F00" />
          <stop offset="80%" stopColor="#E01100" />
          <stop offset="100%" stopColor="#7F0000" />
        </linearGradient>

        {/* Tail & Body Base Gradient */}
        <linearGradient id="phoenixBody" x1="256" y1="210" x2="256" y2="490" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFA200" />
          <stop offset="40%" stopColor="#FF4000" />
          <stop offset="80%" stopColor="#C80200" />
          <stop offset="100%" stopColor="#4A0000" />
        </linearGradient>

        {/* Green Growth Bar Chart Gradient */}
        <linearGradient id="greenGraphGrad" x1="0" y1="380" x2="0" y2="210" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#024D1E" />
          <stop offset="35%" stopColor="#0B8B3E" />
          <stop offset="85%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#34D399" />
        </linearGradient>

        {/* Green Arrow Gradient */}
        <linearGradient id="greenArrowGrad" x1="160" y1="360" x2="350" y2="200" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#025C24" />
          <stop offset="50%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#4ADE80" />
        </linearGradient>

        {/* Dynamic drop shadow to create deep premium aesthetic */}
        <filter id="glowingShadow" x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#FF3E00" floodOpacity="0.18" />
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.12" />
        </filter>
      </defs>

      {/* Main Nested G with Soft Drop Shadow */}
      <g filter="url(#glowingShadow)">
        
        {/* --- LEFT WING (FIRE FEATHERS) --- */}
        <path 
          d="M 235 340 
             C 180 340, 130 300, 100 240 
             C 75 190, 75 120, 110 80 
             C 100 100, 95 130, 95 160 
             C 95 210, 115 260, 150 295 
             C 130 260, 120 220, 120 180 
             C 120 140, 135 100, 160 70 
             C 145 95, 140 130, 145 165 
             C 150 210, 175 255, 210 285 
             C 195 245, 190 205, 195 165 
             C 200 125, 215 90, 240 60 
             C 225 90, 220 130, 225 170 
             C 230 215, 250 260, 280 290
             C 270 240, 270 190, 285 140 
             C 290 120, 300 100, 315 80
             C 300 110, 295 150, 300 190
             C 305 230, 325 270, 355 295
             C 335 250, 335 200, 350 150
             C 360 120, 375 90, 400 70
             C 380 95, 375 140, 385 185
             C 390 225, 415 265, 450 285
             C 410 245, 410 185, 430 130
             C 440 100, 460 75, 490 60
             C 460 90, 455 140, 465 190
             C 475 240, 450 310, 380 355
             C 340 380, 290 390, 235 340 Z" 
          fill="url(#fireWingLeft)" 
        />

        {/* --- RIGHT WING (FIRE FEATHERS) --- */}
        <path 
          d="M 277 340 
             C 332 340, 382 300, 412 240 
             C 437 190, 437 120, 402 80 
             C 412 100, 417 130, 417 160 
             C 417 210, 397 260, 362 295 
             C 382 260, 392 220, 392 180 
             C 392 140, 377 100, 352 70 
             C 367 95, 372 130, 367 165 
             C 362 210, 337 255, 302 285 
             C 317 245, 322 205, 317 165 
             C 312 125, 297 90, 272 60 
             C 287 90, 292 130, 287 170 
             C 282 215, 262 260, 232 290
             C 242 240, 242 190, 227 140 
             C 222 120, 212 100, 197 80
             C 212 110, 217 150, 212 190
             C 207 230, 187 270, 157 295
             C 177 250, 177 200, 162 150
             C 152 120, 137 90, 112 70
             C 132 95, 137 140, 127 185
             C 122 225, 97 265, 62 285
             C 102 245, 102 185, 82 130
             C 72 100, 52 75, 22 60
             C 52 90, 57 140, 47 190
             C 37 240, 62 310, 132 355
             C 172 380, 222 390, 277 340 Z" 
          fill="url(#fireWingRight)" 
        />

        {/* --- PHOENIX LOWER BODY & TAIL EMBRACERS --- */}
        <path 
          d="M 256 260 
             C 230 260, 210 280, 215 310 
             C 220 340, 235 370, 235 400 
             C 235 430, 210 460, 180 470 
             C 220 485, 260 485, 290 470 
             C 310 460, 325 430, 321 405 
             C 317 380, 295 345, 300 310 
             C 305 280, 282 260, 256 260 Z" 
          fill="url(#phoenixBody)" 
        />

        {/* Flame Sweep framing under the chart base */}
        <path 
          d="M 140 330 
             C 190 420, 322 420, 372 330
             C 340 380, 270 410, 256 410
             C 242 410, 172 380, 140 330 Z" 
          fill="url(#phoenixBody)" 
          opacity="0.9"
        />

        {/* --- PHOENIX HEAD & MAJESTIC NECK PROFILE --- */}
        <g>
          {/* Flame Neck */}
          <path 
            d="M 230 210 
               C 230 150, 255 120, 270 120 
               C 280 140, 275 170, 265 190 
               C 260 200, 256 210, 256 220
               L 230 210 Z" 
            fill="url(#phoenixBody)" 
          />
          
          {/* Head & Crown looking right */}
          <path 
            d="M 256 120 
               C 262 105, 275 90, 295 85
               C 285 100, 283 115, 285 125
               C 290 127, 296 130, 302 135
               L 282 142
               C 280 135, 272 130, 256 120 Z" 
            fill="#FF8000" 
          />

          {/* Sharp beak */}
          <path 
            d="M 285 125 
               L 305 133 
               L 282 141 
               Z" 
            fill="#FFF000" 
          />

          {/* Golden Eye Accent */}
          <circle cx="276" cy="128" r="2.5" fill="#FFF" />
          <circle cx="276" cy="128" r="1.2" fill="#000" />
        </g>

        {/* --- CENTRAL GROWTH BAR CHART (GREEN COLUMNS) --- */}
        <g>
          {/* Circular base platter overlay to embed the chart elegantly */}
          <ellipse cx="256" cy="340" rx="90" ry="24" fill="#FFFFFF" opacity="0.95" />
          
          {/* Bar 1 (Leftmost - Shortest) */}
          <rect x="195" y="305" width="13" height="25" rx="3" fill="url(#greenGraphGrad)" />
          {/* Bar 2 */}
          <rect x="216" y="285" width="13" height="45" rx="3" fill="url(#greenGraphGrad)" />
          {/* Bar 3 */}
          <rect x="237" y="265" width="13" height="65" rx="3" fill="url(#greenGraphGrad)" />
          {/* Bar 4 */}
          <rect x="258" y="245" width="13" height="85" rx="3" fill="url(#greenGraphGrad)" />
          {/* Bar 5 (Rightmost - Tallest) */}
          <rect x="279" y="220" width="13" height="110" rx="3" fill="url(#greenGraphGrad)" />
        </g>

        {/* --- SWOOPING GROWTH ARROW (GREEN ACCENT) --- */}
        <g>
          {/* Glowing support underline shadow for the green arrow */}
          <path 
            d="M 180 325 
               Q 235 305, 300 230" 
            stroke="#002D11" 
            strokeWidth="11" 
            strokeLinecap="round" 
            opacity="0.3" 
          />
          
          {/* Main Arrow Body */}
          <path 
            d="M 180 325 
               Q 235 305, 300 230" 
            stroke="url(#greenArrowGrad)" 
            strokeWidth="8" 
            strokeLinecap="round" 
          />

          {/* Arrow Head */}
          <path 
            d="M 292 222 
               L 316 218 
               L 309 242 
               Z" 
            fill="url(#greenArrowGrad)" 
            stroke="#10B981" 
            strokeWidth="1.5" 
            strokeLinejoin="round" 
          />
        </g>

      </g>
    </svg>
  );
}
