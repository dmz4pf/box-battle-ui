const sharp = require('sharp');
const fs = require('fs');

const svgBuffer = Buffer.from(`<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1e1b4b;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#581c87;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#831843;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="grid-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#06b6d4;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#a855f7;stop-opacity:1" />
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <rect width="512" height="512" rx="80" fill="url(#bg-gradient)"/>
  <g filter="url(#glow)">
    <circle cx="160" cy="160" r="12" fill="#06b6d4"/>
    <circle cx="240" cy="160" r="12" fill="#06b6d4"/>
    <circle cx="320" cy="160" r="12" fill="#06b6d4"/>
    <circle cx="400" cy="160" r="12" fill="#a855f7"/>
    <circle cx="160" cy="240" r="12" fill="#06b6d4"/>
    <circle cx="240" cy="240" r="12" fill="#06b6d4"/>
    <circle cx="320" cy="240" r="12" fill="#a855f7"/>
    <circle cx="400" cy="240" r="12" fill="#a855f7"/>
    <circle cx="160" cy="320" r="12" fill="#06b6d4"/>
    <circle cx="240" cy="320" r="12" fill="#a855f7"/>
    <circle cx="320" cy="320" r="12" fill="#a855f7"/>
    <circle cx="400" cy="320" r="12" fill="#ec4899"/>
    <circle cx="160" cy="400" r="12" fill="#a855f7"/>
    <circle cx="240" cy="400" r="12" fill="#a855f7"/>
    <circle cx="320" cy="400" r="12" fill="#ec4899"/>
    <circle cx="400" cy="400" r="12" fill="#ec4899"/>
  </g>
  <g stroke-width="8" stroke-linecap="round" opacity="0.8" filter="url(#glow)">
    <line x1="160" y1="160" x2="240" y2="160" stroke="#06b6d4"/>
    <line x1="320" y1="160" x2="400" y2="160" stroke="#a855f7"/>
    <line x1="160" y1="240" x2="240" y2="240" stroke="#06b6d4"/>
    <line x1="240" y1="320" x2="320" y2="320" stroke="#a855f7"/>
    <line x1="320" y1="400" x2="400" y2="400" stroke="#ec4899"/>
    <line x1="160" y1="160" x2="160" y2="240" stroke="#06b6d4"/>
    <line x1="240" y1="240" x2="240" y2="320" stroke="#a855f7"/>
    <line x1="320" y1="160" x2="320" y2="240" stroke="#a855f7"/>
    <line x1="400" y1="240" x2="400" y2="320" stroke="#a855f7"/>
    <line x1="400" y1="320" x2="400" y2="400" stroke="#ec4899"/>
  </g>
  <g opacity="0.3">
    <rect x="320" y="320" width="80" height="80" fill="#ec4899" rx="8"/>
  </g>
  <g transform="translate(100, 80)">
    <path d="M 30 0 L 15 40 L 25 40 L 20 70 L 50 30 L 35 30 L 45 0 Z" fill="#fbbf24" filter="url(#glow)"/>
  </g>
</svg>`);

async function convertLogo() {
  try {
    // Convert to PNG
    await sharp(svgBuffer)
      .png()
      .toFile('/Users/MAC/Downloads/boxbattle-logo.png');
    console.log('✅ PNG created: /Users/MAC/Downloads/boxbattle-logo.png');

    // Convert to JPEG (with white background)
    await sharp(svgBuffer)
      .flatten({ background: { r: 255, g: 255, b: 255 } })
      .jpeg({ quality: 95 })
      .toFile('/Users/MAC/Downloads/boxbattle-logo.jpg');
    console.log('✅ JPEG created: /Users/MAC/Downloads/boxbattle-logo.jpg');

  } catch (error) {
    console.error('Error:', error);
  }
}

convertLogo();
