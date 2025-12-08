const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const svgBuffer = fs.readFileSync(path.join(__dirname, '../public/logo.svg'));
const outputDir = path.join(__dirname, '../public/icons');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

async function generateIcons() {
  console.log('Generating icons...');
  
  for (const size of sizes) {
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(path.join(outputDir, `icon-${size}x${size}.png`));
    console.log(`Generated icon-${size}x${size}.png`);
  }

  // Generate simple named versions for manifest convenience if needed
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(outputDir, 'icon-192.png'));
  console.log('Generated icon-192.png');

  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(outputDir, 'icon-512.png'));
  console.log('Generated icon-512.png');

  // Maskable - normally needs padding, but our SVG background covers full rect, so it's safe for now.
  // Ideally, we'd add 10% padding for safe area logic, but simple resize works for "purpose: maskable" if the icon is full bleed color.
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(outputDir, 'icon-maskable.png'));
    
  // Also save a specific name if the user requested it or we use it in manifest
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(outputDir, 'icon-512x512-maskable.png'));
    
  console.log('Generated maskable icons');
}

generateIcons().catch(console.error);
