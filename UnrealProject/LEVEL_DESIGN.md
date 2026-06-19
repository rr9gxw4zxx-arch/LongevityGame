# Level Design - 四大区域场景设计

## Overview

The game world is 4km x 4km divided into 4 regions (2km x 2km each). Each region has distinct terrain, vegetation, architecture, and atmosphere.

---

## Region 1: 终南山·清虚观 (Zhongnan Mountain - Qingxu Temple)

**Location**: Northwest (0, 0) - (2000m, 2000m)  
**Theme**: Misty mountain temple, Daoist sanctuary  
**Mood**: Serene, mystical, morning mist

### Terrain
- **Elevation**: 200m - 1200m altitude
- **Profile**: Steep mountain peaks with gentle plateaus for buildings
- **Ground**: Moss-covered rock, packed earth paths, ancient stone steps
- **Features**: Waterfalls (3), cliff faces, bamboo groves, meditation caves

### Vegetation
- **Trees**: Ancient pines (松树), bamboo (竹林), plum blossoms (梅花)
- **Ground cover**: Moss, ferns, wild orchids
- **Density**: Dense bamboo forests at lower altitudes, sparse at peaks
- **Special**: Glowing spiritual herbs at cultivation spots

### Architecture
- **Main temple**: 清虚观 - Large multi-tiered Daoist temple complex
  - Main hall (大殿): Player spawn point
  - Library pavilion (藏经阁)
  - Alchemy lab (丹房)
  - Meditation courtyard (静修院)
- **Style**: Tang dynasty Daoist architecture, aged wood + stone
- **Materials**: Weathered wood beams, grey roof tiles, stone foundations
- **Details**: Incense smoke, hanging lanterns, calligraphy scrolls

### Atmosphere
- **Lighting**: Volumetric fog, god rays through bamboo canopy
- **Particles**: Floating spiritual energy motes, incense smoke
- **Audio**: Wind through bamboo, distant waterfall, temple bells
- **Time of day**: Best at dawn/dusk for golden light through mist

### Key Locations
| Location | Purpose | Position |
|----------|---------|----------|
| 大殿 (Main Hall) | Player spawn, save point | (1000m, 1000m) |
| 练功场 (Training Ground) | Combat tutorial | (900m, 1100m) |
| 灵泉 (Spirit Spring) | Healing point | (1200m, 800m) |
| 山门 (Mountain Gate) | Region boundary | (1800m, 1000m) |

---

## Region 2: 东海之滨 (Eastern Sea Shore)

**Location**: Northeast (2000m, 0) - (4000m, 2000m)  
**Theme**: Coastal cliffs, island archipelago, immortal island  
**Mood**: Vast, mysterious, oceanic power

### Terrain
- **Elevation**: -20m (sea floor) to 300m (cliff tops)
- **Profile**: Dramatic sea cliffs, sandy beaches, underwater caves
- **Ground**: Sand, wet rock, coral formations, sea grass
- **Features**: Sea stacks, tide pools, submerged ruins, floating islands

### Water System
- **Ocean**: Single Layer Water with Gerstner waves
- **Properties**: Deep blue-green, whitecap foam, underwater caustics
- **Tide system**: Dynamic water level (±2m range)
- **Waterfalls**: Cliff face waterfalls into ocean

### Vegetation
- **Trees**: Coastal pines bent by wind, palm trees on islands
- **Ground cover**: Sea grass, beach flowers, coral (underwater)
- **Special**: Bioluminescent algae in underwater caves (night only)

### Architecture
- **Fishing village**: Stilted wooden houses on cliff edge
- **Sunken temple**: Partially submerged ancient structure
- **Floating island**: Small immortal pavilion accessible by flight
- **Style**: Maritime Chinese, weathered by salt and wind

### Atmosphere
- **Lighting**: Bright blue sky, dramatic cloud formations
- **Particles**: Sea spray, floating foam, underwater bubbles
- **Audio**: Crashing waves, seagulls, underwater muffled ambience
- **Weather**: Occasional storms with lightning

---

## Region 3: 昆仑山 (Kunlun Mountain)

**Location**: Southwest (0, 2000m) - (2000m, 4000m)  
**Theme**: Snow-capped peaks, ancient ruins, ancestral mountain  
**Mood**: Majestic, cold, ancient power

### Terrain
- **Elevation**: 800m - 3000m altitude
- **Profile**: Massive peaks, glaciers, ice caves, frozen lakes
- **Ground**: Snow, ice, exposed granite, frozen soil
- **Features**: Glacial crevasses, ice bridges, aurora viewing points

### Snow System
- **Coverage**: Altitude-based (snow above 1500m, full coverage above 2000m)
- **Depth**: 0.2 - 1.5m with footprint deformation
- **Physics**: Avalanche danger zones, ice surface sliding
- **Visual**: Subsurface scattering on snow, sparkle in direct light

### Vegetation
- **Trees**: Sparse ancient pines at lower altitudes, dead trees above snowline
- **Ground cover**: Lichen, frozen grass patches
- **Special**: Ice crystal formations with inner glow

### Architecture
- **Ancient ruins**: 万年前的仙人遗迹
  - Broken stone pillars with rune inscriptions
  - Collapsed great hall with frozen artifacts
  - Ice-preserved library scrolls
- **Ice palace**: Hidden within glacier
- **Style**: Pre-historical mythological, massive scale, partially destroyed

### Atmosphere
- **Lighting**: Cool blue shadows, blinding snow reflections
- **Particles**: Falling snow, ice crystals, breath vapor
- **Audio**: Howling wind, creaking ice, distant thunder
- **Special**: Northern lights (aurora) during night

---

## Region 4: 火云洞 (Huoyun Cave)

**Location**: Southeast (2000m, 2000m) - (4000m, 4000m)  
**Theme**: Volcanic landscape, sacred cave, realm of the Three Sovereigns  
**Mood**: Powerful, dangerous, divine

### Terrain
- **Elevation**: 100m - 800m altitude
- **Profile**: Volcanic peaks, lava fields, basalt columns, deep cave systems
- **Ground**: Black basalt, cooled lava, volcanic ash, obsidian
- **Features**: Active lava flows, geysers, magma chambers, crystal caves

### Lava System
- **Flow**: Animated lava rivers with flow maps
- **Material**: Emissive orange/red with cooling crust breakup
- **Interaction**: Environmental damage zones
- **Geysers**: Periodic steam/fire eruptions

### Vegetation
- **Trees**: Fire-resistant ancient banyan trees
- **Ground cover**: Volcanic moss, ember flowers (fantasy)
- **Special**: Crystal formations in cave system (growing from walls/ceiling)

### Architecture
- **火云洞 (Main cave)**: Massive natural cave, home of the Three Sovereigns
  - Entrance: Guarded by stone sentinels
  - Main chamber: 200m diameter, stalactites, central fire altar
  - Three thrones: 伏羲, 神农, 轩辕
- **Forges**: Ancient weapon/artifact crafting stations
- **Style**: Natural cave enhanced with divine construction, gold + obsidian

### Atmosphere
- **Lighting**: Orange glow from lava, dramatic shadows
- **Particles**: Embers rising, smoke, heat haze distortion
- **Audio**: Deep rumbling, bubbling lava, echoing footsteps
- **Special**: Screen heat distortion near lava, emissive environment

---

## Cross-Region Elements

### Transition Zones
- Gradual biome blending at borders (100m transition width)
- Terrain material layering handles seamless blending
- Vegetation density fades between regions

### World Partition Settings
- Each region = one World Partition cell
- Runtime streaming distance: 500m
- LOD transitions: Nanite handles automatically

### Performance Targets
- 60 FPS at 1440p on RTX 3070 / RX 6800
- Draw distance: 2km (full region visible)
- Nanite proxy mesh distance: 1km
- Lumen GI: hardware ray tracing enabled
