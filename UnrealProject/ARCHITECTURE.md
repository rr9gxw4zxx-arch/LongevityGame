# 洪荒长生 - UE5 Architecture Design

## Overview

This document describes the Unreal Engine 5 architecture for 洪荒长生 (Longevity Game), a 3A realistic-style open world cultivation game. The project leverages UE5's Nanite, Lumen, World Partition, and Landscape systems to create photorealistic Chinese mythology environments.

## Technology Stack

- **Engine**: Unreal Engine 5.4+
- **Rendering**: Nanite (virtualized geometry), Lumen (global illumination)
- **World**: World Partition + Level Streaming for 4km x 4km map
- **Terrain**: Landscape system with multi-layer materials
- **Animation**: Control Rig + IK for character animation
- **AI**: Behavior Trees + EQS for enemy/NPC AI
- **UI**: Common UI + UMG for cross-platform HUD

## Class Architecture

### Mapping from JS to UE5 C++

| JS Module | UE5 Class | Type |
|-----------|-----------|------|
| `GameEngine.js` | `ALongevityGameMode` | AGameModeBase |
| `Entity.js` | `ALongevityCharacterBase` | ACharacter |
| `Player.js` | `ALongevityPlayerCharacter` | ACharacter |
| `PlayerController.js` | `ALongevityPlayerController` | APlayerController |
| `Enemy.js` | `ALongevityEnemy` | ACharacter |
| `NPC.js` | `ALongevityNPC` | ACharacter |
| `BattleSystem.js` | `UBattleComponent` | UActorComponent |
| `MapSystem.js` | `AWorldManager` | AActor (manages World Partition) |
| `WorldData.js` | DataTables (CSV/JSON) | UDataTable |
| `HUD.js` | `ULongevityHUD` | UUserWidget |
| `SpriteRenderer.js` | Skeletal Mesh + Anim BP | N/A (visual) |

### Core Systems

```
ALongevityGameMode
├── AWorldManager (world regions, streaming)
├── UQuestSubsystem (GameInstance subsystem)
└── UDialogueSubsystem (GameInstance subsystem)

ALongevityPlayerCharacter
├── UCultivationComponent (realms, exp, leveling)
├── UBattleComponent (combat, skills, cooldowns)
├── UInventoryComponent (gold, items)
└── UInteractionComponent (NPC talk radius)

ALongevityEnemy
├── UBattleComponent (shared combat logic)
├── UAIPatrolComponent (movement AI)
└── BehaviorTree (AI decision making)

ALongevityNPC
├── UDialogueComponent (dialogue lines, cycling)
└── UInteractionComponent (talk radius trigger)
```

## Module Details

### 1. Cultivation System (`UCultivationComponent`)

Manages the player's cultivation realm progression (15 realms from 炼气期 to 圣人).

```cpp
// Key properties
int32 CurrentRealm;       // 1-15
int32 Level;              // Within current realm
float Experience;
float ExperienceToNext;

// Key methods
void AddExperience(float Amount);
bool TryBreakthrough();   // Attempt realm advancement
float GetRealmMultiplier();
```

**Data-driven**: Realm definitions stored in `DT_CultivationRealms` DataTable.

### 2. Battle System (`UBattleComponent`)

Handles combat calculations, skill usage, and cooldowns. Shared between Player and Enemy.

```cpp
// Key properties
float MaxHP, CurrentHP;
float Attack, Defense;
TMap<FName, float> SkillCooldowns;

// Key methods
float CalculateDamage(UBattleComponent* Target);
bool UseSkill(FName SkillId, AActor* Target);
void TakeDamage(float Amount, AActor* Instigator);
void ApplyEffect(const FSkillEffect& Effect);
```

**Damage formula**: `Damage = Attack * Random(0.8, 1.2) - Defense * 0.5` (min 1)

### 3. NPC & Dialogue (`ALongevityNPC` + `UDialogueComponent`)

NPCs with positional dialogue triggers and cycling conversation lines.

```cpp
// UDialogueComponent
TArray<FText> DialogueLines;
int32 CurrentIndex;
float TalkRadius;

void StartDialogue();
FText GetCurrentLine();
void AdvanceDialogue();  // Cycles back to 0 after last
void EndDialogue();
bool IsPlayerNearby(AActor* Player);
```

### 4. World Manager (`AWorldManager`)

Manages the 4 world regions using World Partition and Level Streaming.

| Region | Location | Theme | Size |
|--------|----------|-------|------|
| 终南山·清虚观 | (0,0) | Mountain temple, misty forests | 2000m x 2000m |
| 东海之滨 | (2000,0) | Coastal cliffs, island archipelago | 2000m x 2000m |
| 昆仑山 | (0,2000) | Snow peaks, ancient ruins | 2000m x 2000m |
| 火云洞 | (2000,2000) | Volcanic cave, sacred temple | 2000m x 2000m |

### 5. Enemy AI (`ALongevityEnemy`)

Uses Behavior Trees for AI decisions:
- **Patrol**: Random wandering within bounds (matching JS `moveInterval` logic)
- **Chase**: Pursue player when detected
- **Attack**: Enter combat at range
- **Flee**: Low HP retreat (boss enemies don't flee)

### 6. Quest System (`UQuestSubsystem`)

GameInstance subsystem managing quest state:
- Main quests (sequential story)
- Side quests (triggered by NPC dialogue)
- Objectives: talk, cultivate, find, defeat

## Data Tables

| DataTable | Content |
|-----------|---------|
| `DT_CultivationRealms` | 15 realms with name, color, multiplier |
| `DT_Skills` | Skill definitions: damage, cooldown, effects |
| `DT_NPCs` | NPC data: name, role, realm, dialogue, position |
| `DT_Enemies` | Enemy stats: HP, attack, defense, exp, gold |
| `DT_Quests` | Quest definitions with objectives and rewards |

## Rendering Pipeline

### Landscape & Terrain
- **Material**: Multi-layer landscape material with distance-based blending
  - Layer 1: Grass/moss (auto-slope painting)
  - Layer 2: Rock/cliff faces
  - Layer 3: Snow (altitude-based)
  - Layer 4: Sand/dirt paths
  - Layer 5: Water edge blend
- **Foliage**: Nanite-enabled procedural foliage (trees, grass, flowers)
- **Water**: Single Layer Water with Gerstner waves

### Lighting
- **Lumen GI**: Hardware ray tracing for realistic bounce light
- **Volumetric fog**: For mountain mist and cave atmospherics
- **Time of day**: Dynamic sky with sun/moon cycle

### Characters
- **Mesh**: High-poly Nanite meshes for characters
- **Animation**: Motion-matched locomotion, Combat montages
- **Cloth**: Chaos cloth sim for flowing robes (仙侠 aesthetic)

## Build Configuration

### Target Platforms
- Windows PC (primary)
- iOS (via UE5 iOS deployment, replaces Cordova)
- Console (future)

### Key Plugins
- `CommonUI` — Cross-platform UI framework
- `GameplayAbilities` — GAS for skill/buff system (optional upgrade path)
- `EnhancedInput` — Modern input mapping

## File Structure

```
UnrealProject/
├── Source/LongevityGame/
│   ├── LongevityGame.Build.cs
│   ├── LongevityGame.h / .cpp
│   ├── Public/
│   │   ├── Core/
│   │   │   ├── LongevityGameMode.h
│   │   │   └── LongevityPlayerController.h
│   │   ├── Characters/
│   │   │   ├── LongevityCharacterBase.h
│   │   │   ├── LongevityPlayerCharacter.h
│   │   │   ├── LongevityEnemy.h
│   │   │   └── LongevityNPC.h
│   │   ├── Components/
│   │   │   ├── CultivationComponent.h
│   │   │   ├── BattleComponent.h
│   │   │   ├── DialogueComponent.h
│   │   │   └── InteractionComponent.h
│   │   ├── Systems/
│   │   │   └── WorldManager.h
│   │   └── Data/
│   │       └── LongevityDataTypes.h
│   └── Private/
│       ├── Core/
│       ├── Characters/
│       ├── Components/
│       └── Systems/
├── Config/
│   └── DefaultGame.ini
└── Content/
    └── Data/
        ├── DT_CultivationRealms.json
        ├── DT_Skills.json
        ├── DT_NPCs.json
        └── DT_Enemies.json
```
