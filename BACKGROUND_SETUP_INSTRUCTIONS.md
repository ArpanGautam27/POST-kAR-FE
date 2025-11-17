# Background Components Setup Instructions

## Overview
You need to manually create 3 large component files (Hyperspeed, Galaxy, Orb) because they exceed the file size limits for automated creation.

## Files Already Created ✅
- ✅ `/src/components/ui/Particles.tsx` - Complete
- ✅ `/src/components/ui/Particles.css` - Complete
- ✅ `/src/components/ui/Hyperspeed.css` - Updated
- ✅ `/src/components/ui/Galaxy.css` - Complete
- ✅ `/src/components/ui/Orb.css` - Complete

## Files You Need to Create Manually 📝

### 1. Hyperspeed Component (Featured Products Section)
**File:** `/src/components/ui/Hyperspeed.tsx`

Copy the FULL Hyperspeed component code you provided (approximately 1000+ lines) including:
- All distortions (mountainDistortion, xyDistortion, LongRaceDistortion, turbulentDistortion, etc.)
- CarLights class
- LightsSticks class
- Road class
- App class
- All shader code (carLightsFragment, carLightsVertex, sideSticksVertex, etc.)
- The Hyperspeed React component at the end
- Export `hyperspeedPresets` object

### 2. Galaxy Component (Services Section)
**File:** `/src/components/ui/Galaxy.tsx`

Copy the Galaxy component code you provided including:
- vertexShader and fragmentShader
- GalaxyProps interface
- Galaxy component with OGL renderer setup
- All GLSL shader code for star rendering

### 3. Orb Component (Join Our Community Section)  
**File:** `/src/components/ui/Orb.tsx`

Copy the Orb component code you provided including:
- OrbProps interface
- Vertex and fragment shaders
- Orb component with OGL rendering
- Mouse interaction and hover effects

## After Creating the Files

### Step 1: Uncomment Imports in LandingPage.tsx
Find these lines (around line 26-29):
```typescript
// import Hyperspeed from '../components/ui/Hyperspeed';
// import Particles from '../components/ui/Particles';
// import Galaxy from '../components/ui/Galaxy';
// import Orb from '../components/ui/Orb';
```

Uncomment them:
```typescript
import Hyperspeed from '../components/ui/Hyperspeed';
import Particles from '../components/ui/Particles';
import Galaxy from '../components/ui/Galaxy';
import Orb from '../components/ui/Orb';
```

### Step 2: Uncomment Background Components

#### Community Spotlight (Particles)
Find around line 338-350 and uncomment:
```tsx
<div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }}>
  <Particles
    particleColors={['#f093fb', '#f5576c']}
    particleCount={200}
    particleSpread={10}
    speed={0.1}
    particleBaseSize={100}
    moveParticlesOnHover={true}
    alphaParticles={false}
    disableRotation={false}
  />
</div>
```

#### Featured Products (Hyperspeed)
Find around line 373-395 and uncomment:
```tsx
<div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }}>
  <Hyperspeed
    effectOptions={{
      distortion: 'turbulentDistortion',
      length: 400,
      roadWidth: 10,
      islandWidth: 2,
      lanesPerRoad: 4,
      fov: 90,
      colors: {
        roadColor: 0x080808,
        islandColor: 0x0a0a0a,
        background: 0x000000,
        shoulderLines: 0xFFFFFF,
        brokenLines: 0xFFFFFF,
        leftCars: [0xD856BF, 0x6750A2, 0xC247AC],
        rightCars: [0x03B3C3, 0x0E5EA5, 0x324555],
        sticks: 0x03B3C3,
      }
    }}
  />
</div>
```

#### Services (Galaxy)
Find around line 445-456 and uncomment:
```tsx
<div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }}>
  <Galaxy 
    mouseRepulsion={true}
    mouseInteraction={true}
    density={1.5}
    glowIntensity={0.5}
    saturation={0.8}
    hueShift={140}
    transparent={true}
  />
</div>
```

#### Join Our Community (Orb)
Find around line 519-527 and uncomment:
```tsx
<div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }}>
  <Orb
    hoverIntensity={0.5}
    rotateOnHover={true}
    hue={260}
    forceHoverState={false}
  />
</div>
```

## Testing

After creating all files and uncommenting:

1. **Check for TypeScript errors:**
   ```bash
   npm run type-check
   ```

2. **Run dev server:**
   ```bash
   npm run dev
   ```

3. **Test each section:**
   - **Community Spotlight:** Should have pink/purple floating particles
   - **Featured Products:** Should have hyperspeed road effect with lights
   - **Services:** Should have galaxy star field with mouse interaction
   - **Join Our Community:** Should have animated orb with hover effects

## Dependencies
All required dependencies are already installed:
- ✅ `three` - For 3D rendering
- ✅ `@types/three` - TypeScript types
- ✅ `postprocessing` - For Hyperspeed bloom effects
- ✅ `ogl` - For Particles, Galaxy, and Orb rendering

## Troubleshooting

**If you get import errors:**
- Make sure all 3 tsx files are created in `/src/components/ui/`
- Check that file names match exactly (case-sensitive)
- Ensure all exports are correct (default exports)

**If backgrounds don't show:**
- Check browser console for errors
- Verify the background divs are uncommented
- Make sure `zIndex: 0` on background and `zIndex: 1` on content

**Performance issues:**
- Reduce `particleCount` in Particles
- Lower `density` in Galaxy
- Adjust `lightPairsPerRoadWay` in Hyperspeed options
