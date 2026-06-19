#pragma once

#include "CoreMinimal.h"
#include "Engine/DataTable.h"
#include "LongevityDataTypes.generated.h"

/**
 * Cultivation realm definition (修炼境界)
 * Maps from: WorldData.js CULTIVATION_REALMS
 */
USTRUCT(BlueprintType)
struct FCultivationRealmData : public FTableRowBase
{
    GENERATED_BODY()

    UPROPERTY(EditAnywhere, BlueprintReadOnly)
    int32 RealmId = 0;

    UPROPERTY(EditAnywhere, BlueprintReadOnly)
    FText RealmName;

    UPROPERTY(EditAnywhere, BlueprintReadOnly)
    FLinearColor DisplayColor = FLinearColor::White;

    UPROPERTY(EditAnywhere, BlueprintReadOnly)
    float StatMultiplier = 1.0f;

    UPROPERTY(EditAnywhere, BlueprintReadOnly)
    float ExperienceRequired = 100.0f;
};

/**
 * Skill effect definition
 */
USTRUCT(BlueprintType)
struct FSkillEffect
{
    GENERATED_BODY()

    UPROPERTY(EditAnywhere, BlueprintReadOnly)
    FName EffectType; // "buff", "damage_over_time", "heal"

    UPROPERTY(EditAnywhere, BlueprintReadOnly)
    FName AffectedStat; // "maxHp", "attack", "defense"

    UPROPERTY(EditAnywhere, BlueprintReadOnly)
    float Value = 0.0f;

    UPROPERTY(EditAnywhere, BlueprintReadOnly)
    float Duration = 0.0f; // 0 = permanent
};

/**
 * Skill definition (技能)
 * Maps from: WorldData.js SKILLS
 */
USTRUCT(BlueprintType)
struct FSkillData : public FTableRowBase
{
    GENERATED_BODY()

    UPROPERTY(EditAnywhere, BlueprintReadOnly)
    FName SkillId;

    UPROPERTY(EditAnywhere, BlueprintReadOnly)
    FText SkillName;

    UPROPERTY(EditAnywhere, BlueprintReadOnly)
    FText Description;

    UPROPERTY(EditAnywhere, BlueprintReadOnly)
    FName IconPath;

    UPROPERTY(EditAnywhere, BlueprintReadOnly)
    float Damage = 0.0f;

    UPROPERTY(EditAnywhere, BlueprintReadOnly)
    float Cooldown = 0.0f; // seconds

    UPROPERTY(EditAnywhere, BlueprintReadOnly)
    FSkillEffect Effect;

    UPROPERTY(EditAnywhere, BlueprintReadOnly)
    int32 RequiredRealm = 1;
};

/**
 * NPC definition
 * Maps from: WorldData.js NPC_DATA
 */
USTRUCT(BlueprintType)
struct FNPCData : public FTableRowBase
{
    GENERATED_BODY()

    UPROPERTY(EditAnywhere, BlueprintReadOnly)
    FName NPCId;

    UPROPERTY(EditAnywhere, BlueprintReadOnly)
    FText NPCName;

    UPROPERTY(EditAnywhere, BlueprintReadOnly)
    FText Role;

    UPROPERTY(EditAnywhere, BlueprintReadOnly)
    int32 Realm = 1;

    UPROPERTY(EditAnywhere, BlueprintReadOnly)
    TArray<FText> DialogueLines;

    UPROPERTY(EditAnywhere, BlueprintReadOnly)
    FVector SpawnPosition = FVector::ZeroVector;
};

/**
 * Enemy definition
 * Maps from: WorldData.js ENEMIES
 */
USTRUCT(BlueprintType)
struct FEnemyData : public FTableRowBase
{
    GENERATED_BODY()

    UPROPERTY(EditAnywhere, BlueprintReadOnly)
    FName EnemyId;

    UPROPERTY(EditAnywhere, BlueprintReadOnly)
    FText EnemyName;

    UPROPERTY(EditAnywhere, BlueprintReadOnly)
    int32 Realm = 1;

    UPROPERTY(EditAnywhere, BlueprintReadOnly)
    float MaxHP = 100.0f;

    UPROPERTY(EditAnywhere, BlueprintReadOnly)
    float Attack = 10.0f;

    UPROPERTY(EditAnywhere, BlueprintReadOnly)
    float Defense = 5.0f;

    UPROPERTY(EditAnywhere, BlueprintReadOnly)
    float ExperienceReward = 20.0f;

    UPROPERTY(EditAnywhere, BlueprintReadOnly)
    int32 GoldReward = 10;

    UPROPERTY(EditAnywhere, BlueprintReadOnly)
    bool bIsBoss = false;

    UPROPERTY(EditAnywhere, BlueprintReadOnly)
    float PatrolSpeed = 300.0f;

    UPROPERTY(EditAnywhere, BlueprintReadOnly)
    float ChaseSpeed = 500.0f;
};

/**
 * Quest objective
 */
USTRUCT(BlueprintType)
struct FQuestObjective
{
    GENERATED_BODY()

    UPROPERTY(EditAnywhere, BlueprintReadOnly)
    FName ObjectiveType; // "talk", "cultivate", "find", "defeat"

    UPROPERTY(EditAnywhere, BlueprintReadOnly)
    FName TargetId;

    UPROPERTY(EditAnywhere, BlueprintReadOnly)
    FText Description;

    UPROPERTY(EditAnywhere, BlueprintReadOnly)
    int32 RequiredCount = 1;

    UPROPERTY(EditAnywhere, BlueprintReadOnly)
    float RequiredDuration = 0.0f; // for "cultivate" type

    UPROPERTY(BlueprintReadOnly)
    int32 CurrentCount = 0;

    UPROPERTY(BlueprintReadOnly)
    bool bCompleted = false;
};

/**
 * Quest rewards
 */
USTRUCT(BlueprintType)
struct FQuestRewards
{
    GENERATED_BODY()

    UPROPERTY(EditAnywhere, BlueprintReadOnly)
    float Experience = 0.0f;

    UPROPERTY(EditAnywhere, BlueprintReadOnly)
    int32 Gold = 0;

    UPROPERTY(EditAnywhere, BlueprintReadOnly)
    int32 RealmAdvance = 0; // realms to advance (usually 0 or 1)
};

/**
 * Quest definition
 * Maps from: WorldData.js QUESTS
 */
USTRUCT(BlueprintType)
struct FQuestData : public FTableRowBase
{
    GENERATED_BODY()

    UPROPERTY(EditAnywhere, BlueprintReadOnly)
    FName QuestId;

    UPROPERTY(EditAnywhere, BlueprintReadOnly)
    FName QuestType; // "main", "side"

    UPROPERTY(EditAnywhere, BlueprintReadOnly)
    FText Title;

    UPROPERTY(EditAnywhere, BlueprintReadOnly)
    FText Description;

    UPROPERTY(EditAnywhere, BlueprintReadOnly)
    TArray<FQuestObjective> Objectives;

    UPROPERTY(EditAnywhere, BlueprintReadOnly)
    FQuestRewards Rewards;
};

/**
 * World region definition
 * Maps from: WorldData.js WORLD_CONFIG.regions
 */
USTRUCT(BlueprintType)
struct FWorldRegionData : public FTableRowBase
{
    GENERATED_BODY()

    UPROPERTY(EditAnywhere, BlueprintReadOnly)
    FName RegionId;

    UPROPERTY(EditAnywhere, BlueprintReadOnly)
    FText RegionName;

    UPROPERTY(EditAnywhere, BlueprintReadOnly)
    FText Description;

    UPROPERTY(EditAnywhere, BlueprintReadOnly)
    FVector2D WorldPosition = FVector2D::ZeroVector;

    UPROPERTY(EditAnywhere, BlueprintReadOnly)
    FVector2D RegionSize = FVector2D(200000.0f, 200000.0f); // cm (2km)

    UPROPERTY(EditAnywhere, BlueprintReadOnly)
    FName LevelStreamingName;
};
